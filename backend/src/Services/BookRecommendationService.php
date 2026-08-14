<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Models\Book;
use BookBay\Models\OrderItem;
use BookBay\Models\UserActivity;
use BookBay\Models\Wishlist;

final class BookRecommendationService
{
    /**
     * Get personalized book recommendations for a user.
     *
     * Strategy:
     * 1. Find books the user has interacted with (views, purchases, ratings, wishlist)
     * 2. Extract categories and authors from those books
     * 3. Find other books in those categories or by those authors
     * 4. Exclude books the user already owns or has in wishlist
     * 5. Sort by relevance (category match, author match, popularity)
     */
    public static function forUser(int $userId, int $limit = 12): array
    {
        // Step 1: Get user's interacted books
        $interactedBooks = self::getInteractedBooks($userId);

        if ($interactedBooks === []) {
            // Cold start: return popular books
            return self::popularBooks($limit);
        }

        // Step 2: Extract categories and authors
        $categories = [];
        $authors = [];

        foreach ($interactedBooks as $book) {
            $cat = strtolower((string) ($book['category'] ?? ''));
            if ($cat !== '') {
                $categories[$cat] = ($categories[$cat] ?? 0) + 1;
            }

            $author = strtolower((string) ($book['author'] ?? ''));
            if ($author !== '') {
                $authors[$author] = ($authors[$author] ?? 0) + 1;
            }
        }

        // Sort by frequency
        arsort($categories);
        arsort($authors);

        // Step 3: Get IDs to exclude (already interacted with)
        $excludeIds = array_map(fn($b) => (int) $b['id'], $interactedBooks);

        // Also exclude books in user's wishlist
        foreach (Wishlist::queryAll('SELECT book_id FROM wishlists WHERE user_id = ?', [$userId]) as $w) {
            $excludeIds[] = (int) $w['book_id'];
        }

        // Also exclude books user has purchased
        foreach (OrderItem::queryAll(
            'SELECT DISTINCT book_id FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.user_id = ?',
            [$userId]
        ) as $oi) {
            $excludeIds[] = (int) $oi['book_id'];
        }

        $excludeIds = array_unique($excludeIds);

        // Step 4: Find candidate books
        $candidates = [];

        // Get books by matching categories (top 3)
        $topCategories = array_slice(array_keys($categories), 0, 3, true);
        foreach ($topCategories as $cat => $weight) {
            $books = Book::queryAll(
                'SELECT ' . Book::SELECT . ' FROM books b LEFT JOIN categories c ON c.id = b.category_id WHERE LOWER(c.name) = ? AND b.status = ? ORDER BY b.id DESC LIMIT 20',
                [$cat, 'active']
            );

            foreach ($books as $book) {
                if (!in_array((int) $book['id'], $excludeIds, true)) {
                    $bookId = (int) $book['id'];
                    if (!isset($candidates[$bookId])) {
                        $candidates[$bookId] = [
                            'book' => $book,
                            'score' => 0,
                            'reasons' => [],
                        ];
                    }
                    $candidates[$bookId]['score'] += $weight * 3;
                    $candidates[$bookId]['reasons'][] = "matches category: {$cat}";
                }
            }
        }

        // Get books by matching authors (top 3)
        $topAuthors = array_slice(array_keys($authors), 0, 3, true);
        foreach ($topAuthors as $author => $weight) {
            $books = Book::queryAll(
                'SELECT ' . Book::SELECT . ' FROM books b WHERE LOWER(b.author) = ? AND b.status = ? ORDER BY b.id DESC LIMIT 10',
                [$author, 'active']
            );

            foreach ($books as $book) {
                if (!in_array((int) $book['id'], $excludeIds, true)) {
                    $bookId = (int) $book['id'];
                    if (!isset($candidates[$bookId])) {
                        $candidates[$bookId] = [
                            'book' => $book,
                            'score' => 0,
                            'reasons' => [],
                        ];
                    }
                    $candidates[$bookId]['score'] += $weight * 5;
                    $candidates[$bookId]['reasons'][] = "same author: {$author}";
                }
            }
        }

        // Add some popular books as discovery
        $popularBooks = self::popularBooks(10);
        foreach ($popularBooks as $book) {
            $bookId = (int) $book['id'];
            if (!in_array($bookId, $excludeIds, true)) {
                if (!isset($candidates[$bookId])) {
                    $candidates[$bookId] = [
                        'book' => $book,
                        'score' => 0,
                        'reasons' => [],
                    ];
                }
                $candidates[$bookId]['score'] += 1;
                $candidates[$bookId]['reasons'][] = 'popular book';
            }
        }

        // Step 5: Sort by score and return top N
        usort($candidates, fn($a, $b) => $b['score'] <=> $a['score']);

        $results = [];
        foreach (array_slice($candidates, 0, $limit) as $candidate) {
            $book = $candidate['book'];
            $results[] = self::formatBook($book, array_unique($candidate['reasons']));
        }

        return $results;
    }

    /**
     * Get recently viewed books for a user.
     */
    public static function recentlyViewed(int $userId, int $limit = 8): array
    {
        $activities = UserActivity::queryAll(
            'SELECT DISTINCT book_id FROM user_activities WHERE user_id = ? AND activity_type = ? ORDER BY id DESC LIMIT ?',
            [$userId, 'view', $limit]
        );

        $books = [];
        foreach ($activities as $activity) {
            $book = Book::find((int) $activity['book_id']);
            if ($book !== null && ($book['status'] ?? '') === 'active') {
                $books[] = self::formatBook($book, ['recently viewed']);
            }
        }

        return $books;
    }

    /**
     * Get popular/trending books (fallback for cold start).
     */
    public static function popularBooks(int $limit = 12): array
    {
        // Get books with most views/reviews
        $books = Book::queryAll(
            'SELECT ' . Book::SELECT . ', '
            . '(SELECT COUNT(*) FROM reviews r WHERE r.book_id = b.id) AS review_count '
            . 'FROM books b WHERE b.status = ? ORDER BY review_count DESC, b.id DESC LIMIT ?',
            ['active', $limit]
        );

        $results = [];
        foreach ($books as $book) {
            $results[] = self::formatBook($book, ['popular']);
        }

        return $results;
    }

    /**
     * Get similar books to a given book (by category and author).
     */
    public static function similarTo(int $bookId, int $limit = 6): array
    {
        $book = Book::find($bookId);
        if ($book === null) {
            return [];
        }

        $category = strtolower((string) ($book['category'] ?? ''));
        $author = strtolower((string) ($book['author'] ?? ''));

        $candidates = [];

        // Books in same category
        if ($category !== '') {
            $cats = Book::queryAll(
                'SELECT ' . Book::SELECT . ' FROM books b LEFT JOIN categories c ON c.id = b.category_id WHERE LOWER(c.name) = ? AND b.id != ? AND b.status = ? LIMIT 20',
                [$category, $bookId, 'active']
            );

            foreach ($cats as $b) {
                $id = (int) $b['id'];
                if (!isset($candidates[$id])) {
                    $candidates[$id] = ['book' => $b, 'score' => 0, 'reasons' => []];
                }
                $candidates[$id]['score'] += 3;
                $candidates[$id]['reasons'][] = "same category: {$category}";
            }
        }

        // Books by same author
        if ($author !== '') {
            $authors = Book::queryAll(
                'SELECT ' . Book::SELECT . ' FROM books b WHERE LOWER(b.author) = ? AND b.id != ? AND b.status = ? LIMIT 10',
                [$author, $bookId, 'active']
            );

            foreach ($authors as $b) {
                $id = (int) $b['id'];
                if (!isset($candidates[$id])) {
                    $candidates[$id] = ['book' => $b, 'score' => 0, 'reasons' => []];
                }
                $candidates[$id]['score'] += 5;
                $candidates[$id]['reasons'][] = "same author: {$author}";
            }
        }

        // Sort by score
        usort($candidates, fn($a, $b) => $b['score'] <=> $a['score']);

        $results = [];
        foreach (array_slice($candidates, 0, $limit) as $candidate) {
            $results[] = self::formatBook($candidate['book'], array_unique($candidate['reasons']));
        }

        return $results;
    }

    /**
     * Track a book view event.
     */
    public static function trackView(int $userId, int $bookId): void
    {
        // Check if viewed recently (within last hour) to avoid spam
        $recent = UserActivity::queryOne(
            'SELECT id FROM user_activities WHERE user_id = ? AND book_id = ? AND activity_type = ? AND created_at > datetime("now", "-1 hour") LIMIT 1',
            [$userId, $bookId, 'view']
        );

        if ($recent === null) {
            UserActivity::record($userId, $bookId, 'view');
        }
    }

    // ── Private Helpers ─────────────────────────────────────────────

    private static function getInteractedBooks(int $userId): array
    {
        // Get books with highest interaction weight
        $activities = UserActivity::queryAll(
            'SELECT book_id, activity_type, COUNT(*) AS frequency FROM user_activities WHERE user_id = ? GROUP BY book_id, activity_type ORDER BY frequency DESC',
            [$userId]
        );

        // Weight: purchase > rating > wishlist > view
        $weights = [
            'purchase' => 10,
            'rating' => 5,
            'wishlist' => 4,
            'view' => 1,
        ];

        $bookScores = [];
        foreach ($activities as $activity) {
            $bookId = (int) $activity['book_id'];
            $type = (string) $activity['activity_type'];
            $frequency = (int) $activity['frequency'];
            $weight = $weights[$type] ?? 1;

            if (!isset($bookScores[$bookId])) {
                $bookScores[$bookId] = 0;
            }
            $bookScores[$bookId] += $weight * $frequency;
        }

        // Sort by score and get top books
        arsort($bookScores);
        $topBookIds = array_slice(array_keys($bookScores), 0, 20, true);

        $books = [];
        foreach ($topBookIds as $bookId => $score) {
            $book = Book::find($bookId);
            if ($book !== null && ($book['status'] ?? '') === 'active') {
                $books[] = $book;
            }
        }

        return $books;
    }

    private static function formatBook(array $book, array $reasons = []): array
    {
        return [
            'id' => (int) $book['id'],
            'title' => (string) $book['title'],
            'author' => (string) $book['author'],
            'category' => (string) ($book['category'] ?? ''),
            'cover' => (string) ($book['cover'] ?? ''),
            'coverPic' => (string) ($book['cover_pic'] ?? $book['cover'] ?? ''),
            'priceBuy' => (float) ($book['price_buy'] ?? 0),
            'priceBorrow' => (float) ($book['price_borrow'] ?? 0),
            'stock' => (int) ($book['stock'] ?? 0),
            'year' => (string) ($book['year'] ?? ''),
            'description' => (string) ($book['description'] ?? ''),
            'reasons' => $reasons,
        ];
    }
}
