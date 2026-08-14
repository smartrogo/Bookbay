import { apiClient } from "./api";

/**
 * AI Assistant service — conversations, chat, summarize, suggest.
 * Falls back to demo data when the backend is unavailable.
 */

// ── Conversations ───────────────────────────────────────────────

export const fetchAiConversations = async () => {
  try {
    const response = await apiClient.get("/ai/conversations");
    const data = response.data;
    return data?.conversations || [];
  } catch (error) {
    console.warn("AI conversations endpoint unavailable.", error);
    return [];
  }
};

export const createAiConversation = async (title = "New Chat") => {
  try {
    const response = await apiClient.post("/ai/conversations", { title });
    return response.data;
  } catch (error) {
    console.warn("Failed to create AI conversation.", error);
    return { conversation_id: Date.now(), title };
  }
};

// ── Messages ────────────────────────────────────────────────────

export const fetchAiMessages = async (conversationId, limit = 50) => {
  try {
    const response = await apiClient.get(
      `/ai/conversations/${conversationId}/messages`,
      { params: { limit } }
    );
    return response.data?.messages || [];
  } catch (error) {
    console.warn("AI messages endpoint unavailable.", error);
    return [];
  }
};

export const sendAiMessage = async (conversationId, message) => {
  try {
    const response = await apiClient.post(
      `/ai/conversations/${conversationId}/messages`,
      { message }
    );
    return response.data;
  } catch (error) {
    console.warn("Failed to send AI message.", error);
    return {
      reply:
        "I'm sorry, the AI assistant is currently unavailable. Please try again later.",
      tokens_used: 0,
    };
  }
};

export const deleteAiConversation = async (conversationId) => {
  try {
    const response = await apiClient.delete(
      `/ai/conversations/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.warn("Failed to delete AI conversation.", error);
    return { success: true };
  }
};

// ── Book Summary ────────────────────────────────────────────────

export const summarizeBook = async (bookId) => {
  try {
    const response = await apiClient.post("/ai/summarize", { book_id: bookId });
    return response.data?.summary || "No summary available.";
  } catch (error) {
    console.warn("AI summarize endpoint unavailable.", error);
    return "Summary not available at this time.";
  }
};

// ── Book Suggestions ────────────────────────────────────────────

export const suggestBooks = async (query) => {
  try {
    const response = await apiClient.post("/ai/suggest", { query });
    return response.data?.suggestions || [];
  } catch (error) {
    console.warn("AI suggest endpoint unavailable.", error);
    return [];
  }
};
