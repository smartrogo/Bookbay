<?php

declare(strict_types=1);

namespace Bookbay\Services;

use Bookbay\Models\UserPoint;
use Bookbay\Models\UserStreak;
use Bookbay\Models\UserBadge;
use Bookbay\Models\User;

/**
 * Gamification service — points, daily streaks, badges, leaderboard.
 */
final class GamificationService
{
    // ── Points ──────────────────────────────────────────────────────

    /** Points awarded per activity type */
    private static array $pointValues = [
        'view_book' => 1,
        'purchase' => 10,
        'review' => 5,
        'borrow_request' => 3,
        'exchange_request' => 3,
        'wishlist_add' => 2,
        'daily_login' => 5,
        'profile_complete' => 15,
        'first_purchase' => 25,
        'streak_bonus' => 10,
    ];

    /**
     * Award points to a user for a specific activity.
     */
    public static function awardPoints(int $userId, string $type, string $description = '', int $referenceId = 0, string $referenceType = ''): int
    {
        $points = self::$pointValues[$type] ?? 1;

        $id = UserPoint::create([
            'user_id' => $userId,
            'points' => $points,
            'type' => $type,
            'description' => $description,
            'reference_id' => $referenceId,
            'reference_type' => $referenceType,
        ]);

        // Check for badge milestones
        self::checkBadges($userId);

        return $id;
    }

    /**
     * Get total points for a user.
     */
    public static function totalPoints(int $userId): int
    {
        $result = UserPoint::queryAll(
            'SELECT COALESCE(SUM(points), 0) AS total FROM user_points WHERE user_id = ?',
            [$userId]
        );

        return (int) ($result[0]['total'] ?? 0);
    }

    /**
     * Get points history for a user.
     */
    public static function pointsHistory(int $userId, int $limit = 20): array
    {
        return UserPoint::queryAll(
            'SELECT * FROM user_points WHERE user_id = ? ORDER BY id DESC LIMIT ?',
            [$userId, $limit]
        );
    }

    // ── Streaks ─────────────────────────────────────────────────────

    /**
     * Record a daily activity and update streak.
     */
    public static function recordActivity(int $userId): array
    {
        $today = date('Y-m-d');

        $streak = UserStreak::firstWhere('user_id', $userId);

        if ($streak === null) {
            // First activity
            UserStreak::create([
                'user_id' => $userId,
                'current_streak' => 1,
                'longest_streak' => 1,
                'last_activity_date' => $today,
            ]);
            return ['current_streak' => 1, 'longest_streak' => 1, 'is_new' => true];
        }

        $lastDate = (string) $streak['last_activity_date'];
        $currentStreak = (int) $streak['current_streak'];
        $longestStreak = (int) $streak['longest_streak'];

        // Calculate difference in days
        $last = new \DateTime($lastDate);
        $now = new \DateTime($today);
        $diff = (int) $last->diff($now)->days;

        if ($diff === 0) {
            // Already active today
            return ['current_streak' => $currentStreak, 'longest_streak' => $longestStreak, 'is_new' => false];
        }

        if ($diff === 1) {
            // Consecutive day
            $currentStreak++;
            $isBonus = ($currentStreak % 7 === 0); // Weekly bonus
        } else {
            // Streak broken
            $currentStreak = 1;
            $isBonus = false;
        }

        if ($currentStreak > $longestStreak) {
            $longestStreak = $currentStreak;
        }

        UserStreak::update((int) $streak['id'], [
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
            'last_activity_date' => $today,
        ]);

        // Award streak bonus points if weekly milestone
        if ($isBonus) {
            self::awardPoints($userId, 'streak_bonus', "Week {$currentStreak} streak bonus!");
        }

        return ['current_streak' => $currentStreak, 'longest_streak' => $longestStreak, 'is_new' => true, 'bonus' => $isBonus ?? false];
    }

    /**
     * Get user's streak info.
     */
    public static function getStreak(int $userId): array
    {
        $streak = UserStreak::firstWhere('user_id', $userId);

        if ($streak === null) {
            return ['current_streak' => 0, 'longest_streak' => 0, 'last_activity_date' => null];
        }

        return [
            'current_streak' => (int) $streak['current_streak'],
            'longest_streak' => (int) $streak['longest_streak'],
            'last_activity_date' => (string) $streak['last_activity_date'],
        ];
    }

    // ── Badges ──────────────────────────────────────────────────────

    /** Badge definitions */
    private static array $badges = [
        'first_purchase' => ['icon' => '🎉', 'name' => 'First Purchase', 'description' => 'Made your first book purchase'],
        'bookworm' => ['icon' => '🐛', 'name' => 'Bookworm', 'description' => 'Purchased 5 books'],
        'bibliophile' => ['icon' => '📚', 'name' => 'Bibliophile', 'description' => 'Purchased 10 books'],
        'reviewer' => ['icon' => '⭐', 'name' => 'Reviewer', 'description' => 'Left your first review'],
        'critic' => ['icon' => '✍️', 'name' => 'Critic', 'description' => 'Left 5 reviews'],
        'streak_7' => ['icon' => '🔥', 'name' => 'On Fire', 'description' => '7-day activity streak'],
        'streak_30' => ['icon' => '💎', 'name' => 'Dedicated', 'description' => '30-day activity streak'],
        'explorer' => ['icon' => '🧭', 'name' => 'Explorer', 'description' => 'Viewed 10 different books'],
        'social_butterfly' => ['icon' => '🦋', 'name' => 'Social Butterfly', 'description' => 'Made your first exchange request'],
        'generous' => ['icon' => '🎁', 'name' => 'Generous', 'description' => 'Donated a book for borrowing'],
        'centurion' => ['icon' => '💯', 'name' => 'Centurion', 'description' => 'Earned 100 points'],
        'high_roller' => ['icon' => '🏆', 'name' => 'High Roller', 'description' => 'Earned 500 points'],
    ];

    /**
     * Check and award badges based on user activity.
     */
    public static function checkBadges(int $userId): array
    {
        $earned = [];
        $existing = UserBadge::queryAll(
            'SELECT badge_name FROM user_badges WHERE user_id = ?',
            [$userId]
        );
        $existingNames = array_column($existing, 'badge_name');

        $totalPoints = self::totalPoints($userId);

        // Count purchases
        $purchases = UserPoint::queryAll(
            "SELECT COUNT(*) AS c FROM user_points WHERE user_id = ? AND type = 'purchase'",
            [$userId]
        );
        $purchaseCount = (int) ($purchases[0]['c'] ?? 0);

        // Count reviews
        $reviews = UserPoint::queryAll(
            "SELECT COUNT(*) AS c FROM user_points WHERE user_id = ? AND type = 'review'",
            [$userId]
        );
        $reviewCount = (int) ($reviews[0]['c'] ?? 0);

        // Count views
        $views = UserPoint::queryAll(
            "SELECT COUNT(*) AS c FROM user_points WHERE user_id = ? AND type = 'view_book'",
            [$userId]
        );
        $viewCount = (int) ($views[0]['c'] ?? 0);

        // Streak
        $streak = self::getStreak($userId);

        // Badge checks
        $checks = [
            'first_purchase' => $purchaseCount >= 1,
            'bookworm' => $purchaseCount >= 5,
            'bibliophile' => $purchaseCount >= 10,
            'reviewer' => $reviewCount >= 1,
            'critic' => $reviewCount >= 5,
            'streak_7' => $streak['current_streak'] >= 7 || $streak['longest_streak'] >= 7,
            'streak_30' => $streak['current_streak'] >= 30 || $streak['longest_streak'] >= 30,
            'explorer' => $viewCount >= 10,
            'centurion' => $totalPoints >= 100,
            'high_roller' => $totalPoints >= 500,
        ];

        foreach ($checks as $badgeName => $condition) {
            if ($condition && !in_array($badgeName, $existingNames, true)) {
                $badge = self::$badges[$badgeName] ?? null;
                if ($badge !== null) {
                    UserBadge::create([
                        'user_id' => $userId,
                        'badge_name' => $badgeName,
                        'badge_icon' => $badge['icon'],
                        'description' => $badge['description'],
                    ]);
                    $earned[] = $badgeName;
                }
            }
        }

        return $earned;
    }

    /**
     * Get all badges for a user.
     */
    public static function getBadges(int $userId): array
    {
        return UserBadge::queryAll(
            'SELECT * FROM user_badges WHERE user_id = ? ORDER BY id ASC',
            [$userId]
        );
    }

    /**
     * Get all available badge definitions with earned status.
     */
    public static function allBadges(int $userId): array
    {
        $existing = UserBadge::queryAll(
            'SELECT badge_name FROM user_badges WHERE user_id = ?',
            [$userId]
        );
        $existingNames = array_column($existing, 'badge_name');

        $result = [];
        foreach (self::$badges as $key => $badge) {
            $result[] = [
                'id' => $key,
                'name' => $badge['name'],
                'icon' => $badge['icon'],
                'description' => $badge['description'],
                'earned' => in_array($key, $existingNames, true),
            ];
        }

        return $result;
    }

    // ── Leaderboard ─────────────────────────────────────────────────

    /**
     * Get the top users by total points.
     */
    public static function leaderboard(int $limit = 10): array
    {
        $rows = UserPoint::queryAll(
            'SELECT up.user_id, u.name, u.email, SUM(up.points) AS total_points '
            . 'FROM user_points up JOIN users u ON u.id = up.user_id '
            . 'GROUP BY up.user_id ORDER BY total_points DESC LIMIT ?',
            [$limit]
        );

        $result = [];
        $rank = 1;
        foreach ($rows as $row) {
            $result[] = [
                'rank' => $rank++,
                'user_id' => (int) $row['user_id'],
                'name' => (string) $row['name'],
                'email' => (string) $row['email'],
                'total_points' => (int) $row['total_points'],
            ];
        }

        return $result;
    }

    /**
     * Get a user's gamification summary (points, streak, badges, rank).
     */
    public static function summary(int $userId): array
    {
        $total = self::totalPoints($userId);
        $streak = self::getStreak($userId);
        $badges = self::getBadges($userId);

        // Calculate rank
        $rankRow = UserPoint::queryAll(
            'SELECT COUNT(DISTINCT user_id) AS rank FROM user_points WHERE user_id != ? '
            . 'HAVING SUM(points) > (SELECT COALESCE(SUM(points), 0) FROM user_points WHERE user_id = ?)',
            [$userId, $userId]
        );
        // Simpler rank calculation
        $allTotals = UserPoint::queryAll(
            'SELECT user_id, SUM(points) AS tp FROM user_points GROUP BY user_id ORDER BY tp DESC'
        );
        $rank = 1;
        foreach ($allTotals as $at) {
            if ((int) $at['user_id'] === $userId) break;
            $rank++;
        }

        return [
            'total_points' => $total,
            'rank' => $rank,
            'streak' => $streak,
            'badges_count' => count($badges),
            'badges' => $badges,
        ];
    }
}
