<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Services\GamificationService;

final class GamificationController extends Controller
{
    /**
     * GET /gamification/summary
     * Get the authenticated user's gamification summary.
     */
    public function summary(): never
    {
        $user = $this->requireAuth();
        $this->json(['summary' => GamificationService::summary((int) $user['id'])]);
    }

    /**
     * GET /gamification/points
     * Get the authenticated user's points history.
     */
    public function points(): never
    {
        $user = $this->requireAuth();
        $limit = max(1, min(100, (int) $this->request()->query('limit', 20)));

        $history = GamificationService::pointsHistory((int) $user['id'], $limit);
        $total = GamificationService::totalPoints((int) $user['id']);

        $this->json(['points' => $history, 'total' => $total, 'count' => count($history)]);
    }

    /**
     * POST /gamification/points
     * Award points to the authenticated user (internal use or self-report).
     */
    public function awardPoints(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        $type = trim((string) ($data['type'] ?? ''));
        if ($type === '') {
            Response::json(['message' => 'A point type is required.'], 422);
        }

        $description = (string) ($data['description'] ?? '');
        $referenceId = (int) ($data['reference_id'] ?? 0);
        $referenceType = (string) ($data['reference_type'] ?? '');

        $id = GamificationService::awardPoints(
            (int) $user['id'],
            $type,
            $description,
            $referenceId,
            $referenceType
        );

        $total = GamificationService::totalPoints((int) $user['id']);
        $this->json(['success' => true, 'point_id' => $id, 'total_points' => $total], 201);
    }

    /**
     * GET /gamification/streak
     * Get the authenticated user's streak info.
     */
    public function streak(): never
    {
        $user = $this->requireAuth();
        $this->json(['streak' => GamificationService::getStreak((int) $user['id'])]);
    }

    /**
     * POST /gamification/streak
     * Record a daily activity for streak tracking.
     */
    public function recordActivity(): never
    {
        $user = $this->requireAuth();
        $result = GamificationService::recordActivity((int) $user['id']);
        $this->json(['streak' => $result]);
    }

    /**
     * GET /gamification/badges
     * Get the authenticated user's badges with earned status.
     */
    public function badges(): never
    {
        $user = $this->requireAuth();
        $allBadges = GamificationService::allBadges((int) $user['id']);
        $earned = GamificationService::getBadges((int) $user['id']);

        $this->json([
            'badges' => $allBadges,
            'earned_count' => count($earned),
            'total_count' => count($allBadges),
        ]);
    }

    /**
     * GET /gamification/leaderboard
     * Get the top users by points.
     */
    public function leaderboard(): never
    {
        $limit = max(1, min(50, (int) $this->request()->query('limit', 10)));
        $this->json(['leaderboard' => GamificationService::leaderboard($limit)]);
    }
}
