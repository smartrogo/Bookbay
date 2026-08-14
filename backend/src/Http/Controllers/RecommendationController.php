<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Models\UserActivity;
use Bookbay\Services\BookRecommendationService;

final class RecommendationController extends Controller
{
    /**
     * GET /recommendations/personalized
     * Get personalized book recommendations based on user history.
     */
    public function personalized(): never
    {
        $user = $this->user();
        $limit = max(1, min(50, (int) $this->request()->query('limit', 12)));

        if ($user === null) {
            // Not logged in: return popular books
            $this->json(['recommendations' => BookRecommendationService::popularBooks($limit)]);
        }

        $recommendations = BookRecommendationService::forUser((int) $user['id'], $limit);

        $this->json([
            'recommendations' => $recommendations,
            'count' => count($recommendations),
        ]);
    }

    /**
     * GET /recommendations/recently-viewed
     * Get recently viewed books for the authenticated user.
     */
    public function recentlyViewed(): never
    {
        $user = $this->requireAuth();
        $limit = max(1, min(20, (int) $this->request()->query('limit', 8)));

        $books = BookRecommendationService::recentlyViewed((int) $user['id'], $limit);

        $this->json([
            'recently_viewed' => $books,
            'count' => count($books),
        ]);
    }

    /**
     * GET /recommendations/similar/{bookId}
     * Get books similar to a given book.
     */
    public function similar(int $bookId): never
    {
        $limit = max(1, min(20, (int) $this->request()->query('limit', 6)));

        $books = BookRecommendationService::similarTo($bookId, $limit);

        $this->json([
            'similar_books' => $books,
            'count' => count($books),
        ]);
    }

    /**
     * POST /recommendations/track-view
     * Track a book view event for the authenticated user.
     */
    public function trackView(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $bookId = (int) ($data['book_id'] ?? 0);
        if ($bookId <= 0) {
            Response::json(['message' => 'A valid book_id is required.'], 422);
        }

        BookRecommendationService::trackView((int) $user['id'], $bookId);

        $this->json(['success' => true]);
    }
}
