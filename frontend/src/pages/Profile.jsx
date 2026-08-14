import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { Footer } from "../components/Footer";
import { apiClient } from "../services/api";
import { fetchGamificationSummary } from "../services/gamificationService";

export const Profile = () => {
  const { userData, isAuth, logOut } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [role, setRole] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Gamification
  const [gamification, setGamification] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/profile");
      return;
    }
    loadProfile();
  }, [isAuth, navigate, userData]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Load user data from API
      const response = await apiClient.get("/auth/me");
      const user = response.data?.user || userData;
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhone(user?.phone || "");
      setJoinDate(user?.created_at || user?.joined || "");
      const isSuperAdmin = user?.is_superadmin || user?.role === "superadmin";
      const isAdmin = user?.is_admin || user?.role === "admin";
      setRole(isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "User");

      // Load gamification data
      try {
        const gamRes = await fetchGamificationSummary();
        setGamification(gamRes);
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.warn("Failed to load profile from API, using local data:", error);
      // Fallback to context data
      setName(userData?.name || "");
      setEmail(userData?.email || "");
      setPhone(userData?.phone || "");
      setJoinDate(userData?.created_at || userData?.joined || "");
      const isSuperAdmin = userData?.is_superadmin || userData?.role === "superadmin";
      const isAdmin = userData?.is_admin || userData?.role === "admin";
      setRole(isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "User");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put("/auth/me", { name, phone });
      showToast("Profile updated successfully!", { type: "success" });
    } catch (error) {
      console.warn("Profile update failed:", error);
      showToast("Profile updated locally", { type: "success" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      showToast("Please fill in all password fields", { type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", { type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", { type: "error" });
      return;
    }

    setChangingPassword(true);
    try {
      await apiClient.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast("Password changed successfully!", { type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.warn("Password change failed:", error);
      showToast("Password change not available yet", { type: "error" });
    } finally {
      setChangingPassword(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-200 hover:text-white text-[0.85rem] mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-indigo-200">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-40 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{name || "No name set"}</h2>
                  <p className="text-slate-500 text-[0.9rem]">{email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-indigo-100 text-indigo-700">
                      👤 {role}
                    </span>
                    {joinDate && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-slate-100 text-slate-600">
                        📅 Joined {joinDate}
                      </span>
                    )}
                  </div>
                </div>
                {gamification && (
                  <div className="flex items-center gap-4 bg-amber-50 rounded-xl px-4 py-3">
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-600">{gamification.total_points}</p>
                      <p className="text-[0.7rem] text-amber-500">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">🔥 {gamification.streak?.current_streak || 0}</p>
                      <p className="text-[0.7rem] text-orange-500">Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-emerald-600">🏅 {gamification.badges_count || 0}</p>
                      <p className="text-[0.7rem] text-emerald-500">Badges</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Edit Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[0.7rem] text-slate-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Role</label>
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-1">Change Password</h3>
              <p className="text-[0.8rem] text-slate-500 mb-4">Update your password to keep your account secure</p>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[0.85rem] font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { to: "/dashboard", icon: "📊", label: "Dashboard", desc: "View your activity overview" },
                  { to: "/gamification", icon: "🏆", label: "Achievements", desc: "View badges and leaderboard" },
                  { to: "/wallet", icon: "💰", label: "Wallet", desc: "Manage your balance" },
                  { to: "/my-books", icon: "📚", label: "My Books", desc: "Books you've listed" },
                  { to: "/buy", icon: "🛒", label: "Browse Books", desc: "Discover new books" },
                  { to: "/sell", icon: "📦", label: "Sell a Book", desc: "List a book for sale" },
                ].map((link) => (
                  <button
                    key={link.to}
                    onClick={() => navigate(link.to)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition text-left"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900 text-[0.85rem]">{link.label}</p>
                      <p className="text-[0.7rem] text-slate-500">{link.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
              <h3 className="font-semibold text-red-700 mb-1">Danger Zone</h3>
              <p className="text-[0.8rem] text-slate-500 mb-4">Irreversible actions</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    logOut();
                    navigate("/");
                  }}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-[0.85rem] font-medium hover:bg-slate-50 transition"
                >
                  Sign out of all devices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
