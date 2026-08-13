<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Models\Book;
use BookBay\Models\ExchangeRequest;

final class ExchangeController extends Controller
{
    public function store(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $offeredId = (int) ($data['offered_book_id'] ?? 0);
        $wantedId = (int) ($data['wanted_book_id'] ?? 0);

        if ($offeredId <= 0 || $wantedId <= 0 || $offeredId === $wantedId) {
            Response::json(['message' => 'Valid, distinct offered_book_id and wanted_book_id are required.'], 422);
        }

        if (Book::find($offeredId) === null || Book::find($wantedId) === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $id = ExchangeRequest::create([
            'user_id' => (int) $user['id'],
            'offered_book_id' => $offeredId,
            'wanted_book_id' => $wantedId,
            'message' => trim((string) ($data['message'] ?? '')),
            'status' => 'pending',
        ]);

        $this->json([
            'success' => true,
            'message' => 'Exchange request submitted.',
            'exchange_request' => self::find((int) $id, (int) $user['id']),
        ], 201);
    }

    public function index(): never
    {
        $user = $this->requireAuth();
        $status = (string) $this->request()->query('status', '');

        $sql = 'SELECT er.*, ob.title AS offered_book_title, wb.title AS wanted_book_title '
            . 'FROM exchange_requests er '
            . 'JOIN books ob ON ob.id = er.offered_book_id '
            . 'JOIN books wb ON wb.id = er.wanted_book_id WHERE er.user_id = ?';
        $params = [(int) $user['id']];

        if ($status !== '') {
            $sql .= ' AND er.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY er.id DESC';

        $this->json(['exchange_requests' => ExchangeRequest::queryAll($sql, $params)]);
    }

    public function show(int $id): never
    {
        $user = $this->requireAuth();

        $request = self::find($id, (int) $user['id']);
        if ($request === null) {
            Response::json(['message' => 'Exchange request not found.'], 404);
        }

        $this->json(['exchange_request' => $request]);
    }

    public function update(int $id): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $request = self::find($id, (int) $user['id']);
        if ($request === null) {
            Response::json(['message' => 'Exchange request not found.'], 404);
        }

        $clean = [];
        if (isset($data['message'])) {
            $clean['message'] = trim((string) $data['message']);
        }
        if (isset($data['status']) && in_array($data['status'], ['cancelled', 'accepted', 'declined'], true)) {
            $clean['status'] = $data['status'];
        }

        ExchangeRequest::update($id, $clean);

        $this->json(['success' => true, 'exchange_request' => self::find($id, (int) $user['id'])]);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAuth();

        ExchangeRequest::execute(
            'DELETE FROM exchange_requests WHERE id = ? AND user_id = ?',
            [$id, (int) $user['id']]
        );

        $this->json(['success' => true, 'message' => 'Exchange request deleted.']);
    }

    private static function find(int $id, int $userId): ?array
    {
        return ExchangeRequest::queryOne(
            'SELECT er.*, ob.title AS offered_book_title, wb.title AS wanted_book_title '
            . 'FROM exchange_requests er '
            . 'JOIN books ob ON ob.id = er.offered_book_id '
            . 'JOIN books wb ON wb.id = er.wanted_book_id WHERE er.id = ? AND er.user_id = ?',
            [$id, $userId]
        );
    }
}
