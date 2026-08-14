<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Services\NotificationService;

final class NotificationController extends Controller
{
    public function index(): never
    {
        $user = $this->requireAuth();
        $unreadOnly = filter_var($this->request()->query('unread', false), FILTER_VALIDATE_BOOL);

        $this->json([
            'notifications' => NotificationService::forUser((int) $user['id'], $unreadOnly),
            'unread_count' => NotificationService::unreadCount((int) $user['id']),
        ]);
    }

    public function read(int $id): never
    {
        $user = $this->requireAuth();
        NotificationService::markRead($id, (int) $user['id']);

        $this->json(['success' => true]);
    }

    public function readAll(): never
    {
        $user = $this->requireAuth();
        $updated = NotificationService::markAllRead((int) $user['id']);

        $this->json(['success' => true, 'updated' => $updated]);
    }
}
