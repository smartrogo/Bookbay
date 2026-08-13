<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Payment extends Model
{
    protected static string $table = 'payments';

    protected static array $fillable = ['user_id', 'reference', 'amount', 'status'];
}
