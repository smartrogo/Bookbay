<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Models\AiConversation;
use BookBay\Models\AiMessage;
use BookBay\Models\Book;

/**
 * AI Assistant service.
 *
 * When OPENAI_API_KEY is set, uses the OpenAI Chat Completions API.
 * Otherwise falls back to local heuristics (keyword matching against books).
 */
final class AiService
{
    private static string $apiBase = 'https://api.openai.com/v1';
    private static string $model = 'gpt-3.5-turbo';

    /**
     * Create a new conversation for the user.
     */
    public static function createConversation(int $userId, string $title = 'New Chat'): int
    {
        return AiConversation::create([
            'user_id' => $userId,
            'title' => $title,
        ]);
    }

    /**
     * Send a message and get an AI response.
     *
     * Returns ['conversation_id' => int, 'reply' => string, 'tokens_used' => int].
     */
    public static function chat(int $userId, int $conversationId, string $message): array
    {
        // Verify conversation belongs to user
        $conversation = AiConversation::find($conversationId);
        if ($conversation === null || (int) $conversation['user_id'] !== $userId) {
            throw new \RuntimeException('Conversation not found.');
        }

        // Save user message
        AiMessage::create([
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => $message,
            'tokens_used' => 0,
        ]);

        // Build context from recent messages
        $history = AiMessage::queryAll(
            'SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 20',
            [$conversationId]
        );

        $apiKey = (string) ($_ENV['OPENAI_API_KEY'] ?? '');

        if ($apiKey !== '') {
            $result = self::callOpenAI($apiKey, $history);
        } else {
            $result = self::localResponse($message);
        }

        // Save assistant reply
        AiMessage::create([
            'conversation_id' => $conversationId,
            'role' => 'assistant',
            'content' => $result['reply'],
            'tokens_used' => $result['tokens_used'],
        ]);

        // Update conversation title from first user message if still default
        if ($conversation['title'] === 'New Chat') {
            $short = mb_substr($message, 0, 80);
            AiConversation::update($conversationId, ['title' => $short]);
        }

        return [
            'conversation_id' => $conversationId,
            'reply' => $result['reply'],
            'tokens_used' => $result['tokens_used'],
        ];
    }

    /**
     * Get all conversations for a user.
     */
    public static function conversations(int $userId): array
    {
        return AiConversation::queryAll(
            'SELECT c.*, (SELECT COUNT(*) FROM ai_messages m WHERE m.conversation_id = c.id) AS message_count '
            . 'FROM ai_conversations c WHERE c.user_id = ? ORDER BY c.id DESC',
            [$userId]
        );
    }

    /**
     * Get messages in a conversation.
     */
    public static function messages(int $conversationId, int $limit = 50): array
    {
        return AiMessage::queryAll(
            'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC LIMIT ?',
            [$conversationId, $limit]
        );
    }

    /**
     * Delete a conversation and its messages.
     */
    public static function deleteConversation(int $userId, int $conversationId): void
    {
        $conversation = AiConversation::find($conversationId);
        if ($conversation === null || (int) $conversation['user_id'] !== $userId) {
            throw new \RuntimeException('Conversation not found.');
        }

        // Delete messages first
        AiMessage::queryAll('DELETE FROM ai_messages WHERE conversation_id = ?', [$conversationId]);
        AiConversation::delete($conversationId);
    }

    /**
     * Summarize a book for the user.
     */
    public static function summarizeBook(int $bookId): string
    {
        $book = Book::find($bookId);
        if ($book === null) {
            return 'Book not found.';
        }

        $apiKey = (string) ($_ENV['OPENAI_API_KEY'] ?? '');

        $category = (string) ($book['category'] ?? 'Unknown');
        $description = (string) ($book['description'] ?? 'No description available.');
        $prompt = "Summarize the book \"{$book['title']}\" by {$book['author']}. "
            . "Category: {$category}. "
            . "Description: {$description}";

        if ($apiKey !== '') {
            $result = self::callOpenAI($apiKey, [
                ['role' => 'system', 'content' => 'You are a helpful book assistant. Provide concise, engaging summaries.'],
                ['role' => 'user', 'content' => $prompt],
            ]);
            return $result['reply'];
        }

        // Local fallback
        return self::localBookSummary($book);
    }

    /**
     * Get reading suggestions based on user message.
     */
    public static function suggestBooks(string $query): array
    {
        // Search books by keywords in the query
        $words = explode(' ', strtolower($query));
        $conditions = [];
        $params = [];

        foreach ($words as $word) {
            $word = trim($word);
            if (strlen($word) < 2) continue;
            $conditions[] = '(LOWER(b.title) LIKE ? OR LOWER(b.author) LIKE ? OR LOWER(b.description) LIKE ?)';
            $like = '%' . $word . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($conditions === []) {
            // Default: return popular books
            $books = Book::queryAll(
                'SELECT b.*, c.name AS category FROM books b LEFT JOIN categories c ON c.id = b.category_id WHERE b.status = ? ORDER BY b.id DESC LIMIT 6',
                ['active']
            );
        } else {
            $sql = 'SELECT b.*, c.name AS category FROM books b LEFT JOIN categories c ON c.id = b.category_id '
                . 'WHERE b.status = ? AND (' . implode(' OR ', $conditions) . ') '
                . 'ORDER BY b.id DESC LIMIT 6';
            array_unshift($params, 'active');
            $books = Book::queryAll($sql, $params);
        }

        return array_map(fn($b) => [
            'id' => (int) $b['id'],
            'title' => (string) $b['title'],
            'author' => (string) $b['author'],
            'category' => (string) ($b['category'] ?? ''),
            'cover' => (string) ($b['cover'] ?? ''),
            'price_buy' => (float) ($b['price_buy'] ?? 0),
        ], $books);
    }

    // ── Private Helpers ────────────────────────────────────────────

    private static function callOpenAI(string $apiKey, array $history): array
    {
        $systemPrompt = "You are BookBay AI, a helpful assistant for an online bookstore. "
            . "You help users find books, provide summaries, give reading recommendations, "
            . "and answer questions about literature. Be friendly, concise, and helpful. "
            . "When recommending books, mention you can search the BookBay catalog.";

        $messages = [['role' => 'system', 'content' => $systemPrompt]];
        foreach ($history as $msg) {
            $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
        }

        $payload = json_encode([
            'model' => self::$model,
            'messages' => $messages,
            'max_tokens' => 500,
            'temperature' => 0.7,
        ]);

        $ch = curl_init(self::$apiBase . '/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                "Authorization: Bearer {$apiKey}",
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || $response === false) {
            return self::localResponse('fallback');
        }

        $data = json_decode($response, true);
        $reply = $data['choices'][0]['message']['content'] ?? 'I apologize, but I could not generate a response.';
        $tokens = $data['usage']['total_tokens'] ?? 0;

        return ['reply' => $reply, 'tokens_used' => $tokens];
    }

    private static function localResponse(string $message): array
    {
        $lower = strtolower($message);

        // Greeting patterns
        if (preg_match('/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/', $lower)) {
            $reply = "Hello! 👋 I'm BookBay AI, your personal book assistant. I can help you:\n\n"
                . "• Find books by title, author, or topic\n"
                . "• Get book summaries and recommendations\n"
                . "• Answer questions about literature\n\n"
                . "What would you like to know?";
            return ['reply' => $reply, 'tokens_used' => 0];
        }

        // Recommendation request
        if (preg_match('/\b(recommend|suggest|what should|best book|good book|looking for)\b/', $lower)) {
            $books = self::suggestBooks($message);
            if ($books !== []) {
                $reply = "Here are some books you might enjoy:\n\n";
                foreach ($books as $i => $book) {
                    $reply .= ($i + 1) . ". **{$book['title']}** by {$book['author']}\n"
                        . "   Category: {$book['category']}\n\n";
                }
                $reply .= "Would you like more details about any of these?";
            } else {
                $reply = "I'd love to help you find a great book! Could you tell me more about what genre or topic interests you? "
                    . "For example: fiction, science, history, programming, etc.";
            }
            return ['reply' => $reply, 'tokens_used' => 0];
        }

        // Search intent
        if (preg_match('/\b(search|find|look for|where|do you have|books about)\b/', $lower)) {
            $books = self::suggestBooks($message);
            if ($books !== []) {
                $reply = "I found these books that might match what you're looking for:\n\n";
                foreach ($books as $i => $book) {
                    $reply .= ($i + 1) . ". **{$book['title']}** by {$book['author']} — $" . number_format($book['price_buy'], 2) . "\n";
                }
            } else {
                $reply = "I couldn't find specific matches for that query. Try searching with different keywords, "
                    . "or browse our catalog on the Buy page.";
            }
            return ['reply' => $reply, 'tokens_used' => 0];
        }

        // Help
        if (preg_match('/\b(help|what can you|how do|capabilities)\b/', $lower)) {
            $reply = "Here's what I can help with:\n\n"
                . "📚 **Book Search** — \"Find books about programming\"\n"
                . "📖 **Recommendations** — \"Recommend me a fiction book\"\n"
                . "🔍 **Book Details** — \"Tell me about Things Fall Apart\"\n"
                . "💡 **Reading Tips** — \"What are good books for beginners?\"\n\n"
                . "Just ask naturally and I'll do my best to help!";
            return ['reply' => $reply, 'tokens_used' => 0];
        }

        // Default response
        $reply = "Thanks for your message! I'm here to help with books and reading. You can:\n\n"
            . "• Ask me to recommend books\n"
            . "• Search for specific books or topics\n"
            . "• Ask about books you're interested in\n\n"
            . "What would you like to explore?";

        return ['reply' => $reply, 'tokens_used' => 0];
    }

    private static function localBookSummary(array $book): string
    {
        $title = (string) $book['title'];
        $author = (string) $book['author'];
        $category = (string) ($book['category'] ?? 'Unknown');
        $description = (string) ($book['description'] ?? '');

        if ($description !== '') {
            return "**{$title}** by {$author}\n\n"
                . "{$description}\n\n"
                . "_Category: {$category}_";
        }

        return "**{$title}** by {$author}\n\n"
            . "This book falls under the **{$category}** category. "
            . "Unfortunately, a detailed summary is not yet available for this title. "
            . "Check back later for AI-generated summaries!\n\n"
            . "_Browse the BookBay catalog to learn more about this book._";
    }
}
