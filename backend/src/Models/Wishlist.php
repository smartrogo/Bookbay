<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Wishlist extends Model
{
    protected static string $table = 'wishlists';

    protected static array $fillable = ['user_id', 'book_id'];
}
