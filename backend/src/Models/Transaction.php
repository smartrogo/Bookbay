<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Transaction extends Model
{
    protected static string $table = 'transactions';

    protected static array $fillable = ['wallet_id', 'type', 'amount', 'description'];
}
