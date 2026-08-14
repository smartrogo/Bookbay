<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Review extends Model
{
    protected static string $table = 'reviews';

    protected static array $fillable = ['user_id', 'book_id', 'rating', 'comment'];
}
