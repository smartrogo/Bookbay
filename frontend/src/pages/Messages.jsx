import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { fetchConversations, fetchMessages, sendMessage, createConversation } from "../services/messageService";
import { useSocket } from "../hooks/useSocket";

export const Messages = () => {
  const navigate = useNavigate();
  const { userData, isAuth } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/messages");
      return;
    }

    const load = async () => {
      if (!userData?.id) return;
      try {
        const res = await fetchConversations(userData.id);
        setConversations(res.conversations || res.data || res);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [isAuth, navigate, userData]);

  // optional websocket for real-time updates
  const { wsRef } = useSocket();

  useEffect(() => {
    const socket = wsRef.current;
    if (!socket) return;

    const handleMessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "message") {
          if (activeConv && data.conversationId === activeConv.id) {
            setMessages((p) => [...p, data.message]);
          }
          // Update conversation preview
          setConversations((prev) =>
            prev.map((c) => (c.id === data.conversationId ? { ...c, lastMessagePreview: data.message.text } : c))
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [wsRef, activeConv]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const res = await fetchMessages(conv.id);
      setMessages(res.messages || res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeConv) return alert("Select a conversation");
    try {
      const res = await sendMessage(activeConv.id, { text });
      setMessages((p) => [...p, res.message || res.data || res]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  const handleNewConv = async () => {
    const otherUserId = prompt("Enter user id to start conversation with:");
    if (!otherUserId) return;
    try {
      const res = await createConversation({ participants: [userData.id, otherUserId] });
      const conv = res.conversation || res.data || res;
      setConversations((p)=>[conv, ...p]);
    } catch (err) {
      console.error(err);
      alert("Failed to create conversation");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="flex gap-4">
        <div className="w-1/3 border rounded p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Conversations</div>
            <button onClick={handleNewConv} className="text-sm text-blue-600">New</button>
          </div>
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li key={c.id} className="cursor-pointer" onClick={()=>openConversation(c)}>
                <div className="font-semibold">{c.title || c.id}</div>
                <div className="text-sm text-gray-600">{c.lastMessagePreview}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 border rounded p-2">
          {activeConv ? (
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-auto mb-2">
                {messages.map((m) => (
                  <div key={m.id} className="mb-2">
                    <div className="text-sm text-gray-700">{m.senderId === userData.id ? "You" : m.senderName}</div>
                    <div className="">{m.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 border rounded px-2 py-1" />
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
              </form>
            </div>
          ) : (
            <div>Select a conversation to view messages.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
