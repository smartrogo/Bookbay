<?php

declare(strict_types=1);

namespace BookBay\Models;

final class OrderItem extends Model
{
    protected static string $table = 'order_items';

    protected static array $fillable = ['order_id', 'book_id', 'title', 'price', 'quantity'];
}
