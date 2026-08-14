<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Services\AiService;

final class AiController extends Controller
{
    /**
     * GET /ai/conversations
     * List user's AI chat conversations.
     */
    public function conversations(): never
    {
        $user = $this->requireAuth();
        $this->json(['conversations' => AiService::conversations((int) $user['id'])]);
    }

    /**
     * POST /ai/conversations
     * Create a new AI chat conversation.
     */
    public function createConversation(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();
        $title = (string) ($data['title'] ?? 'New Chat');

        $id = AiService::createConversation((int) $user['id'], $title);
        $this->json(['conversation_id' => $id, 'title' => $title], 201);
    }

    /**
     * GET /ai/conversations/{id}/messages
     * Get messages in a conversation.
     */
    public function messages(int $conversationId): never
    {
        $user = $this->requireAuth();
        $limit = max(1, min(100, (int) $this->request()->query('limit', 50)));

        $messages = AiService::messages($conversationId, $limit);
        $this->json(['messages' => $messages, 'count' => count($messages)]);
    }

    /**
     * POST /ai/conversations/{id}/messages
     * Send a message and get AI response.
     */
    public function sendMessage(int $conversationId): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $message = trim((string) ($data['message'] ?? ''));
        if ($message === '') {
            Response::json(['message' => 'Message is required.'], 422);
        }

        try {
            $result = AiService::chat((int) $user['id'], $conversationId, $message);
            $this->json($result);
        } catch (\RuntimeException $e) {
            Response::json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * DELETE /ai/conversations/{id}
     * Delete a conversation.
     */
    public function deleteConversation(int $conversationId): never
    {
        $user = $this->requireAuth();

        try {
            AiService::deleteConversation((int) $user['id'], $conversationId);
            $this->json(['success' => true, 'message' => 'Conversation deleted.']);
        } catch (\RuntimeException $e) {
            Response::json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * POST /ai/summarize
     * Get an AI summary of a book.
     */
    public function summarize(): never
    {
        $data = $this->request()->input();
        $bookId = (int) ($data['book_id'] ?? 0);

        if ($bookId <= 0) {
            Response::json(['message' => 'A valid book_id is required.'], 422);
        }

        $summary = AiService::summarizeBook($bookId);
        $this->json(['summary' => $summary]);
    }

    /**
     * POST /ai/suggest
     * Get book suggestions based on a query.
     */
    public function suggest(): never
    {
        $data = $this->request()->input();
        $query = trim((string) ($data['query'] ?? ''));

        if ($query === '') {
            Response::json(['message' => 'A query is required.'], 422);
        }

        $books = AiService::suggestBooks($query);
        $this->json(['suggestions' => $books, 'count' => count($books)]);
    }
}
