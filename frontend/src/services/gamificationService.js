import { apiClient } from "./api";

/**
 * Gamification service — points, streaks, badges, leaderboard.
 * Falls back to demo data when the backend is unavailable.
 */

const DEMO_BADGES = [
  { id: "first_purchase", name: "First Purchase", icon: "🎉", description: "Made your first book purchase", earned: false },
  { id: "bookworm", name: "Bookworm", icon: "🐛", description: "Purchased 5 books", earned: false },
  { id: "bibliophile", name: "Bibliophile", icon: "📚", description: "Purchased 10 books", earned: false },
  { id: "reviewer", name: "Reviewer", icon: "⭐", description: "Left your first review", earned: false },
  { id: "critic", name: "Critic", icon: "✍️", description: "Left 5 reviews", earned: false },
  { id: "streak_7", name: "On Fire", icon: "🔥", description: "7-day activity streak", earned: false },
  { id: "streak_30", name: "Dedicated", icon: "💎", description: "30-day activity streak", earned: false },
  { id: "explorer", name: "Explorer", icon: "🧭", description: "Viewed 10 different books", earned: false },
  { id: "social_butterfly", name: "Social Butterfly", icon: "🦋", description: "Made your first exchange request", earned: false },
  { id: "generous", name: "Generous", icon: "🎁", description: "Donated a book for borrowing", earned: false },
  { id: "centurion", name: "Centurion", icon: "💯", description: "Earned 100 points", earned: false },
  { id: "high_roller", name: "High Roller", icon: "🏆", description: "Earned 500 points", earned: false },
];

const DEMO_LEADERBOARD = [
  { rank: 1, name: "Aisha Bello", total_points: 150 },
  { rank: 2, name: "John Mensah", total_points: 120 },
  { rank: 3, name: "Demo User", total_points: 85 },
  { rank: 4, name: "Ngozi Okonkwo", total_points: 65 },
  { rank: 5, name: "Fatima Sani", total_points: 40 },
];

// ── Summary ─────────────────────────────────────────────────────

export const fetchGamificationSummary = async () => {
  try {
    const response = await apiClient.get("/gamification/summary");
    return response.data?.summary || { total_points: 0, rank: 0, streak: { current_streak: 0, longest_streak: 0 }, badges_count: 0, badges: [] };
  } catch (error) {
    console.warn("Gamification summary endpoint unavailable.", error);
    return { total_points: 0, rank: 0, streak: { current_streak: 0, longest_streak: 0 }, badges_count: 0, badges: [] };
  }
};

// ── Points ──────────────────────────────────────────────────────

export const fetchPointsHistory = async (limit = 20) => {
  try {
    const response = await apiClient.get("/gamification/points", { params: { limit } });
    return { points: response.data?.points || [], total: response.data?.total || 0 };
  } catch (error) {
    console.warn("Gamification points endpoint unavailable.", error);
    return { points: [], total: 0 };
  }
};

export const awardPoints = async (type, description = "", referenceId = 0, referenceType = "") => {
  try {
    const response = await apiClient.post("/gamification/points", {
      type, description, reference_id: referenceId, reference_type: referenceType,
    });
    return response.data;
  } catch (error) {
    console.warn("Failed to award points.", error);
    return { success: false };
  }
};

// ── Streak ──────────────────────────────────────────────────────

export const fetchStreak = async () => {
  try {
    const response = await apiClient.get("/gamification/streak");
    return response.data?.streak || { current_streak: 0, longest_streak: 0, last_activity_date: null };
  } catch (error) {
    console.warn("Gamification streak endpoint unavailable.", error);
    return { current_streak: 0, longest_streak: 0, last_activity_date: null };
  }
};

export const recordActivity = async () => {
  try {
    const response = await apiClient.post("/gamification/streak");
    return response.data?.streak || {};
  } catch (error) {
    console.warn("Failed to record activity.", error);
    return {};
  }
};

// ── Badges ──────────────────────────────────────────────────────

export const fetchBadges = async () => {
  try {
    const response = await apiClient.get("/gamification/badges");
    const data = response.data;
    return {
      badges: data?.badges || DEMO_BADGES,
      earned_count: data?.earned_count || 0,
      total_count: data?.total_count || DEMO_BADGES.length,
    };
  } catch (error) {
    console.warn("Gamification badges endpoint unavailable.", error);
    return { badges: DEMO_BADGES, earned_count: 0, total_count: DEMO_BADGES.length };
  }
};

// ── Leaderboard ─────────────────────────────────────────────────

export const fetchLeaderboard = async (limit = 10) => {
  try {
    const response = await apiClient.get("/gamification/leaderboard", { params: { limit } });
    return response.data?.leaderboard || DEMO_LEADERBOARD;
  } catch (error) {
    console.warn("Gamification leaderboard endpoint unavailable.", error);
    return DEMO_LEADERBOARD;
  }
};
