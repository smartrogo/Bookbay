import { apiClient } from "./api";

/**
 * Messaging — talks to the backend /chat endpoints. Authenticated via
 * the session cookie; message bodies are sent as `body`.
 */
export const fetchConversations = async (userId, params = {}) => {
  const response = await apiClient.get(`/chat/conversations/${userId}`, { params });
  return response.data;
};

export const fetchMessages = async (conversationId, params = {}) => {
  const response = await apiClient.get(`/chat/${conversationId}/messages`, { params });
  return response.data;
};

export const sendMessage = async (conversationId, payload = {}) => {
  const response = await apiClient.post(`/chat/${conversationId}/messages`, {
    body: payload.body ?? payload.text ?? "",
  });
  return response.data;
};

export const createConversation = async (payload = {}) => {
  const response = await apiClient.post("/chat/conversations", {
    user_id: payload.user_id ?? payload.recipient_id ?? payload.other_user_id,
  });
  return response.data;
};

/** Normalize the backend conversation shape for the UI. */
export const normalizeConversation = (item = {}) => ({
  id: item.id,
  user_id: item.user_id,
  user_name: item.user_name || item.userName || item.title || `User #${item.user_id || "?"}`,
  user_email: item.user_email || "",
  last_message: item.last_message || item.lastMessagePreview || item.last_message_at || "",
  last_message_at: item.last_message_at,
});

/** Normalize a backend message for the UI. */
export const normalizeMessage = (item = {}) => ({
  id: item.id,
  conversation_id: item.conversation_id,
  sender_id: item.sender_id,
  sender_name: item.sender_name || "",
  body: item.body || item.text || "",
  is_read: Boolean(item.is_read),
  created_at: item.created_at,
});

export const unwrapConversations = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.conversations)) return payload.conversations;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const unwrapMessages = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};
