<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Book extends Model
{
    protected static string $table = 'books';

    protected static array $fillable = [
        'seller_id', 'title', 'author', 'category_id', 'description',
        'cover', 'cover_pic', 'price_buy', 'price_borrow', 'stock',
        'year', 'release_date', 'status',
    ];

    /**
     * Alias list shaped like what the React frontend expects
     * (camelCase cover/price fields plus category name).
     */
    public const SELECT = <<<'SQL'
        b.id,
        b.title,
        b.author,
        c.name AS category,
        b.cover,
        b.cover_pic AS coverPic,
        b.price_buy AS priceBuy,
        b.price_borrow AS priceBorrow,
        b.description,
        b.stock,
        b.status,
        b.year,
        b.release_date AS releaseDate,
        b.seller_id AS sellerId,
        b.created_at AS createdAt
        SQL;
}
