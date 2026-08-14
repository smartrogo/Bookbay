<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Services\ChatService;

final class ChatController extends Controller
{
    public function conversations(int $userId): never
    {
        $this->requireOwnership($userId);
        $this->json(['conversations' => ChatService::conversationsFor($userId)]);
    }

    public function createConversation(): never
    {
        $user = $this->requireAuth();
        $this->json(ChatService::start((int) $user['id'], $this->request()->input()), 201);
    }

    public function messages(int $conversationId): never
    {
        $user = $this->requireAuth();
        $this->json(['messages' => ChatService::messages($conversationId, (int) $user['id'])]);
    }

    public function sendMessage(int $conversationId): never
    {
        $user = $this->requireAuth();
        $body = (string) ($this->request()->input()['body'] ?? '');
        $this->json(ChatService::send($conversationId, (int) $user['id'], $body), 201);
    }
}
