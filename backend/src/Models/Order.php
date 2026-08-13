<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Order extends Model
{
    protected static string $table = 'orders';

    protected static array $fillable = ['user_id', 'total', 'status', 'reference'];
}
