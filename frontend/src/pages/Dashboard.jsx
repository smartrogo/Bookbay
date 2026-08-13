import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  fetchAdminDashboard,
  fetchAdminBooks,
  fetchAdminUsers,
  fetchAdminBorrowRequests,
  updateAdminBorrowRequest,
  updateAdminBookStatus,
} from "../services/adminService";
import { fetchUserBooks } from "../services/bookService";
import { fetchBorrowRequests } from "../services/borrowService";
import { fetchWallet } from "../services/walletService";
import {
  fetchExchangeRequests,
  unwrapExchangeRequests,
  normalizeExchange,
} from "../services/exchangeService";
import {
  fetchConversations,
  unwrapConversations,
  normalizeConversation,
} from "../services/messageService";
import ExchangePanel from "../components/dashboard/ExchangePanel";
import MessagesPanel from "../components/dashboard/MessagesPanel";
import logo from "../assets/logo.png";

/* ------------------------------ helpers ------------------------------ */

const ADMIN_NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "borrow", label: "Borrow Requests", icon: "🔁" },
  { id: "exchange", label: "Exchange", icon: "🔄" },
  { id: "messages", label: "Messages", icon: "💬" },
];

const USER_NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "mybooks", label: "My Books", icon: "📚" },
  { id: "borrow", label: "Borrow", icon: "🔁" },
  { id: "exchange", label: "Exchange", icon: "🔄" },
  { id: "messages", label: "Messages", icon: "💬" },
];

const statusStyles = {
  completed: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  returned: "bg-sky-100 text-sky-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-red-100 text-red-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-600",
  declined: "bg-rose-100 text-rose-700",
  rejected: "bg-rose-100 text-rose-700",
  inactive: "bg-slate-200 text-slate-600",
};

const statusClass = (status) => statusStyles[status] || "bg-slate-100 text-slate-600";

const StatCard = ({ label, value, sub, accent }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <p className="text-[0.8rem] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <span className={`w-2 h-2 rounded-full ${accent || "bg-indigo-500"}`} />
    </div>
    <p className="text-[1.9rem] font-bold text-slate-900 mt-2">{value}</p>
    {sub && <p className="text-[0.8rem] text-slate-400 mt-1">{sub}</p>}
  </div>
);

const formatCurrency = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

/* --------------------------- main component -------------------------- */

export const Dashboard = () => {
  const { isAuth, isAdmin, userData, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // admin state
  const [dashboard, setDashboard] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);

  // user state
  const [wallet, setWallet] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;
  const currentUserId = userData?.id;

  const adminQuickActions = [
    { label: "Review requests", tab: "borrow" },
    { label: "Manage books", tab: "books" },
    { label: "View users", tab: "users" },
  ];

  const userQuickActions = [
    { label: "List a book", to: "/sell" },
    { label: "Borrow a book", to: "/borrow" },
    { label: "My wallet", to: "/wallet" },
  ];

  const loadAdminData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const [dash, bookList, userList, borrowList] = await Promise.allSettled([
      fetchAdminDashboard(),
      fetchAdminBooks(),
      fetchAdminUsers(),
      fetchAdminBorrowRequests(),
    ]);
    setDashboard(dash.status === "fulfilled" ? dash.value : null);
    setBooks(bookList.status === "fulfilled" ? bookList.value : []);
    setUsers(userList.status === "fulfilled" ? userList.value : []);
    setBorrows(borrowList.status === "fulfilled" ? borrowList.value : []);
    if (showLoader) setLoading(false);
  }, []);

  const loadUserData = useCallback(async (showLoader = true) => {
    if (!currentUserId) return;
    if (showLoader) setLoading(true);

    const [walletRes, booksRes, borrowRes, exchangeRes, convRes] = await Promise.allSettled([
      fetchWallet(currentUserId),
      fetchUserBooks(currentUserId),
      fetchBorrowRequests(),
      fetchExchangeRequests(),
      fetchConversations(currentUserId),
    ]);

    if (walletRes.status === "fulfilled") setWallet(walletRes.value?.wallet || null);
    if (booksRes.status === "fulfilled") setMyBooks(booksRes.value?.books || []);
    if (borrowRes.status === "fulfilled") setMyBorrows(borrowRes.value?.borrow_requests || []);
    if (exchangeRes.status === "fulfilled") {
      setExchangeRequests(unwrapExchangeRequests(exchangeRes.value).map(normalizeExchange));
    }
    if (convRes.status === "fulfilled") {
      setConversations(unwrapConversations(convRes.value).map(normalizeConversation));
    }

    if (showLoader) setLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    if (!isAuth) return;
    if (isAdmin) loadAdminData(true);
    else loadUserData(true);
  }, [isAuth, isAdmin, loadAdminData, loadUserData]);

  useEffect(() => {
    setActiveTab("overview");
    setSidebarOpen(false);
  }, [isAdmin]);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (isAdmin) await loadAdminData(false);
    else await loadUserData(false);
    setRefreshing(false);
  };

  const handleBorrowRequestAction = async (requestId, nextStatus) => {
    const target = borrows.find((item) => item.id === requestId || item.id === Number(requestId));
    if (!target) return;

    setBorrows((current) =>
      current.map((item) =>
        item.id === requestId || item.id === Number(requestId)
          ? { ...item, status: nextStatus }
          : item
      )
    );

    try {
      await updateAdminBorrowRequest(requestId, { status: nextStatus });
    } catch (error) {
      console.warn("Unable to persist borrow request update.", error);
    }
  };

  const handleBookStatusToggle = async (bookId) => {
    const target = books.find((item) => item.id === bookId || item.id === Number(bookId));
    if (!target) return;

    const nextStatus = target.status === "active" ? "inactive" : "active";
    setBooks((current) =>
      current.map((item) =>
        item.id === bookId || item.id === Number(bookId) ? { ...item, status: nextStatus } : item
      )
    );

    try {
      await updateAdminBookStatus(bookId, { status: nextStatus });
    } catch (error) {
      console.warn("Unable to persist book status update.", error);
    }
  };

  const handleCancelMyBorrow = async (id) => {
    // Local removal; the dedicated cancel endpoint persists server-side.
    setMyBorrows((current) => current.filter((b) => b.id !== id));
    try {
      const { cancelBorrowRequest } = await import("../services/borrowService");
      await cancelBorrowRequest(id);
    } catch (error) {
      console.warn("Unable to persist borrow cancellation.", error);
    }
  };

  const filteredBooks = books.filter((b) =>
    `${b.title || ""} ${b.author || ""}`.toLowerCase().includes(bookSearch.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const stats = dashboard?.stats || {};
  const revenueByMonth = dashboard?.revenue_by_month || [];
  const recentOrders = dashboard?.recent_orders || [];
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.amount), 1);

  const pendingBorrows = myBorrows.filter((b) => b.status === "pending").length;
  const pendingExchanges = exchangeRequests.filter((r) => r.status === "pending").length;

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ------------------------- sidebar ------------------------- */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-[#0f172a] text-slate-300 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <img src={logo} alt="BookBay" className="w-24 h-auto" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {isAdmin ? "Admin Panel" : "My Dashboard"}
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.9rem] font-medium transition-all duration-150 ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-[1.05rem]">{item.icon}</span>
                {item.label}
                {item.id === "messages" && conversations.length > 0 && (
                  <span className="ml-auto text-[0.68rem] bg-white/15 rounded-full px-2 py-0.5">
                    {conversations.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-[0.85rem]">
                {userData?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-[0.85rem] font-semibold truncate">
                  {userData?.name || userData?.email || "User"}
                </p>
                <p className="text-slate-400 text-[0.7rem] truncate">{userData?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 py-2 text-[0.85rem] font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --------------------------- main --------------------------- */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 min-w-0">
        {/* top bar */}
        <header className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-[1.35rem] font-bold text-slate-900 capitalize">
                {navItems.find((n) => n.id === activeTab)?.label || "Overview"}
              </h1>
              <p className="text-[0.85rem] text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.8rem] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5.6 14A8 8 0 0118.4 10M18.4 10A8 8 0 015.6 14" />
              </svg>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-1.5 text-[0.8rem] text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 text-[0.9rem]">
              {isAdmin ? "Loading admin data..." : "Loading your dashboard..."}
            </p>
          </div>
        ) : (
          <>
            {/* ------------------- OVERVIEW TAB ------------------- */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6 text-white shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-indigo-200">
                        {isAdmin ? "BookBay admin control center" : "Your BookBay dashboard"}
                      </p>
                      <h2 className="mt-2 text-[1.35rem] font-semibold">
                        Welcome back, {userData?.name || userData?.email || (isAdmin ? "Admin" : "User")}
                      </h2>
                      <p className="mt-2 max-w-2xl text-[0.9rem] text-indigo-100">
                        {isAdmin
                          ? "Monitor sales, inventory, new members, and borrow approvals from a single place."
                          : "Keep an eye on your books, borrow requests, exchanges, and messages — all in one place."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isAdmin ? adminQuickActions : userQuickActions).map((action) =>
                        action.tab ? (
                          <button
                            key={action.tab}
                            onClick={() => setActiveTab(action.tab)}
                            className="rounded-full bg-white/15 px-3 py-2 text-[0.8rem] font-medium text-white/90 transition hover:bg-white/25"
                          >
                            {action.label}
                          </button>
                        ) : (
                          <button
                            key={action.to}
                            onClick={() => navigate(action.to)}
                            className="rounded-full bg-white/15 px-3 py-2 text-[0.8rem] font-medium text-white/90 transition hover:bg-white/25"
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {isAdmin ? (
                  <>
                    {/* admin stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      <StatCard label="Total Books" value={stats.total_books ?? books.length} sub="Across all categories" accent="bg-indigo-500" />
                      <StatCard label="Total Users" value={stats.total_users ?? users.length} sub="Registered accounts" accent="bg-emerald-500" />
                      <StatCard label="Orders" value={stats.total_orders ?? "-"} sub={`${stats.pending_orders ?? 0} pending`} accent="bg-amber-500" />
                      <StatCard label="Revenue" value={formatCurrency(stats.total_revenue)} sub={`${stats.pending_borrow_requests ?? 0} borrow requests pending`} accent="bg-rose-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* revenue chart */}
                      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="font-semibold text-slate-900">Revenue overview</h3>
                            <p className="text-[0.8rem] text-slate-400">Monthly revenue for the current year</p>
                          </div>
                          <span className="text-[0.75rem] font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                            {revenueByMonth.length} months
                          </span>
                        </div>
                        <div className="flex items-end gap-2 sm:gap-3 h-44">
                          {revenueByMonth.map((month) => (
                            <div key={month.month} className="flex-1 flex flex-col items-center gap-2 group">
                              <span className="text-[0.68rem] text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition">
                                {formatCurrency(month.amount)}
                              </span>
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 transition-all duration-300"
                                style={{ height: `${Math.max((month.amount / maxRevenue) * 100, 4)}%` }}
                              />
                              <span className="text-[0.7rem] text-slate-400">{month.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* quick stats */}
                      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4">Quick overview</h3>
                        <div className="space-y-4">
                          {[
                            { label: "Pending orders", value: stats.pending_orders ?? 0, color: "text-amber-600" },
                            { label: "Borrow requests", value: stats.pending_borrow_requests ?? 0, color: "text-indigo-600" },
                            { label: "New messages", value: stats.new_messages ?? 0, color: "text-emerald-600" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="text-[0.9rem] text-slate-600">{item.label}</span>
                              <span className={`text-[1.1rem] font-bold ${item.color}`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
                          <p className="text-[0.8rem] font-semibold">Tip of the day</p>
                          <p className="text-[0.8rem] text-indigo-100 mt-1">
                            Approve pending borrow requests quickly to keep users happy.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* recent orders */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900">Recent orders</h3>
                        <button
                          onClick={() => setActiveTab("books")}
                          className="text-[0.8rem] text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[0.875rem]">
                          <thead>
                            <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                              <th className="px-6 py-3 font-semibold">Order</th>
                              <th className="px-6 py-3 font-semibold">Customer</th>
                              <th className="px-6 py-3 font-semibold">Book</th>
                              <th className="px-6 py-3 font-semibold">Amount</th>
                              <th className="px-6 py-3 font-semibold">Status</th>
                              <th className="px-6 py-3 font-semibold">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.slice(0, 6).map((order) => (
                              <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                <td className="px-6 py-3.5 font-medium text-indigo-600">{order.id}</td>
                                <td className="px-6 py-3.5 text-slate-700">{order.customer}</td>
                                <td className="px-6 py-3.5 text-slate-600">{order.book}</td>
                                <td className="px-6 py-3.5 font-medium text-slate-900">{formatCurrency(order.amount)}</td>
                                <td className="px-6 py-3.5">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(order.status)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-slate-500">{order.date}</td>
                              </tr>
                            ))}
                            {recentOrders.length === 0 && (
                              <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                  No orders yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* user stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      <StatCard
                        label="Wallet Balance"
                        value={formatCurrency(wallet?.balance)}
                        sub="Available funds"
                        accent="bg-emerald-500"
                      />
                      <StatCard label="My Books" value={myBooks.length} sub="Active listings" accent="bg-indigo-500" />
                      <StatCard label="Borrow Requests" value={myBorrows.length} sub={`${pendingBorrows} pending`} accent="bg-amber-500" />
                      <StatCard label="Exchanges" value={exchangeRequests.length} sub={`${pendingExchanges} pending`} accent="bg-rose-500" />
                    </div>

                    {/* activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                          <h3 className="font-semibold text-slate-900">Recent conversations</h3>
                          <button
                            onClick={() => setActiveTab("messages")}
                            className="text-[0.8rem] text-indigo-600 hover:text-indigo-800 font-medium transition"
                          >
                            Open messages →
                          </button>
                        </div>
                        <ul className="divide-y divide-slate-50">
                          {conversations.slice(0, 4).map((c) => (
                            <li key={c.id} className="px-6 py-3.5 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[0.8rem] font-bold shrink-0">
                                {(c.user_name || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-800 text-[0.9rem] truncate">{c.user_name}</p>
                                <p className="text-[0.8rem] text-slate-500 truncate">{c.last_message || "—"}</p>
                              </div>
                            </li>
                          ))}
                          {conversations.length === 0 && (
                            <li className="px-6 py-10 text-center text-slate-400 text-[0.85rem]">No conversations yet.</li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                          <h3 className="font-semibold text-slate-900">Recent exchanges</h3>
                          <button
                            onClick={() => setActiveTab("exchange")}
                            className="text-[0.8rem] text-indigo-600 hover:text-indigo-800 font-medium transition"
                          >
                            Open exchange →
                          </button>
                        </div>
                        <ul className="divide-y divide-slate-50">
                          {exchangeRequests.slice(0, 4).map((r) => (
                            <li key={r.id} className="px-6 py-3.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-slate-800 text-[0.9rem] truncate">{r.offered_book_title}</span>
                                <span className="text-slate-400 text-[0.85rem]">⇄</span>
                                <span className="font-medium text-slate-800 text-[0.9rem] truncate">{r.wanted_book_title}</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium ${statusClass(r.status)}`}>
                                  {r.status}
                                </span>
                              </div>
                            </li>
                          ))}
                          {exchangeRequests.length === 0 && (
                            <li className="px-6 py-10 text-center text-slate-400 text-[0.85rem]">No exchange requests yet.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* -------------------- BOOKS TAB (admin) -------------------- */}
            {activeTab === "books" && isAdmin && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">All books</h3>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      placeholder="Search books..."
                      className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-6 py-3 font-semibold">#</th>
                        <th className="px-6 py-3 font-semibold">Title</th>
                        <th className="px-6 py-3 font-semibold">Author</th>
                        <th className="px-6 py-3 font-semibold">Category</th>
                        <th className="px-6 py-3 font-semibold">Price</th>
                        <th className="px-6 py-3 font-semibold">Stock</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book, i) => (
                        <tr key={book.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3.5 text-slate-400">{i + 1}</td>
                          <td className="px-6 py-3.5 font-medium text-slate-900">{book.title}</td>
                          <td className="px-6 py-3.5 text-slate-600">{book.author}</td>
                          <td className="px-6 py-3.5 text-slate-600">{book.category}</td>
                          <td className="px-6 py-3.5 font-medium text-slate-900">{formatCurrency(book.price)}</td>
                          <td className="px-6 py-3.5">
                            <span className={book.stock === 0 ? "text-red-500 font-semibold" : "text-slate-700"}>
                              {book.stock}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(book.status)}`}>
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <button
                              onClick={() => handleBookStatusToggle(book.id)}
                              className="rounded-full border border-slate-200 px-3 py-1 text-[0.75rem] font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                            >
                              {book.status === "active" ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBooks.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-slate-400">
                            No books found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------- MY BOOKS TAB (user) -------------------- */}
            {activeTab === "mybooks" && !isAdmin && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-semibold text-slate-900">My books</h3>
                    <p className="text-[0.8rem] text-slate-400 mt-0.5">Books you have listed for sale or borrow.</p>
                  </div>
                  <button
                    onClick={() => navigate("/sell")}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-4 py-2 text-[0.8rem] font-semibold transition hover:bg-indigo-700"
                  >
                    + List a book
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-6 py-3 font-semibold">#</th>
                        <th className="px-6 py-3 font-semibold">Title</th>
                        <th className="px-6 py-3 font-semibold">Author</th>
                        <th className="px-6 py-3 font-semibold">Category</th>
                        <th className="px-6 py-3 font-semibold">Buy price</th>
                        <th className="px-6 py-3 font-semibold">Borrow price</th>
                        <th className="px-6 py-3 font-semibold">Stock</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBooks.map((book, i) => (
                        <tr key={book.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3.5 text-slate-400">{i + 1}</td>
                          <td className="px-6 py-3.5 font-medium text-slate-900">{book.title}</td>
                          <td className="px-6 py-3.5 text-slate-600">{book.author}</td>
                          <td className="px-6 py-3.5 text-slate-600">{book.category}</td>
                          <td className="px-6 py-3.5 font-medium text-slate-900">{formatCurrency(book.priceBuy)}</td>
                          <td className="px-6 py-3.5 text-slate-700">{formatCurrency(book.priceBorrow)}</td>
                          <td className="px-6 py-3.5 text-slate-700">{book.stock}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(book.status)}`}>
                              {book.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {myBooks.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-slate-400">
                            You haven't listed any books yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------- USERS TAB (admin) -------------------- */}
            {activeTab === "users" && isAdmin && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Registered users</h3>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-6 py-3 font-semibold">#</th>
                        <th className="px-6 py-3 font-semibold">Name</th>
                        <th className="px-6 py-3 font-semibold">Email</th>
                        <th className="px-6 py-3 font-semibold">Phone</th>
                        <th className="px-6 py-3 font-semibold">Joined</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, i) => (
                        <tr key={user.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3.5 text-slate-400">{i + 1}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[0.75rem] font-bold">
                                {(user.name || user.email || "U").charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-900">{user.name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">{user.email}</td>
                          <td className="px-6 py-3.5 text-slate-600">{user.phone || "—"}</td>
                          <td className="px-6 py-3.5 text-slate-500">{user.joined || user.created_at || "—"}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(user.status)}`}>
                              {user.status || "active"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------- BORROW TAB -------------------- */}
            {activeTab === "borrow" &&
              (isAdmin ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-900">Borrow requests</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[0.875rem]">
                        <thead>
                          <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                            <th className="px-6 py-3 font-semibold">User</th>
                            <th className="px-6 py-3 font-semibold">Book</th>
                            <th className="px-6 py-3 font-semibold">Duration</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Actions</th>
                            <th className="px-6 py-3 font-semibold">Requested</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrows.map((req, i) => (
                            <tr key={req.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                              <td className="px-6 py-3.5 text-slate-700">{req.user}</td>
                              <td className="px-6 py-3.5 text-slate-600">{req.book}</td>
                              <td className="px-6 py-3.5 text-slate-600">{req.days} days</td>
                              <td className="px-6 py-3.5">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(req.status)}`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                {req.status === "pending" ? (
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleBorrowRequestAction(req.id, "approved")}
                                      className="rounded-full bg-emerald-50 px-3 py-1 text-[0.75rem] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleBorrowRequestAction(req.id, "declined")}
                                      className="rounded-full bg-rose-50 px-3 py-1 text-[0.75rem] font-semibold text-rose-700 transition hover:bg-rose-100"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[0.75rem] text-slate-400">No action</span>
                                )}
                              </td>
                              <td className="px-6 py-3.5 text-slate-500">{req.requested || req.created_at || "—"}</td>
                            </tr>
                          ))}
                          {borrows.length === 0 && (
                            <tr>
                              <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                No borrow requests.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-fit">
                    <h3 className="font-semibold text-slate-900 mb-4">Request summary</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Pending", value: borrows.filter((b) => b.status === "pending").length, cls: "bg-amber-100 text-amber-700" },
                        { label: "Approved", value: borrows.filter((b) => b.status === "approved").length, cls: "bg-emerald-100 text-emerald-700" },
                        { label: "Returned", value: borrows.filter((b) => b.status === "returned").length, cls: "bg-sky-100 text-sky-700" },
                        { label: "Overdue", value: borrows.filter((b) => b.status === "overdue").length, cls: "bg-red-100 text-red-700" },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <span className={`px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${s.cls}`}>{s.label}</span>
                          <span className="font-bold text-slate-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">My borrow requests</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[0.875rem]">
                      <thead>
                        <tr className="text-[0.75rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                          <th className="px-6 py-3 font-semibold">Book</th>
                          <th className="px-6 py-3 font-semibold">Duration</th>
                          <th className="px-6 py-3 font-semibold">Status</th>
                          <th className="px-6 py-3 font-semibold">Requested</th>
                          <th className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myBorrows.map((req, i) => (
                          <tr key={req.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                            <td className="px-6 py-3.5 font-medium text-slate-900">{req.book_title || req.book || "—"}</td>
                            <td className="px-6 py-3.5 text-slate-600">{req.days} days</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${statusClass(req.status)}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-slate-500">{req.created_at || req.requested || "—"}</td>
                            <td className="px-6 py-3.5">
                              {req.status === "pending" ? (
                                <button
                                  onClick={() => handleCancelMyBorrow(req.id)}
                                  className="rounded-full border border-slate-200 px-3 py-1 text-[0.75rem] font-medium text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                                >
                                  Cancel
                                </button>
                              ) : (
                                <span className="text-[0.75rem] text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {myBorrows.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                              No borrow requests yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate("/borrow")}
                      className="rounded-full bg-indigo-600 text-white px-4 py-2 text-[0.8rem] font-semibold transition hover:bg-indigo-700"
                    >
                      Request to borrow a book
                    </button>
                  </div>
                </div>
              ))}

            {/* -------------------- EXCHANGE TAB -------------------- */}
            {activeTab === "exchange" && <ExchangePanel />}

            {/* -------------------- MESSAGES TAB -------------------- */}
            {activeTab === "messages" && <MessagesPanel />}
          </>
        )}
      </main>
    </div>
  );
};
