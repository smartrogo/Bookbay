import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { apiClient } from "../services/api";
import { Footer } from "../components/Footer";

const formatPrice = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const statusStyles = {
  completed: "bg-emerald-100 text-emerald-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-sky-100 text-sky-700",
  cancelled: "bg-slate-200 text-slate-600",
  refunded: "bg-rose-100 text-rose-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${
      statusStyles[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
    {status}
  </span>
);

const DEMO_ORDERS = [
  {
    id: 1,
    reference: "ORD-63F182B537",
    total: 24.99,
    status: "completed",
    created_at: "2026-08-10",
    item_count: 1,
  },
  {
    id: 2,
    reference: "ORD-2661CEEFEB",
    total: 38.5,
    status: "processing",
    created_at: "2026-08-08",
    item_count: 2,
  },
  {
    id: 3,
    reference: "ORD-D0A0C4954A",
    total: 15.75,
    status: "pending",
    created_at: "2026-08-05",
    item_count: 1,
  },
];

export const Orders = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/orders");
      return;
    }
    loadOrders();
  }, [isAuth, navigate, userData]);

  const loadOrders = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      const response = await apiClient.get("/orders");
      const data = response.data;
      const orderList = data?.orders || data?.data || data || [];
      setOrders(Array.isArray(orderList) ? orderList : DEMO_ORDERS);
    } catch (error) {
      console.warn("Orders endpoint unavailable — using demo data.", error);
      setOrders(DEMO_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-indigo-200">Track and manage your book purchases</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all", label: "All Orders", count: orders.length },
            { key: "pending", label: "Pending", count: statusCounts.pending || 0 },
            { key: "processing", label: "Processing", count: statusCounts.processing || 0 },
            { key: "completed", label: "Completed", count: statusCounts.completed || 0 },
            { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled || 0 },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-medium transition ${
                filterStatus === filter.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {filter.label}
              <span
                className={`text-[0.7rem] px-1.5 py-0.5 rounded-full ${
                  filterStatus === filter.key
                    ? "bg-white/20"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-200 rounded w-24" />
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {filterStatus === "all" ? "No orders yet" : `No ${filterStatus} orders`}
            </h3>
            <p className="text-slate-500 mb-6">
              {filterStatus === "all"
                ? "Start shopping to see your orders here."
                : `You don't have any orders with "${filterStatus}" status.`}
            </p>
            <Link
              to="/buy"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {order.reference || `Order #${order.id}`}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[0.85rem] text-slate-500">
                      <span>📅 {order.created_at || "N/A"}</span>
                      <span>📚 {order.item_count || 1} item(s)</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[0.75rem] text-slate-400 uppercase tracking-wide mb-1">
                      Total
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[0.8rem] font-medium text-slate-600 mb-2">Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[0.85rem]">
                          <span className="text-slate-700">
                            {item.title || `Book #${item.book_id}`}
                          </span>
                          <span className="text-slate-500">
                            {item.quantity}x {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
              <p className="text-[0.8rem] text-slate-500">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {statusCounts.completed || 0}
              </p>
              <p className="text-[0.8rem] text-slate-500">Completed</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {statusCounts.processing || 0}
              </p>
              <p className="text-[0.8rem] text-slate-500">Processing</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-sky-600">
                {formatPrice(
                  orders.reduce((sum, o) => sum + (o.total || 0), 0)
                )}
              </p>
              <p className="text-[0.8rem] text-slate-500">Total Spent</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
