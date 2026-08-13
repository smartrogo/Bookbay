<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Core\Response;
use BookBay\Models\Book;
use BookBay\Models\CartItem;
use BookBay\Models\Order;
use BookBay\Models\OrderItem;

final class OrderService
{
    /**
     * Turn the user's cart into a completed order: validates stock,
     * decrements it, creates the order + items, and clears the cart.
     * Used by POST /orders and by the demo payment verification.
     */
    public static function placeFromCart(int $userId, string $reference = ''): array
    {
        $cart = self::cartItems($userId);

        if ($cart === []) {
            Response::json(['message' => 'Your cart is empty.'], 422);
        }

        $total = 0.0;

        foreach ($cart as $item) {
            $quantity = max(1, (int) $item['quantity']);
            $stock = (int) $item['stock'];

            if ($stock < $quantity) {
                Response::json([
                    'message' => "'{$item['title']}' has only {$stock} unit(s) in stock.",
                ], 422);
            }

            $total += (float) $item['priceBuy'] * $quantity;
        }

        foreach ($cart as $item) {
            Book::execute(
                'UPDATE books SET stock = stock - ? WHERE id = ?',
                [max(1, (int) $item['quantity']), (int) $item['book_id']]
            );
        }

        $orderId = Order::create([
            'user_id' => $userId,
            'total' => round($total, 2),
            'status' => 'completed',
            'reference' => $reference !== '' ? $reference : 'ORD-' . strtoupper(substr(bin2hex(random_bytes(6)), 0, 10)),
        ]);

        foreach ($cart as $item) {
            OrderItem::create([
                'order_id' => $orderId,
                'book_id' => (int) $item['book_id'],
                'title' => (string) $item['title'],
                'price' => (float) $item['priceBuy'],
                'quantity' => max(1, (int) $item['quantity']),
            ]);
        }

        CartItem::deleteWhere('user_id', $userId);

        return [
            'success' => true,
            'order_id' => $orderId,
            'total' => round($total, 2),
            'items' => count($cart),
        ];
    }

    public static function forUser(int $userId, string $status = ''): array
    {
        $sql = 'SELECT o.*, COUNT(oi.id) AS item_count FROM orders o '
            . 'LEFT JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = ?';
        $params = [$userId];

        if ($status !== '') {
            $sql .= ' AND o.status = ?';
            $params[] = $status;
        }

        $sql .= ' GROUP BY o.id ORDER BY o.id DESC';

        return Order::queryAll($sql, $params);
    }

    public static function cartItems(int $userId): array
    {
        return CartItem::queryAll(
            'SELECT ci.id AS cart_item_id, ci.book_id, ci.quantity, '
            . Book::SELECT
            . ' FROM cart_items ci JOIN books b ON b.id = ci.book_id '
            . 'LEFT JOIN categories c ON c.id = b.category_id WHERE ci.user_id = ? ORDER BY ci.id DESC',
            [$userId]
        );
    }
}
