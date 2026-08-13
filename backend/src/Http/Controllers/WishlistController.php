<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Models\Book;
use BookBay\Models\Wishlist;
use BookBay\Services\BookService;

final class WishlistController extends Controller
{
    public function index(): never
    {
        $user = $this->requireAuth();

        $items = Wishlist::queryAll(
            'SELECT w.id AS wishlist_id, w.created_at, ' . Book::SELECT
            . ' FROM wishlists w JOIN books b ON b.id = w.book_id '
            . 'LEFT JOIN categories c ON c.id = b.category_id WHERE w.user_id = ? ORDER BY w.id DESC',
            [(int) $user['id']]
        );

        $this->json(['wishlist' => $items]);
    }

    public function store(): never
    {
        $user = $this->requireAuth();
        $bookId = (int) ($this->request()->input()['book_id'] ?? 0);

        if ($bookId <= 0) {
            Response::json(['message' => 'A valid book_id is required.'], 422);
        }

        $book = BookService::find($bookId);
        if ($book === null || ($book['status'] ?? '') !== 'active') {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $existing = Wishlist::queryOne(
            'SELECT * FROM wishlists WHERE user_id = ? AND book_id = ?',
            [(int) $user['id'], $bookId]
        );

        if ($existing === null) {
            Wishlist::create(['user_id' => (int) $user['id'], 'book_id' => $bookId]);
        }

        $this->json([
            'success' => true,
            'message' => $existing === null ? 'Added to wishlist.' : 'Already in wishlist.',
            'wishlist' => $this->itemsFor((int) $user['id']),
        ], 201);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAuth();

        Wishlist::execute(
            'DELETE FROM wishlists WHERE id = ? AND user_id = ?',
            [$id, (int) $user['id']]
        );

        $this->json([
            'success' => true,
            'message' => 'Removed from wishlist.',
            'wishlist' => $this->itemsFor((int) $user['id']),
        ]);
    }

    private function itemsFor(int $userId): array
    {
        return Wishlist::queryAll(
            'SELECT w.id AS wishlist_id, w.created_at, ' . Book::SELECT
            . ' FROM wishlists w JOIN books b ON b.id = w.book_id '
            . 'LEFT JOIN categories c ON c.id = b.category_id WHERE w.user_id = ? ORDER BY w.id DESC',
            [$userId]
        );
    }
}
