<?php

declare(strict_types=1);

namespace Bookbay\Services;

use Bookbay\Models\Notification;

final class NotificationService
{
    public static function send(int $userId, string $title, string $body = ''): int
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'body' => $body,
            'is_read' => 0,
        ]);
    }

    public static function forUser(int $userId, bool $unreadOnly = false): array
    {
        $sql = 'SELECT * FROM notifications WHERE user_id = ?';
        $params = [$userId];

        if ($unreadOnly) {
            $sql .= ' AND is_read = 0';
        }

        $sql .= ' ORDER BY id DESC';

        return Notification::queryAll($sql, $params);
    }

    public static function unreadCount(int $userId): int
    {
        $row = Notification::queryOne(
            'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0',
            [$userId]
        );

        return (int) ($row['total'] ?? 0);
    }

    public static function markRead(int $id, int $userId): bool
    {
        return Notification::execute(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [$id, $userId]
        ) > 0;
    }

    public static function markAllRead(int $userId): int
    {
        return Notification::execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [$userId]
        );
    }
}
