<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Models\BorrowRequest;
use Bookbay\Services\BorrowService;

final class BorrowController extends Controller
{
    public function store(): never
    {
        $user = $this->requireAuth();
        $this->json(BorrowService::request((int) $user['id'], $this->request()->input()), 201);
    }

    public function index(): never
    {
        $user = $this->requireAuth();
        $status = (string) $this->request()->query('status', '');

        $this->json(['borrow_requests' => BorrowService::forUser((int) $user['id'], $status)]);
    }

    public function show(int $id): never
    {
        $user = $this->requireAuth();
        $request = BorrowService::find($id, (int) $user['id']);

        if ($request === null) {
            Response::json(['message' => 'Borrow request not found.'], 404);
        }

        $this->json(['borrow_request' => $request]);
    }

    public function update(int $id): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $request = BorrowService::find($id, (int) $user['id']);
        if ($request === null) {
            Response::json(['message' => 'Borrow request not found.'], 404);
        }

        if (($request['status'] ?? '') !== 'pending') {
            Response::json(['message' => 'Only pending requests can be edited.'], 422);
        }

        $clean = [];
        if (isset($data['days'])) {
            $clean['days'] = max(1, (int) $data['days']);
        }
        if (isset($data['status']) && $data['status'] === 'cancelled') {
            $clean['status'] = 'cancelled';
        }

        BorrowRequest::update($id, $clean);

        $this->json(['success' => true, 'borrow_request' => BorrowService::find($id, (int) $user['id'])]);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAuth();
        $this->json(BorrowService::cancel($id, (int) $user['id']));
    }
}
