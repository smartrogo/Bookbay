import { apiClient } from "./api";

export const createExchangeRequest = async (payload) => {
  const response = await apiClient.post(`/exchange`, payload);
  return response.data;
};

export const fetchExchangeRequests = async (params = {}) => {
  const response = await apiClient.get(`/exchange`, { params });
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
