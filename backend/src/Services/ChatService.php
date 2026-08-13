<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Core\Response;
use BookBay\Models\Conversation;
use BookBay\Models\Message;
use BookBay\Models\User;

final class ChatService
{
    /**
     * A user's conversations with the other party's name/email and the
     * last message preview.
     */
    public static function conversationsFor(int $userId): array
    {
        $rows = Conversation::queryAll(
            'SELECT c.*, '
            . 'ua.name AS user_a_name, ua.email AS user_a_email, '
            . 'ub.name AS user_b_name, ub.email AS user_b_email '
            . 'FROM conversations c '
            . 'JOIN users ua ON ua.id = c.user_a_id '
            . 'JOIN users ub ON ub.id = c.user_b_id '
            . 'WHERE c.user_a_id = ? OR c.user_b_id = ? '
            . 'ORDER BY c.id DESC',
            [$userId, $userId]
        );

        $conversations = [];

        foreach ($rows as $row) {
            $otherId = (int) $row['user_a_id'] === $userId ? (int) $row['user_b_id'] : (int) $row['user_a_id'];
            $otherName = (int) $row['user_a_id'] === $userId ? $row['user_b_name'] : $row['user_a_name'];
            $otherEmail = (int) $row['user_a_id'] === $userId ? $row['user_b_email'] : $row['user_a_email'];

            $last = Message::queryOne(
                'SELECT body, sender_id, created_at FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1',
                [(int) $row['id']]
            );

            $conversations[] = [
                'id' => (int) $row['id'],
                'user_id' => $otherId,
                'user_name' => $otherName,
                'user_email' => $otherEmail,
                'last_message' => $last['body'] ?? '',
                'last_message_at' => $last['created_at'] ?? null,
            ];
        }

        return $conversations;
    }

    public static function messages(int $conversationId, int $userId): array
    {
        $conversation = self::belongsTo($conversationId, $userId);

        if ($conversation === null) {
            Response::json(['message' => 'Conversation not found.'], 404);
        }

        return Message::queryAll(
            'SELECT m.*, u.name AS sender_name FROM messages m '
            . 'JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? ORDER BY m.id ASC',
            [$conversationId]
        );
    }

    public static function send(int $conversationId, int $senderId, string $body): array
    {
        $body = trim($body);

        if ($body === '') {
            Response::json(['message' => 'Message body is required.'], 422);
        }

        $conversation = self::belongsTo($conversationId, $senderId);

        if ($conversation === null) {
            Response::json(['message' => 'Conversation not found.'], 404);
        }

        $id = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'body' => $body,
            'is_read' => 0,
        ]);

        // Mark the other party's earlier messages as read once they reply.
        Message::execute(
            'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?',
            [$conversationId, $senderId]
        );

        return [
            'success' => true,
            'message' => Message::find((int) $id) ?? ['id' => $id, 'body' => $body],
        ];
    }

    /**
     * Start a conversation with another user (find or create).
     * Accepts user_id / recipient_id / other_user_id.
     */
    public static function start(int $userId, array $data): array
    {
        $otherId = (int) ($data['user_id'] ?? $data['recipient_id'] ?? $data['other_user_id'] ?? 0);

        if ($otherId <= 0) {
            Response::json(['message' => 'A recipient user_id is required.'], 422);
        }

        if ($otherId === $userId) {
            Response::json(['message' => 'You cannot chat with yourself.'], 422);
        }

        if (User::find($otherId) === null) {
            Response::json(['message' => 'Recipient not found.'], 404);
        }

        $existing = Conversation::queryOne(
            'SELECT * FROM conversations WHERE (user_a_id = ? AND user_b_id = ?) OR (user_a_id = ? AND user_b_id = ?)',
            [$userId, $otherId, $otherId, $userId]
        );

        if ($existing !== null) {
            return ['success' => true, 'conversation' => self::conversationPayload($existing, $userId)];
        }

        $id = Conversation::create([
            'user_a_id' => min($userId, $otherId),
            'user_b_id' => max($userId, $otherId),
        ]);

        $conversation = Conversation::find((int) $id);

        return ['success' => true, 'conversation' => self::conversationPayload($conversation ?? [], $userId)];
    }

    private static function belongsTo(int $conversationId, int $userId): ?array
    {
        return Conversation::queryOne(
            'SELECT * FROM conversations WHERE id = ? AND (user_a_id = ? OR user_b_id = ?)',
            [$conversationId, $userId, $userId]
        );
    }

    private static function conversationPayload(array $conversation, int $userId): array
    {
        $otherId = (int) $conversation['user_a_id'] === $userId
            ? (int) $conversation['user_b_id']
            : (int) $conversation['user_a_id'];

        $other = User::find($otherId);

        return [
            'id' => (int) $conversation['id'],
            'user_id' => $otherId,
            'user_name' => $other['name'] ?? '',
            'user_email' => $other['email'] ?? '',
            'created_at' => $conversation['created_at'] ?? null,
        ];
    }
}
