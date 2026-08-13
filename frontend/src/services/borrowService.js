import { apiClient } from "./api";

export const createBorrowRequest = async (payload) => {
  const response = await apiClient.post(`/borrow`, payload);
  return response.data;
};

export const fetchBorrowRequests = async (params = {}) => {
  const response = await apiClient.get(`/borrow`, { params });
  return response.data;
};

export const fetchBorrowRequestById = async (id) => {
  const response = await apiClient.get(`/borrow/${id}`);
  return response.data;
};

export const updateBorrowRequest = async (id, payload) => {
  const response = await apiClient.put(`/borrow/${id}`, payload);
  return response.data;
};

export const cancelBorrowRequest = async (id) => {
  const response = await apiClient.delete(`/borrow/${id}`);
  return response.data;
};
