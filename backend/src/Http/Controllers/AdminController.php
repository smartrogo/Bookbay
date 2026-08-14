<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Models\Book;
use Bookbay\Models\BorrowRequest;
use Bookbay\Models\ExchangeRequest;
use Bookbay\Models\Message;
use Bookbay\Models\NewsletterSubscriber;
use Bookbay\Models\Order;
use Bookbay\Models\Review;
use Bookbay\Models\User;
use Bookbay\Services\AuthService;
use Bookbay\Services\AuditService;
use Bookbay\Services\BookService;
use Bookbay\Services\BorrowService;
use Bookbay\Services\NotificationService;

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
            $roleId = (int) ($user['role_id'] ?? 2);
            $roleName = match($roleId) {
                1 => 'admin',
                3 => 'superadmin',
                default => 'user',
            };

            return [
                'id' => (int) $user['id'],
                'name' => (string) $user['name'],
                'email' => (string) $user['email'],
                'phone' => (string) ($user['phone'] ?? ''),
                'role' => $roleName,
                'role_id' => $roleId,
                'is_admin' => ((int) ($user['is_admin'] ?? 0)) === 1,
                'is_superadmin' => ((int) ($user['is_superadmin'] ?? 0)) === 1,
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

    // ── User Management ─────────────────────────────────────────────

    public function updateUser(int $id): never
    {
        $admin = $this->requireAdmin();
        $data = $this->request()->input();

        $user = User::find($id);
        if ($user === null) {
            Response::json(['message' => 'User not found.'], 404);
        }

        $clean = [];
        $allowed = ['name', 'phone', 'status', 'is_admin', 'is_superadmin', 'role_id'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $clean[$field] = $data[$field];
            }
        }

        // Only superadmin can modify admin/superadmin status
        if ((isset($clean['is_admin']) || isset($clean['is_superadmin']) || isset($clean['role_id'])) && !AuthService::isSuperAdmin($admin)) {
            Response::json(['message' => 'Only superadmins can modify admin roles.'], 403);
        }

        // Prevent admins from demoting themselves
        if (isset($clean['is_admin']) && (int) $admin['id'] === $id && !$clean['is_admin']) {
            Response::json(['message' => 'You cannot remove your own admin privileges.'], 422);
        }

        // Prevent superadmins from removing their own superadmin status
        if (isset($clean['is_superadmin']) && (int) $admin['id'] === $id && !$clean['is_superadmin']) {
            Response::json(['message' => 'You cannot remove your own superadmin privileges.'], 422);
        }

        if (isset($clean['role_id'])) {
            $clean['role_id'] = (int) $clean['role_id'];
            $clean['is_admin'] = $clean['role_id'] === 1 ? 1 : ($clean['is_admin'] ?? $user['is_admin']);
            $clean['is_superadmin'] = $clean['role_id'] === 3 ? 1 : ($clean['is_superadmin'] ?? $user['is_superadmin']);
        }

        User::update($id, $clean);

        AuditService::log((int) $admin['id'], 'admin.user.update', ['user_id' => $id, 'fields' => array_keys($clean)]);

        $this->json(['success' => true, 'user' => $this->formatUser(User::find($id))]);
    }

    public function deleteUser(int $id): never
    {
        $admin = $this->requireAdmin();

        // Only superadmin can delete other admins/superadmins
        $target = User::find($id);
        if ($target !== null && ((int) ($target['is_admin'] ?? 0) === 1 || (int) ($target['is_superadmin'] ?? 0) === 1)) {
            if (!AuthService::isSuperAdmin($admin)) {
                Response::json(['message' => 'Only superadmins can delete admin users.'], 403);
            }
        }

        if ((int) $admin['id'] === $id) {
            Response::json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user = User::find($id);
        if ($user === null) {
            Response::json(['message' => 'User not found.'], 404);
        }

        User::delete($id);

        AuditService::log((int) $admin['id'], 'admin.user.delete', ['user_id' => $id]);

        $this->json(['success' => true, 'message' => 'User deleted.']);
    }

    // ── Order Management ────────────────────────────────────────────

    public function orders(): never
    {
        $this->requireAdmin();

        $status = (string) $this->request()->query('status', '');
        $q = trim((string) $this->request()->query('q', ''));

        $sql = 'SELECT o.*, u.name AS customer_name, u.email AS customer_email, '
            . '(SELECT oi.title FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id LIMIT 1) AS first_book '
            . 'FROM orders o JOIN users u ON u.id = o.user_id';
        $params = [];
        $where = [];

        if ($status !== '') {
            $where[] = 'o.status = ?';
            $params[] = $status;
        }

        if ($q !== '') {
            $where[] = '(u.name LIKE ? OR u.email LIKE ? OR o.reference LIKE ?)';
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        $sql .= ' ORDER BY o.id DESC';

        $orders = Order::queryAll($sql, $params);

        $this->json(['orders' => $orders]);
    }

    public function updateOrder(int $id): never
    {
        $admin = $this->requireAdmin();

        $order = Order::find($id);
        if ($order === null) {
            Response::json(['message' => 'Order not found.'], 404);
        }

        $data = $this->request()->input();
        $status = (string) ($data['status'] ?? '');

        $validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
        if (!in_array($status, $validStatuses, true)) {
            Response::json(['message' => 'Invalid status. Must be: ' . implode(', ', $validStatuses)], 422);
        }

        Order::update($id, ['status' => $status]);

        // Notify user about order status change
        NotificationService::send(
            (int) $order['user_id'],
            'Order status updated',
            "Your order #{$id} has been updated to: {$status}."
        );

        AuditService::log((int) $admin['id'], 'admin.order.update', ['order_id' => $id, 'status' => $status]);

        $this->json(['success' => true, 'order' => Order::find($id)]);
    }

    // ── Review Management ───────────────────────────────────────────

    public function reviews(): never
    {
        $this->requireAdmin();

        $bookId = (int) $this->request()->query('book_id', 0);

        $sql = 'SELECT r.*, u.name AS user_name, b.title AS book_title '
            . 'FROM reviews r JOIN users u ON u.id = r.user_id JOIN books b ON b.id = r.book_id';
        $params = [];

        if ($bookId > 0) {
            $sql .= ' WHERE r.book_id = ?';
            $params[] = $bookId;
        }

        $sql .= ' ORDER BY r.id DESC';

        $reviews = Review::queryAll($sql, $params);

        $this->json(['reviews' => $reviews]);
    }

    public function deleteReview(int $id): never
    {
        $admin = $this->requireAdmin();

        $review = Review::find($id);
        if ($review === null) {
            Response::json(['message' => 'Review not found.'], 404);
        }

        Review::delete($id);

        AuditService::log((int) $admin['id'], 'admin.review.delete', ['review_id' => $id]);

        $this->json(['success' => true, 'message' => 'Review deleted.']);
    }

    // ── Exchange Management ─────────────────────────────────────────

    public function exchanges(): never
    {
        $this->requireAdmin();

        $status = (string) $this->request()->query('status', '');

        $sql = 'SELECT er.*, '
            . 'u.name AS requester_name, u.email AS requester_email, '
            . 'ob.title AS offered_book_title, '
            . 'wb.title AS wanted_book_title '
            . 'FROM exchange_requests er '
            . 'JOIN users u ON u.id = er.user_id '
            . 'JOIN books ob ON ob.id = er.offered_book_id '
            . 'JOIN books wb ON wb.id = er.wanted_book_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE er.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY er.id DESC';

        $exchanges = ExchangeRequest::queryAll($sql, $params);

        $this->json(['exchanges' => $exchanges]);
    }

    public function updateExchange(int $id): never
    {
        $admin = $this->requireAdmin();

        $exchange = ExchangeRequest::find($id);
        if ($exchange === null) {
            Response::json(['message' => 'Exchange request not found.'], 404);
        }

        $data = $this->request()->input();
        $status = (string) ($data['status'] ?? '');

        $validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
        if (!in_array($status, $validStatuses, true)) {
            Response::json(['message' => 'Invalid status.'], 422);
        }

        ExchangeRequest::update($id, ['status' => $status]);

        NotificationService::send(
            (int) $exchange['user_id'],
            'Exchange request updated',
            "Your exchange request has been updated to: {$status}."
        );

        AuditService::log((int) $admin['id'], 'admin.exchange.update', ['exchange_id' => $id, 'status' => $status]);

        $this->json(['success' => true, 'exchange' => ExchangeRequest::find($id)]);
    }

    // ── Newsletter Management ────────────────────────────────────────

    public function subscribers(): never
    {
        $this->requireAdmin();

        $subscribers = NewsletterSubscriber::queryAll(
            'SELECT * FROM newsletter_subscribers ORDER BY id DESC'
        );

        $this->json(['subscribers' => $subscribers]);
    }

    public function deleteSubscriber(int $id): never
    {
        $admin = $this->requireAdmin();

        $subscriber = NewsletterSubscriber::find($id);
        if ($subscriber === null) {
            Response::json(['message' => 'Subscriber not found.'], 404);
        }

        NewsletterSubscriber::delete($id);

        AuditService::log((int) $admin['id'], 'admin.subscriber.delete', ['subscriber_id' => $id]);

        $this->json(['success' => true, 'message' => 'Subscriber removed.']);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private function formatUser(array $user): array
    {
        $roleId = (int) ($user['role_id'] ?? 2);
        $roleName = match($roleId) {
            1 => 'admin',
            3 => 'superadmin',
            default => 'user',
        };

        return [
            'id' => (int) $user['id'],
            'name' => (string) $user['name'],
            'email' => (string) $user['email'],
            'phone' => (string) ($user['phone'] ?? ''),
            'role' => $roleName,
            'role_id' => $roleId,
            'is_admin' => ((int) ($user['is_admin'] ?? 0)) === 1,
            'is_superadmin' => ((int) ($user['is_superadmin'] ?? 0)) === 1,
            'status' => (string) $user['status'],
            'joined' => (string) ($user['created_at'] ?? ''),
        ];
    }
}
