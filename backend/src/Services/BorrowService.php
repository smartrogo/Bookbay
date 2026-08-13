<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Core\Response;
use BookBay\Models\Book;
use BookBay\Models\BorrowRequest;

final class BorrowService
{
    public static function request(int $userId, array $data): array
    {
        $bookId = (int) ($data['book_id'] ?? 0);
        $days = (int) ($data['days'] ?? 0);

        if ($bookId <= 0 || $days <= 0) {
            Response::json(['message' => 'A valid book_id and days (positive) are required.'], 422);
        }

        $book = Book::find($bookId);

        if ($book === null || ($book['status'] ?? '') !== 'active') {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $existing = BorrowRequest::firstWhere('book_id', $bookId);
        if ($existing !== null && (int) $existing['user_id'] === $userId && ($existing['status'] ?? '') === 'pending') {
            Response::json(['message' => 'You already have a pending request for this book.'], 409);
        }

        $id = BorrowRequest::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'days' => $days,
            'status' => 'pending',
        ]);

        return [
            'success' => true,
            'message' => 'Borrow request submitted.',
            'borrow_request' => self::find((int) $id, $userId),
        ];
    }

    public static function forUser(int $userId, string $status = ''): array
    {
        $sql = 'SELECT br.*, b.title AS book_title, b.cover, u.name AS user_name FROM borrow_requests br '
            . 'JOIN books b ON b.id = br.book_id JOIN users u ON u.id = br.user_id WHERE br.user_id = ?';
        $params = [$userId];

        if ($status !== '') {
            $sql .= ' AND br.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY br.id DESC';

        return BorrowRequest::queryAll($sql, $params);
    }

    public static function find(int $id, ?int $userId = null): ?array
    {
        $sql = 'SELECT br.*, b.title AS book_title, b.cover, u.name AS user_name FROM borrow_requests br '
            . 'JOIN books b ON b.id = br.book_id JOIN users u ON u.id = br.user_id WHERE br.id = ?';
        $params = [$id];

        if ($userId !== null) {
            $sql .= ' AND br.user_id = ?';
            $params[] = $userId;
        }

        return BorrowRequest::queryOne($sql, $params);
    }

    public static function cancel(int $id, int $userId): array
    {
        $request = self::find($id, $userId);

        if ($request === null) {
            Response::json(['message' => 'Borrow request not found.'], 404);
        }

        if (($request['status'] ?? '') !== 'pending') {
            Response::json(['message' => 'Only pending requests can be cancelled.'], 422);
        }

        BorrowRequest::update((int) $request['id'], ['status' => 'cancelled']);

        return ['success' => true, 'message' => 'Borrow request cancelled.'];
    }

    /**
     * Admin decision: approve or reject a request. Notifies the user.
     */
    public static function decide(int $requestId, string $status, int $adminId): array
    {
        if (!in_array($status, ['approved', 'rejected'], true)) {
            Response::json(['message' => 'Status must be approved or rejected.'], 422);
        }

        $request = self::find($requestId);

        if ($request === null) {
            Response::json(['message' => 'Borrow request not found.'], 404);
        }

        BorrowRequest::update((int) $request['id'], ['status' => $status]);

        $verb = $status === 'approved' ? 'approved' : 'rejected';
        NotificationService::send(
            (int) $request['user_id'],
            'Borrow request ' . $verb,
            "Your borrow request for '{$request['book_title']}' was {$verb}."
        );

        AuditService::log($adminId, 'borrow.' . $status, ['borrow_request_id' => $requestId]);

        return [
            'success' => true,
            'message' => "Borrow request {$verb}.",
            'borrow_request' => self::find($requestId),
        ];
    }

    public static function all(string $status = ''): array
    {
        $sql = 'SELECT br.*, b.title AS book_title, b.cover, u.name AS user_name, u.email AS user_email FROM borrow_requests br '
            . 'JOIN books b ON b.id = br.book_id JOIN users u ON u.id = br.user_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE br.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY br.id DESC';

        return BorrowRequest::queryAll($sql, $params);
    }
}
