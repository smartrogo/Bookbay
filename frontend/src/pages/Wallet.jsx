import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { fetchWallet, fetchWalletTransactions, topUpWallet } from "../services/walletService";

export const Wallet = () => {
  const navigate = useNavigate();
  const { userData, isAuth } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/wallet");
      return;
    }

    const load = async () => {
      if (!userData?.id) return;
      setLoading(true);
      try {
        const w = await fetchWallet(userData.id);
        setWallet(w.wallet || w.data || w);
        const tx = await fetchWalletTransactions(userData.id);
        setTransactions(tx.transactions || tx.data || tx);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuth, navigate, userData]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!userData?.id) return alert("Sign in to top up wallet");
    try {
      await topUpWallet(userData.id, { amount });
      alert("Top-up initiated");
      // reload
      const w = await fetchWallet(userData.id);
      setWallet(w.wallet || w.data || w);
    } catch (err) {
      console.error(err);
      alert("Top-up failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[0.85rem] mb-4 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="mb-4">
            <div>Balance: {wallet?.balance ?? "-"}</div>
            <div>Currency: {wallet?.currency || "NGN"}</div>
          </div>

          <form onSubmit={handleTopUp} className="mb-6">
            <label className="block text-sm">Top-up Amount</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="border px-2 py-1 rounded w-48" />
            <button className="ml-3 bg-blue-600 text-white px-3 py-1 rounded">Top Up</button>
          </form>

          <h3 className="text-lg font-medium mb-2">Transactions</h3>
          <ul className="space-y-2">
            {transactions.length === 0 && <li>No transactions yet.</li>}
            {transactions.map((t) => (
              <li key={t.id} className="border rounded p-2">
                <div>{t.type} — {t.amount}</div>
                <div className="text-sm text-gray-600">{t.status}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wallet;
