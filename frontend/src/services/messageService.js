import { apiClient } from "./api";

export const fetchConversations = async (userId, params = {}) => {
  const response = await apiClient.get(`/chat/conversations/${userId}`, {
    params,
  });
  return response.data;
};

export const fetchMessages = async (conversationId, params = {}) => {
  const response = await apiClient.get(`/chat/${conversationId}/messages`, {
    params,
  });
  return response.data;
};

export const sendMessage = async (conversationId, payload) => {
  const response = await apiClient.post(`/chat/${conversationId}/messages`, payload);
  return response.data;
};

export const createConversation = async (payload) => {
  const response = await apiClient.post(`/chat/conversations`, payload);
  return response.data;
};
