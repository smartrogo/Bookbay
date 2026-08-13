<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Core\Response;
use BookBay\Models\Payment;

/**
 * Demo payment gateway. `start` creates a pending payment with a
 * reference; `verify` marks it paid and converts the user's cart into
 * an order. Swap in a real gateway (Paystack/Flutterwave) later by
 * replacing the internals of these two methods.
 */
final class PaymentService
{
    public static function start(int $userId, array $data): array
    {
        $amount = (float) ($data['amount'] ?? $data['total'] ?? 0);
        $reference = 'BB-' . strtoupper(substr(bin2hex(random_bytes(8)), 0, 12));

        Payment::create([
            'user_id' => $userId,
            'reference' => $reference,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        return [
            'success' => true,
            'reference' => $reference,
            'amount' => $amount,
            'status' => 'pending',
        ];
    }

    public static function verify(int $userId, array $data): array
    {
        $reference = trim((string) ($data['reference'] ?? ''));

        if ($reference === '') {
            Response::json(['message' => 'A payment reference is required.'], 422);
        }

        $payment = Payment::firstWhere('reference', $reference);

        if ($payment === null) {
            Response::json(['message' => 'Payment reference not found.'], 404);
        }

        if (($payment['status'] ?? '') === 'paid') {
            return [
                'success' => true,
                'reference' => $reference,
                'status' => 'paid',
            ];
        }

        Payment::update((int) $payment['id'], ['status' => 'paid']);

        $order = OrderService::placeFromCart($userId, $reference);

        return [
            'success' => true,
            'reference' => $reference,
            'status' => 'paid',
            'order_id' => $order['order_id'],
            'total' => $order['total'],
        ];
    }
}
