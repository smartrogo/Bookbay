import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { createBorrowRequest, fetchBorrowRequests } from "../services/borrowService";
import { Button } from "../components/Button";
import { LoadingBtn } from "../components/LoadingBtn";
import { Footer } from "../components/Footer";

export const Borrow = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [offerBookId, setOfferBookId] = useState("");
  const [requestBookId, setRequestBookId] = useState("");
  const [durationDays, setDurationDays] = useState(14);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/borrow");
      return;
    }

    const loadBorrowRequests = async () => {
      setLoading(true);
      try {
        const res = await fetchBorrowRequests({ userId: userData?.id });
        setRequests(res.requests || res.data || res || []);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Unable to load borrow requests.");
      } finally {
        setLoading(false);
      }
    };

    loadBorrowRequests();
  }, [isAuth, navigate, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.id) {
      navigate("/sign-in?next=/borrow");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        userId: userData.id,
        offerBookId,
        requestBookId,
        durationDays,
        message,
      };
      const res = await createBorrowRequest(payload);
      const newRequest = res.request || res.data || res;
      setRequests((prev) => [newRequest, ...prev]);
      setOfferBookId("");
      setRequestBookId("");
      setDurationDays(14);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to submit borrow request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[0.85rem] mb-4 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Borrow Books</h2>
      <p className="text-sm text-gray-600 mb-6">
        Request to borrow a book from another Bookbay user. We'll keep track of your requests and statuses here.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <section className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-4">New Borrow Request</h3>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Book ID (offer)</label>
              <input
                value={offerBookId}
                onChange={(e) => setOfferBookId(e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
                placeholder="Book ID you are offering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requested Book ID</label>
              <input
                value={requestBookId}
                onChange={(e) => setRequestBookId(e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
                placeholder="Book ID you want to borrow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Borrow Duration (days)</label>
              <input
                type="number"
                min={1}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded border px-3 py-2"
                rows={4}
                placeholder="Optional note for the owner"
              />
            </div>
            <div>
              {submitting ? (
                <LoadingBtn loading={submitting} value="Submitting..." cls_name="w-full bg-blue-600 text-white" />
              ) : (
                <Button value="Submit Request" cls_name="w-full bg-blue-600 text-white" type="submit" />
              )}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-4">Your Borrow Requests</h3>
          {loading ? (
            <div>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-sm text-gray-600">No borrow requests found yet.</div>
          ) : (
            <ul className="space-y-3">
              {requests.map((request) => (
                <li key={request.id || request._id || `${request.offerBookId}-${request.requestBookId}`} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div>
                      <p className="font-semibold">Offer Book: {request.offerBookId}</p>
                      <p className="text-sm text-gray-600">Requested: {request.requestBookId}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800">
                      {request.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Duration: {request.durationDays || request.days || 14} days</p>
                  {request.message && <p className="text-sm text-gray-600 mt-2">Note: {request.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};
