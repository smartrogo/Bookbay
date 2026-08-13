<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Wallet extends Model
{
    protected static string $table = 'wallets';

    protected static array $fillable = ['user_id', 'balance'];

    /**
     * Return (and lazily create) the wallet for a user.
     */
    public static function ensureForUser(int $userId): array
    {
        $wallet = static::firstWhere('user_id', $userId);

        if ($wallet !== null) {
            return $wallet;
        }

        $id = static::create(['user_id' => $userId, 'balance' => 0]);
        return static::find($id) ?? [];
    }
}
