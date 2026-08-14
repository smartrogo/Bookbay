<?php

declare(strict_types=1);

namespace Bookbay\Services;

use Bookbay\Models\Book;

final class BookService
{
    /**
     * List books. `$filters` supports q, category (slug or name),
     * user_id, and status. Public callers default to active books only;
     * pass $includeInactive = true (admin) to see everything.
     */
    public static function list(array $filters = [], bool $includeInactive = false, int $limit = 100, int $offset = 0): array
    {
        $sql = 'SELECT ' . Book::SELECT . ' FROM books b LEFT JOIN categories c ON c.id = b.category_id';
        $where = [];
        $params = [];

        $q = trim((string) ($filters['q'] ?? ''));
        $category = trim((string) ($filters['category'] ?? ''));
        $userId = (string) ($filters['user_id'] ?? '');
        $status = trim((string) ($filters['status'] ?? ''));

        if (!$includeInactive && $status === '') {
            $status = 'active';
        }

        if ($q !== '') {
            $where[] = '(b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?)';
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($category !== '') {
            $where[] = '(c.slug = ? OR c.name = ?)';
            $params[] = $category;
            $params[] = $category;
        }

        if ($userId !== '') {
            $where[] = 'b.seller_id = ?';
            $params[] = (int) $userId;
        }

        if ($status !== '') {
            $where[] = 'b.status = ?';
            $params[] = $status;
        }

        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        $sql .= ' ORDER BY b.id DESC LIMIT ? OFFSET ?';
        $params[] = $limit;
        $params[] = $offset;

        return Book::queryAll($sql, $params);
    }

    public static function find(int $id): ?array
    {
        return Book::queryOne(
            'SELECT ' . Book::SELECT . ' FROM books b LEFT JOIN categories c ON c.id = b.category_id WHERE b.id = ?',
            [$id]
        );
    }

    /**
     * Map a request payload (camelCase or snake_case) onto the books
     * table columns. Unknown fields are dropped (mass-assignment guard).
     */
    public static function sanitize(array $data, int $sellerId): array
    {
        $map = [
            'title' => 'title',
            'author' => 'author',
            'category_id' => 'category_id',
            'description' => 'description',
            'cover' => 'cover',
            'cover_pic' => 'cover_pic',
            'coverPic' => 'cover_pic',
            'price_buy' => 'price_buy',
            'priceBuy' => 'price_buy',
            'price_borrow' => 'price_borrow',
            'priceBorrow' => 'price_borrow',
            'stock' => 'stock',
            'year' => 'year',
            'release_date' => 'release_date',
            'releaseDate' => 'release_date',
            'status' => 'status',
        ];

        $book = [];

        foreach ($map as $from => $to) {
            if (array_key_exists($from, $data)) {
                $book[$to] = $data[$from];
            }
        }

        $book['seller_id'] = $sellerId;

        return $book;
    }
}
