<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class CartItem extends Model
{
    protected static string $table = 'cart_items';

    protected static array $fillable = ['user_id', 'book_id', 'quantity'];
}
