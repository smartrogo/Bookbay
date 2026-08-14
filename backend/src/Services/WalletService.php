<?php

declare(strict_types=1);

namespace Bookbay\Services;

use Bookbay\Core\Response;
use Bookbay\Models\Transaction;
use Bookbay\Models\User;
use Bookbay\Models\Wallet;

final class WalletService
{
    public static function show(int $userId): array
    {
        $wallet = Wallet::ensureForUser($userId);
        $user = User::find($userId);

        return [
            'wallet' => self::publicWallet($wallet),
            'user' => $user !== null ? AuthService::publicUser($user) : null,
        ];
    }

    public static function transactions(int $userId, string $type = ''): array
    {
        $wallet = Wallet::ensureForUser($userId);
        $sql = 'SELECT * FROM transactions WHERE wallet_id = ?';
        $params = [(int) $wallet['id']];

        if ($type !== '') {
            $sql .= ' AND type = ?';
            $params[] = $type;
        }

        $sql .= ' ORDER BY id DESC';

        return ['transactions' => Transaction::queryAll($sql, $params)];
    }

    public static function topUp(int $userId, array $data): array
    {
        $amount = (float) ($data['amount'] ?? 0);

        if ($amount <= 0) {
            Response::json(['message' => 'A positive amount is required.'], 422);
        }

        $wallet = Wallet::ensureForUser($userId);

        Wallet::execute(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [$amount, (int) $wallet['id']]
        );

        Transaction::create([
            'wallet_id' => (int) $wallet['id'],
            'type' => 'topup',
            'amount' => $amount,
            'description' => 'Wallet top-up',
        ]);

        $wallet = Wallet::find((int) $wallet['id']) ?? [];

        return [
            'success' => true,
            'message' => 'Wallet topped up successfully.',
            'balance' => (float) $wallet['balance'],
            'wallet' => self::publicWallet($wallet),
        ];
    }

    public static function transfer(int $userId, array $data): array
    {
        $amount = (float) ($data['amount'] ?? 0);
        $recipientEmail = strtolower(trim((string) ($data['recipient_email'] ?? $data['email'] ?? '')));

        if ($amount <= 0) {
            Response::json(['message' => 'A positive amount is required.'], 422);
        }

        if (!filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
            Response::json(['message' => 'A valid recipient email is required.'], 422);
        }

        $sender = Wallet::ensureForUser($userId);
        $recipient = User::firstWhere('email', $recipientEmail);

        if ($recipient === null) {
            Response::json(['message' => 'Recipient account not found.'], 404);
        }

        if ((int) $recipient['id'] === $userId) {
            Response::json(['message' => 'You cannot transfer to yourself.'], 422);
        }

        $senderBalance = (float) $sender['balance'];
        if ($senderBalance < $amount) {
            Response::json(['message' => 'Insufficient wallet balance.'], 422);
        }

        $recipientWallet = Wallet::ensureForUser((int) $recipient['id']);

        Wallet::execute('UPDATE wallets SET balance = balance - ? WHERE id = ?', [$amount, (int) $sender['id']]);
        Wallet::execute('UPDATE wallets SET balance = balance + ? WHERE id = ?', [$amount, (int) $recipientWallet['id']]);

        Transaction::create([
            'wallet_id' => (int) $sender['id'],
            'type' => 'transfer_out',
            'amount' => $amount,
            'description' => "Transfer to {$recipientEmail}",
        ]);

        Transaction::create([
            'wallet_id' => (int) $recipientWallet['id'],
            'type' => 'transfer_in',
            'amount' => $amount,
            'description' => "Transfer from user #{$userId}",
        ]);

        $wallet = Wallet::find((int) $sender['id']) ?? [];

        return [
            'success' => true,
            'message' => 'Transfer completed successfully.',
            'balance' => (float) $wallet['balance'],
            'wallet' => self::publicWallet($wallet),
        ];
    }

    private static function publicWallet(array $wallet): array
    {
        return [
            'id' => (int) $wallet['id'],
            'user_id' => (int) $wallet['user_id'],
            'balance' => (float) $wallet['balance'],
        ];
    }
}
