<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Post extends Model
{
    protected static string $table = 'posts';

    protected static array $fillable = [
        'user_id', 'title', 'slug', 'excerpt', 'body', 'cover', 'status',
    ];
}
