<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Models\Book;
use BookBay\Models\BorrowRequest;
use BookBay\Models\Message;
use BookBay\Models\Order;
use BookBay\Models\User;
use BookBay\Services\AuditService;
use BookBay\Services\BookService;
use BookBay\Services\BorrowService;

final class AdminController extends Controller
{
    public function dashboard(): never
    {
        $this->requireAdmin();

        $stats = [
            'total_users' => (int) (User::queryOne('SELECT COUNT(*) AS total FROM users')['total'] ?? 0),
            'total_books' => (int) (Book::queryOne('SELECT COUNT(*) AS total FROM books')['total'] ?? 0),
            'total_orders' => (int) (Order::queryOne('SELECT COUNT(*) AS total FROM orders')['total'] ?? 0),
            'total_revenue' => (float) (Order::queryOne(
                "SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status = 'completed'"
            )['total'] ?? 0),
            'pending_borrow_requests' => (int) (BorrowRequest::queryOne(
                "SELECT COUNT(*) AS total FROM borrow_requests WHERE status = 'pending'"
            )['total'] ?? 0),
            'pending_orders' => (int) (Order::queryOne(
                "SELECT COUNT(*) AS total FROM orders WHERE status = 'pending'"
            )['total'] ?? 0),
            'new_messages' => (int) (Message::queryOne(
                'SELECT COUNT(*) AS total FROM messages WHERE is_read = 0'
            )['total'] ?? 0),
        ];

        // Group order revenue by month (in PHP so it works on MySQL + SQLite).
        $byMonth = [];
        foreach (Order::queryAll('SELECT total, created_at FROM orders WHERE status = ?', ['completed']) as $order) {
            $month = substr((string) $order['created_at'], 0, 7);
            $byMonth[$month] = ($byMonth[$month] ?? 0) + (float) $order['total'];
        }

        $revenueByMonth = [];
        foreach ($byMonth as $month => $amount) {
            [$y, $m] = explode('-', $month);
            $revenueByMonth[] = [
                'month' => date('M', mktime(0, 0, 0, (int) $m, 1, (int) $y)),
                'amount' => round($amount, 2),
            ];
        }

        $recentOrders = Order::queryAll(
            'SELECT o.id, o.total, o.status, o.created_at AS date, u.name AS customer, '
            . '(SELECT oi.title FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id LIMIT 1) AS book '
            . 'FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC LIMIT 6'
        );

        $this->json([
            'stats' => $stats,
            'revenue_by_month' => $revenueByMonth,
            'recent_orders' => $recentOrders,
        ]);
    }

    public function users(): never
    {
        $this->requireAdmin();

        $q = trim((string) $this->request()->query('q', ''));

        $sql = 'SELECT id, name, email, phone, role_id, is_admin, status, created_at AS joined FROM users';
        $params = [];

        if ($q !== '') {
            $sql .= ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $sql .= ' ORDER BY id DESC';

        $users = array_map(static function (array $user): array {
            return [
                'id' => (int) $user['id'],
                'name' => (string) $user['name'],
                'email' => (string) $user['email'],
                'phone' => (string) ($user['phone'] ?? ''),
                'role' => ((int) ($user['role_id'] ?? 0)) === 1 ? 'admin' : 'user',
                'is_admin' => ((int) ($user['is_admin'] ?? 0)) === 1,
                'status' => (string) $user['status'],
                'joined' => (string) ($user['joined'] ?? ''),
            ];
        }, User::queryAll($sql, $params));

        $this->json(['users' => $users]);
    }

    public function books(): never
    {
        $this->requireAdmin();

        $request = $this->request();
        $filters = [
            'q' => $request->query('q', ''),
            'category' => $request->query('category', ''),
            'user_id' => $request->query('user_id', ''),
            'status' => $request->query('status', ''),
        ];

        $books = array_map(static function (array $book): array {
            return [
                'id' => (int) $book['id'],
                'title' => (string) $book['title'],
                'author' => (string) $book['author'],
                'category' => (string) ($book['category'] ?? ''),
                'price' => (float) $book['priceBuy'],
                'stock' => (int) $book['stock'],
                'status' => (string) $book['status'],
                'sellerId' => (int) $book['sellerId'],
            ];
        }, BookService::list($filters, true, 100, 0));

        $this->json(['books' => $books]);
    }

    public function updateBook(int $id): never
    {
        $admin = $this->requireAdmin();

        $book = Book::find($id);
        if ($book === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $data = $this->request()->input();
        $clean = [];

        foreach (['title', 'author', 'description', 'cover', 'cover_pic', 'stock', 'status', 'price_buy', 'price_borrow'] as $field) {
            if (array_key_exists($field, $data)) {
                $clean[$field] = $data[$field];
            }
        }

        foreach (['priceBuy' => 'price_buy', 'priceBorrow' => 'price_borrow', 'coverPic' => 'cover_pic'] as $from => $to) {
            if (array_key_exists($from, $data)) {
                $clean[$to] = $data[$from];
            }
        }

        Book::update($id, $clean);

        AuditService::log((int) $admin['id'], 'admin.book.update', ['book_id' => $id]);

        $this->json(['success' => true, 'book' => BookService::find($id)]);
    }

    public function borrow(): never
    {
        $this->requireAdmin();
        $status = (string) $this->request()->query('status', '');

        $this->json(['borrow_requests' => BorrowService::all($status)]);
    }

    public function updateBorrow(int $id): never
    {
        $admin = $this->requireAdmin();
        $status = (string) ($this->request()->input()['status'] ?? '');

        $this->json(BorrowService::decide($id, $status, (int) $admin['id']));
    }
}
