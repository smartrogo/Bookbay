import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  createExchangeRequest,
  fetchExchangeRequests,
} from "../services/exchangeService";

export const Exchange = () => {
  const navigate = useNavigate();
  const { userData, isAuth } = useContext(AuthContext);
  const [offerBookId, setOfferBookId] = useState("");
  const [requestBookId, setRequestBookId] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/exchange");
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchExchangeRequests({ userId: userData?.id });
        setRequests(res.requests || res.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuth, navigate, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.id) return alert("Please sign in to create an exchange.");
    try {
      const payload = {
        userId: userData.id,
        offerBookId,
        requestBookId,
        message,
      };
      const res = await createExchangeRequest(payload);
      setRequests((p) => [res.request || res.data || res, ...p]);
      setOfferBookId("");
      setRequestBookId("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to create exchange request.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Exchange Books</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm">Your Book ID (offer)</label>
          <input
            value={offerBookId}
            onChange={(e) => setOfferBookId(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Requested Book ID</label>
          <input
            value={requestBookId}
            onChange={(e) => setRequestBookId(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Propose Exchange</button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl font-medium mb-2">Your Exchange Requests</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {requests.length === 0 && <li>No exchange requests yet.</li>}
          {requests.map((r) => (
            <li key={r.id} className="border rounded p-2">
              <div className="font-semibold">Offer: {r.offerBookId}</div>
              <div>Requested: {r.requestBookId}</div>
              <div>Status: {r.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Exchange;
