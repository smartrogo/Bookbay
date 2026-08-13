import React, { useCallback, useEffect, useState } from "react";
import {
  createExchangeRequest,
  fetchExchangeRequests,
  cancelExchangeRequest,
  unwrapExchangeRequests,
  normalizeExchange,
} from "../../services/exchangeService";
import { fetchAllBooks } from "../../services/bookService";

const EXCHANGE_STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
  cancelled: "bg-slate-200 text-slate-600",
};

const statusClass = (status) => EXCHANGE_STATUS_STYLES[status] || "bg-slate-100 text-slate-600";

const ExchangePanel = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [offerBookId, setOfferBookId] = useState("");
  const [wantedBookId, setWantedBookId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetchExchangeRequests();
      setRequests(unwrapExchangeRequests(res).map(normalizeExchange));
    } catch (err) {
      console.error("Unable to load exchange requests.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchAllBooks();
        if (mounted) setBooks(res.books || []);
      } catch (err) {
        console.error("Unable to load books for exchange.", err);
      }
    })();
    loadRequests();
    return () => {
      mounted = false;
    };
  }, [loadRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!offerBookId || !wantedBookId) {
      setError("Please choose both the book you offer and the book you want.");
      return;
    }
    if (offerBookId === wantedBookId) {
      setError("The offered and requested books must be different.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createExchangeRequest({
        offered_book_id: offerBookId,
        wanted_book_id: wantedBookId,
        message,
      });
      const created = normalizeExchange(res?.exchange_request || res?.data || res);
      setRequests((prev) => [created, ...prev]);
      setOfferBookId("");
      setWantedBookId("");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Failed to create the exchange request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelExchangeRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err?.message || "Failed to cancel the request.");
    }
  };

  const bookOptions = books.filter((b) => b.status === "active");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ------------------------- propose ------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-fit">
        <h3 className="font-semibold text-slate-900">Propose an exchange</h3>
        <p className="text-[0.8rem] text-slate-400 mt-1">
          Offer one of your books in exchange for a title you want.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[0.8rem] font-medium text-slate-600 mb-1.5">
              Book you offer
            </label>
            <select
              value={offerBookId}
              onChange={(e) => setOfferBookId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a book…</option>
              {bookOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.8rem] font-medium text-slate-600 mb-1.5">
              Book you want
            </label>
            <select
              value={wantedBookId}
              onChange={(e) => setWantedBookId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a book…</option>
              {bookOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.8rem] font-medium text-slate-600 mb-1.5">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="A short note to the other party…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 text-[0.8rem] text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 text-white text-[0.85rem] font-semibold py-2.5 shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Proposing…" : "Propose exchange"}
          </button>
        </form>
      </div>

      {/* -------------------------- list -------------------------- */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Your exchange requests</h3>
          <span className="text-[0.75rem] font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
            {requests.length} total
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-[0.9rem]">Loading requests…</div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-3xl mb-3">🔄</div>
            <p className="text-slate-500 text-[0.95rem] font-medium">No exchange requests yet</p>
            <p className="text-slate-400 text-[0.8rem] mt-1">
              Propose a trade on the left and it will show up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((r) => (
              <li key={r.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">{r.offered_book_title}</span>
                    <span className="text-slate-400 text-[0.85rem]">⇄</span>
                    <span className="font-semibold text-slate-900 truncate">{r.wanted_book_title}</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium ${statusClass(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.message && (
                    <p className="text-[0.8rem] text-slate-500 mt-1 truncate">“{r.message}”</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[0.72rem] text-slate-400">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}
                  </span>
                  {(r.status === "pending" || r.status === "declined") && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[0.75rem] font-medium text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExchangePanel;
