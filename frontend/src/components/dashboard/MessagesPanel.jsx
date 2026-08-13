import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../AuthContext";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
  unwrapConversations,
  unwrapMessages,
  normalizeConversation,
  normalizeMessage,
} from "../../services/messageService";

const MessagesPanel = () => {
  const { userData } = useContext(AuthContext);
  const currentUserId = userData?.id;

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newUserId, setNewUserId] = useState("");

  const threadRef = useRef(null);

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await fetchConversations(currentUserId);
      const list = unwrapConversations(res).map(normalizeConversation);
      setConversations(list);
      setLoading(false);
      if (list.length > 0 && !activeId) {
        setActiveId(list[0].id);
      }
    } catch (err) {
      console.error("Unable to load conversations.", err);
      setLoading(false);
    }
  }, [currentUserId, activeId]);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  useEffect(() => {
    if (!activeId) return;
    (async () => {
      try {
        const res = await fetchMessages(activeId);
        setMessages(unwrapMessages(res).map(normalizeMessage));
      } catch (err) {
        console.error("Unable to load messages.", err);
      }
    })();
  }, [activeId]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const openConversation = (id) => {
    setActiveId(id);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeId || !text.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await sendMessage(activeId, { body: text });
      const sent = normalizeMessage(res?.message || res?.data || { body: text, sender_id: currentUserId });
      setMessages((prev) => [...prev, sent]);
      setText("");
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, last_message: sent.body } : c))
      );
    } catch (err) {
      setError(err?.message || "Failed to send the message.");
    } finally {
      setSending(false);
    }
  };

  const handleNewConversation = async (e) => {
    e.preventDefault();
    setError("");
    const otherId = Number(newUserId);
    if (!otherId || otherId === currentUserId) {
      setError("Enter the user id of the person you want to chat with (not yourself).");
      return;
    }
    try {
      const res = await createConversation({ user_id: otherId });
      const conv = normalizeConversation(res?.conversation || res?.data || res);
      setConversations((prev) => [conv, ...prev.filter((c) => c.id !== conv.id)]);
      setActiveId(conv.id);
      setMessages([]);
      setShowNew(false);
      setNewUserId("");
    } catch (err) {
      setError(err?.message || "Failed to start the conversation.");
    }
  };

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ---------------------- conversations ---------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Conversations</h3>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-600 px-3 py-1 text-[0.75rem] font-semibold transition hover:bg-indigo-100"
          >
            {showNew ? "✕ Close" : "+ New"}
          </button>
        </div>

        {showNew && (
          <form onSubmit={handleNewConversation} className="px-5 py-4 border-b border-slate-100 space-y-2 bg-slate-50">
            <label className="block text-[0.75rem] font-medium text-slate-600">
              Start a chat with user id
            </label>
            <div className="flex gap-2">
              <input
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="e.g. 5"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-[0.8rem] font-semibold transition hover:bg-indigo-700"
              >
                Chat
              </button>
            </div>
            {error && <p className="text-[0.75rem] text-rose-600">{error}</p>}
          </form>
        )}

        <div className="flex-1 overflow-y-auto max-h-[28rem]">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-[0.85rem]">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-slate-500 text-[0.9rem] font-medium">No conversations yet</p>
              <p className="text-slate-400 text-[0.75rem] mt-1">Click “+ New” to start chatting.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => openConversation(c.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                      activeId === c.id ? "bg-indigo-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.9rem] font-bold shrink-0 ${
                        activeId === c.id ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      {(c.user_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800 text-[0.9rem] truncate">{c.user_name}</p>
                        {c.last_message_at && (
                          <span className="text-[0.68rem] text-slate-400 shrink-0">
                            {new Date(c.last_message_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-[0.8rem] text-slate-500 truncate">
                        {c.last_message || "Say hello 👋"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* -------------------------- thread ------------------------- */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[0.85rem] font-bold">
            {(active?.user_name || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{active?.user_name || "Messages"}</h3>
            <p className="text-[0.72rem] text-slate-400 truncate">{active?.user_email || "Select a conversation to start messaging"}</p>
          </div>
        </div>

        <div ref={threadRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-3 max-h-[24rem] bg-slate-50/50">
          {!active ? (
            <div className="py-20 text-center">
              <div className="text-3xl mb-3">👋</div>
              <p className="text-slate-500 text-[0.95rem] font-medium">Pick a conversation</p>
              <p className="text-slate-400 text-[0.8rem] mt-1">or start a new one to get chatting.</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-slate-400 text-[0.85rem] py-16">No messages yet — say hello!</p>
          ) : (
            messages.map((m) => {
              const mine = Number(m.sender_id) === Number(currentUserId);
              return (
                <div key={m.id || `${m.sender_id}-${m.created_at}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[0.875rem] shadow-sm ${
                      mine
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-md"
                    }`}
                  >
                    {!mine && (
                      <p className="text-[0.7rem] font-semibold text-indigo-500 mb-0.5">{m.sender_name || "Other"}</p>
                    )}
                    <p className="leading-relaxed break-words">{m.body}</p>
                    <p className={`text-[0.65rem] mt-1 ${mine ? "text-indigo-200" : "text-slate-400"}`}>
                      {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={active ? "Type a message…" : "Select a conversation first"}
            disabled={!active}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
          />
          <button
            type="submit"
            disabled={!active || sending || !text.trim()}
            className="rounded-full bg-indigo-600 text-white px-5 py-2.5 text-[0.85rem] font-semibold transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? "…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPanel;
