<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class UserActivity extends Model
{
    protected static string $table = 'user_activities';

    protected static array $fillable = [
        'user_id', 'book_id', 'activity_type', 'metadata',
    ];

    /**
     * Record a user activity (view, purchase, rating, wishlist, search, etc.).
     */
    public static function record(int $userId, int $bookId, string $type, array $metadata = []): int
    {
        return self::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'activity_type' => $type,
            'metadata' => json_encode($metadata),
        ]);
    }

    /**
     * Get recent activity types for a user.
     */
    public static function recentTypes(int $userId, int $limit = 50): array
    {
        return self::queryAll(
            'SELECT DISTINCT activity_type FROM user_activities WHERE user_id = ? ORDER BY id DESC LIMIT ?',
            [$userId, $limit]
        );
    }

    /**
     * Get books a user has interacted with, grouped by activity type.
     */
    public static function userInteractedBookIds(int $userId): array
    {
        return self::queryAll(
            'SELECT book_id, activity_type, COUNT(*) AS frequency FROM user_activities WHERE user_id = ? GROUP BY book_id, activity_type ORDER BY frequency DESC',
            [$userId]
        );
    }
}
