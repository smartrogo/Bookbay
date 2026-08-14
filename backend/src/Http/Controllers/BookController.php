<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Core\Validator;
use Bookbay\Models\Book;
use Bookbay\Services\AuditService;
use Bookbay\Services\AuthService;
use Bookbay\Services\BookService;

final class BookController extends Controller
{
    public function index(): never
    {
        $request = $this->request();
        $filters = [
            'q' => $request->query('q', ''),
            'category' => $request->query('category', ''),
            'user_id' => $request->query('user_id', ''),
            'status' => $request->query('status', ''),
        ];

        $limit = max(1, min(100, (int) $request->query('limit', 100)));
        $page = max(1, (int) $request->query('page', 1));

        $this->json(['books' => BookService::list($filters, false, $limit, ($page - 1) * $limit)]);
    }

    public function show(int $id): never
    {
        $book = BookService::find($id);

        if ($book === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $this->json(['book' => $book]);
    }

    public function userBooks(int $userId): never
    {
        $this->json(['books' => BookService::list(['user_id' => (string) $userId])]);
    }

    public function store(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        Validator::check($data, [
            'title' => 'required|max:191',
            'author' => 'required|max:191',
            'priceBuy' => 'numeric',
            'price_buy' => 'numeric',
            'priceBorrow' => 'numeric',
            'price_borrow' => 'numeric',
            'stock' => 'integer',
        ]);

        $book = BookService::sanitize($data, (int) $user['id']);
        $bookId = Book::create($book);

        AuditService::log((int) $user['id'], 'book.create', ['book_id' => $bookId]);

        $this->json([
            'success' => true,
            'message' => 'Book created.',
            'book' => BookService::find($bookId),
        ], 201);
    }

    public function update(int $id): never
    {
        $user = $this->requireAuth();

        $book = Book::find($id);
        if ($book === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $this->assertCanModify($user, (int) $book['seller_id']);

        $clean = BookService::sanitize($this->request()->input(), (int) $book['seller_id']);
        unset($clean['seller_id']); // never re-assign the seller via update

        Book::update($id, $clean);

        AuditService::log((int) $user['id'], 'book.update', ['book_id' => $id]);

        $this->json([
            'success' => true,
            'message' => 'Book updated.',
            'book' => BookService::find($id),
        ]);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAuth();

        $book = Book::find($id);
        if ($book === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $this->assertCanModify($user, (int) $book['seller_id']);

        Book::delete($id);

        AuditService::log((int) $user['id'], 'book.delete', ['book_id' => $id]);

        $this->json(['success' => true, 'message' => 'Book deleted.']);
    }

    private function assertCanModify(array $user, int $sellerId): void
    {
        if ((int) $user['id'] !== $sellerId && !AuthService::isAdmin($user)) {
            Response::json(['message' => 'Forbidden.'], 403);
        }
    }
}
