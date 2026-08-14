import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { Footer } from "../components/Footer";
import {
  fetchGamificationSummary,
  fetchPointsHistory,
  fetchStreak,
  fetchBadges,
  fetchLeaderboard,
} from "../services/gamificationService";

const MEDAL_COLORS = ["text-amber-500", "text-slate-400", "text-amber-700"];

export const Gamification = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [points, setPoints] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [badges, setBadges] = useState([]);
  const [earnedCount, setEarnedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/gamification");
      return;
    }
    loadData();
  }, [isAuth, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, pointsRes, streakRes, badgesRes, leaderRes] = await Promise.allSettled([
        fetchGamificationSummary(),
        fetchPointsHistory(20),
        fetchStreak(),
        fetchBadges(),
        fetchLeaderboard(10),
      ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
      if (pointsRes.status === "fulfilled") {
        setPoints(pointsRes.value.points || []);
        setTotalPoints(pointsRes.value.total || 0);
      }
      if (streakRes.status === "fulfilled") setStreak(streakRes.value);
      if (badgesRes.status === "fulfilled") {
        setBadges(badgesRes.value.badges || []);
        setEarnedCount(badgesRes.value.earned_count || 0);
        setTotalCount(badgesRes.value.total_count || 0);
      }
      if (leaderRes.status === "fulfilled") setLeaderboard(leaderRes.value || []);
    } catch (error) {
      console.warn("Failed to load gamification data:", error);
    } finally {
      setLoading(false);
    }
  };

  const rank = summary?.rank || 0;
  const currentStreak = streak.current_streak || 0;
  const longestStreak = streak.longest_streak || 0;

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
          </div>
          <p className="text-amber-100">Earn points, build streaks, and unlock badges</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-20 mb-2" />
                <div className="h-8 bg-slate-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
                <p className="text-[0.75rem] font-semibold text-amber-600 uppercase tracking-wide">Points</p>
                <p className="text-[2rem] font-bold text-slate-900 mt-1">{totalPoints}</p>
                <p className="text-[0.7rem] text-slate-400 mt-0.5">Rank #{rank || "—"}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
                <p className="text-[0.75rem] font-semibold text-orange-600 uppercase tracking-wide">Current Streak</p>
                <p className="text-[2rem] font-bold text-slate-900 mt-1">{currentStreak}</p>
                <p className="text-[0.7rem] text-slate-400 mt-0.5">days in a row</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
                <p className="text-[0.75rem] font-semibold text-red-600 uppercase tracking-wide">Best Streak</p>
                <p className="text-[2rem] font-bold text-slate-900 mt-1">{longestStreak}</p>
                <p className="text-[0.7rem] text-slate-400 mt-0.5">all-time record</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
                <p className="text-[0.75rem] font-semibold text-emerald-600 uppercase tracking-wide">Badges</p>
                <p className="text-[2rem] font-bold text-slate-900 mt-1">{earnedCount}</p>
                <p className="text-[0.7rem] text-slate-400 mt-0.5">of {totalCount} unlocked</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: "overview", label: "Badges", icon: "🏅" },
                { id: "leaderboard", label: "Leaderboard", icon: "🥇" },
                { id: "history", label: "Points History", icon: "📊" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Badges Tab */}
            {activeTab === "overview" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">All Badges</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`relative p-4 rounded-xl border-2 text-center transition ${
                        badge.earned
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      {badge.earned && (
                        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold">
                          ✓
                        </span>
                      )}
                      <span className="text-3xl block mb-2">{badge.icon}</span>
                      <p className="font-semibold text-slate-900 text-[0.85rem]">{badge.name}</p>
                      <p className="text-[0.7rem] text-slate-500 mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
                {badges.filter((b) => !b.earned).length > 0 && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                    <p className="text-[0.85rem] font-semibold text-indigo-800">Keep going! 🎯</p>
                    <p className="text-[0.8rem] text-indigo-600 mt-1">
                      You have {badges.filter((b) => !b.earned).length} more badge(s) to unlock.
                      Keep earning points and building streaks!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Top Readers</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-6 py-3 font-semibold">Rank</th>
                        <th className="px-6 py-3 font-semibold">User</th>
                        <th className="px-6 py-3 font-semibold">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr
                          key={entry.user_id || entry.rank}
                          className={`border-b border-slate-50 transition ${
                            entry.user_id === userData?.id ? "bg-indigo-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-3.5">
                            <span className={`font-bold text-[1.1rem] ${MEDAL_COLORS[entry.rank - 1] || "text-slate-400"}`}>
                              {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[0.75rem] font-bold">
                                {(entry.name || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {entry.name || "User"}
                                  {entry.user_id === userData?.id && (
                                    <span className="ml-2 text-[0.7rem] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">You</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="font-bold text-amber-600">{entry.total_points} pts</span>
                          </td>
                        </tr>
                      ))}
                      {leaderboard.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                            No leaderboard data yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Points History Tab */}
            {activeTab === "history" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Points History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-6 py-3 font-semibold">Activity</th>
                        <th className="px-6 py-3 font-semibold">Description</th>
                        <th className="px-6 py-3 font-semibold">Points</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {points.map((point) => (
                        <tr key={point.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-indigo-50 text-indigo-700">
                              {point.type?.replace(/_/g, " ") || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">{point.description || "—"}</td>
                          <td className="px-6 py-3.5">
                            <span className="font-bold text-emerald-600">+{point.points}</span>
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">{point.created_at || "—"}</td>
                        </tr>
                      ))}
                      {points.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                            No points history yet. Start browsing books to earn your first points!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* How to earn points */}
            <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="font-bold text-lg mb-3">How to Earn Points</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { activity: "Browse a book", points: "+1" },
                  { activity: "Purchase a book", points: "+10" },
                  { activity: "Write a review", points: "+5" },
                  { activity: "Request to borrow", points: "+3" },
                  { activity: "Make an exchange", points: "+3" },
                  { activity: "Add to wishlist", points: "+2" },
                  { activity: "Daily login", points: "+5" },
                  { activity: "7-day streak", points: "+10" },
                  { activity: "Complete profile", points: "+15" },
                ].map((item) => (
                  <div key={item.activity} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-[0.8rem]">{item.activity}</span>
                    <span className="text-[0.8rem] font-bold text-amber-300">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};
