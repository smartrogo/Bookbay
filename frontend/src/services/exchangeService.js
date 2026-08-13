import { apiClient } from "./api";

/**
 * Exchange requests — talks to the backend /exchange endpoints.
 * The backend is authenticated via the session cookie, so no user id is
 * sent; requests carry the offered/wanted book ids.
 */
export const createExchangeRequest = async (payload = {}) => {
  const response = await apiClient.post("/exchange", {
    offered_book_id: payload.offered_book_id ?? payload.offerBookId,
    wanted_book_id: payload.wanted_book_id ?? payload.requestBookId,
    message: payload.message || "",
  });
  return response.data;
};

export const fetchExchangeRequests = async (params = {}) => {
  const response = await apiClient.get("/exchange", { params });
  return response.data;
};

export const fetchExchangeById = async (id) => {
  const response = await apiClient.get(`/exchange/${id}`);
  return response.data;
};

export const updateExchangeRequest = async (id, payload) => {
  const response = await apiClient.put(`/exchange/${id}`, payload);
  return response.data;
};

export const cancelExchangeRequest = async (id) => {
  const response = await apiClient.delete(`/exchange/${id}`);
  return response.data;
};

/** Normalize the backend exchange request shape for the UI. */
export const normalizeExchange = (item = {}) => ({
  id: item.id,
  offered_book_id: item.offered_book_id ?? item.offeredBookId,
  wanted_book_id: item.wanted_book_id ?? item.requestBookId,
  offered_book_title: item.offered_book_title || item.offeredBookTitle || "Book",
  wanted_book_title: item.wanted_book_title || item.requestBookTitle || "Book",
  message: item.message || "",
  status: item.status || "pending",
  created_at: item.created_at,
});

/** Unwrap any of the response shapes the backend or fallbacks may return. */
export const unwrapExchangeRequests = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.exchange_requests)) return payload.exchange_requests;
  if (Array.isArray(payload?.requests)) return payload.requests;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};
