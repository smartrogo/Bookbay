<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Core\Validator;
use BookBay\Models\Book;
use BookBay\Models\CartItem;
use BookBay\Services\OrderService;

final class CartController extends Controller
{
    public function index(int $userId): never
    {
        $this->requireOwnership($userId);
        $this->json(['items' => OrderService::cartItems($userId)]);
    }

    public function store(int $userId): never
    {
        $this->requireOwnership($userId);
        $data = $this->request()->input();

        Validator::check($data, [
            'book_id' => 'required|integer|min:1',
            'quantity' => 'integer|min:1',
        ]);

        $bookId = (int) $data['book_id'];
        $quantity = max(1, (int) ($data['quantity'] ?? 1));

        $book = Book::find($bookId);
        if ($book === null || ($book['status'] ?? '') !== 'active') {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $existing = CartItem::firstWhere('book_id', $bookId);
        if ($existing !== null && (int) $existing['user_id'] === $userId) {
            CartItem::update((int) $existing['id'], [
                'quantity' => (int) $existing['quantity'] + $quantity,
            ]);
        } else {
            CartItem::create([
                'user_id' => $userId,
                'book_id' => $bookId,
                'quantity' => $quantity,
            ]);
        }

        $this->json([
            'success' => true,
            'message' => 'Added to cart.',
            'items' => OrderService::cartItems($userId),
        ], 201);
    }

    public function destroy(int $userId, int $cartItemId): never
    {
        $this->requireOwnership($userId);

        CartItem::execute(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [$cartItemId, $userId]
        );

        $this->json([
            'success' => true,
            'message' => 'Removed from cart.',
            'items' => OrderService::cartItems($userId),
        ]);
    }
}
