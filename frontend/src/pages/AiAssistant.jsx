import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { Footer } from "../components/Footer";
import {
  fetchAiConversations,
  createAiConversation,
  fetchAiMessages,
  sendAiMessage,
  deleteAiConversation,
  suggestBooks,
} from "../services/aiService";

const DEMO_SUGGESTIONS = [
  "Recommend me a fiction book",
  "What are good programming books?",
  "Tell me about Things Fall Apart",
  "Best books for self-improvement?",
];

export const AiAssistant = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/ai");
      return;
    }
    loadConversations();
  }, [isAuth, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const convs = await fetchAiConversations();
      setConversations(Array.isArray(convs) ? convs : []);
    } catch (error) {
      console.warn("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const result = await createAiConversation("New Chat");
      const newConv = {
        id: result.conversation_id,
        title: result.title || "New Chat",
        message_count: 0,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv);
      setMessages([]);
      setSuggestions(DEMO_SUGGESTIONS);
    } catch (error) {
      showToast("Failed to create conversation", { type: "error" });
    }
  };

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv);
    setSuggestions([]);
    try {
      const msgs = await fetchAiMessages(conv.id);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (error) {
      console.warn("Failed to load messages:", error);
    }
  };

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || !activeConversation) return;

    setInput("");
    setSuggestions([]);

    // Add user message immediately
    const userMsg = { id: Date.now(), role: "user", content: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    setSending(true);
    try {
      const result = await sendAiMessage(activeConversation.id, text);
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: result.reply || "I couldn't generate a response.",
        tokens_used: result.tokens_used || 0,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Update conversation title if first message
      if (messages.length === 0) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id ? { ...c, title: text.slice(0, 80), message_count: (c.message_count || 0) + 2 } : c
          )
        );
      }
    } catch (error) {
      showToast("Failed to get AI response", { type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await deleteAiConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversation?.id === convId) {
        setActiveConversation(null);
        setMessages([]);
        setSuggestions(DEMO_SUGGESTIONS);
      }
    } catch (error) {
      showToast("Failed to delete conversation", { type: "error" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-3xl font-bold text-white">BookBay AI</h1>
          </div>
          <p className="text-indigo-200">Your personal book assistant — ask anything about books and reading</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-white border-r border-slate-200 overflow-hidden flex-shrink-0`}>
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={handleNewConversation}
              className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-[0.85rem] font-semibold hover:bg-indigo-700 transition"
            >
              + New Chat
            </button>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 350px)" }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center gap-2 px-4 py-3 border-b border-slate-100 cursor-pointer transition ${
                  activeConversation?.id === conv.id ? "bg-indigo-50 border-l-2 border-l-indigo-600" : "hover:bg-slate-50"
                }`}
                onClick={() => handleSelectConversation(conv)}
              >
                <span className="text-sm">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-medium text-slate-900 truncate">{conv.title || "New Chat"}</p>
                  <p className="text-[0.7rem] text-slate-400">{conv.message_count || 0} messages</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="text-slate-400 hover:text-red-500 transition text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
            {conversations.length === 0 && !loading && (
              <p className="text-center text-slate-400 text-[0.8rem] py-8">No conversations yet</p>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 left-4 z-10 bg-indigo-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          >
            {sidebarOpen ? "✕" : "💬"}
          </button>

          {activeConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && suggestions.length > 0 && (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🤖</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">How can I help you today?</h3>
                    <p className="text-[0.85rem] text-slate-500 mb-6">Ask me about books, get recommendations, or search our catalog</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(s)}
                          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-[0.8rem] hover:border-indigo-300 hover:text-indigo-600 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-900 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <div className="text-[0.9rem] whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-[0.8rem]">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-end gap-3 max-w-3xl mx-auto">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about books, get recommendations..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ maxHeight: "120px" }}
                    disabled={sending}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || sending}
                    className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to BookBay AI</h2>
              <p className="text-slate-500 mb-8 text-center max-w-md">
                Start a new conversation or select an existing one to chat about books,
                get recommendations, and explore our catalog.
              </p>
              <button
                onClick={handleNewConversation}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Start a New Chat
              </button>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {[
                  { icon: "📚", title: "Book Search", desc: "Find books by title, author, or topic" },
                  { icon: "🎯", title: "Recommendations", desc: "Get personalized book suggestions" },
                  { icon: "📖", title: "Summaries", desc: "Quick summaries of any book" },
                  { icon: "💡", title: "Reading Tips", desc: "Expert advice on what to read next" },
                ].map((feature) => (
                  <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-4 text-left">
                    <span className="text-2xl">{feature.icon}</span>
                    <p className="font-semibold text-slate-900 mt-2">{feature.title}</p>
                    <p className="text-[0.8rem] text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
