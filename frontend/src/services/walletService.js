import { apiClient } from "./api";

export const fetchWallet = async (userId) => {
  const response = await apiClient.get(`/wallet/${userId}`);
  return response.data;
};

export const fetchWalletTransactions = async (userId, params = {}) => {
  const response = await apiClient.get(`/wallet/${userId}/transactions`, {
    params,
  });
  return response.data;
};

export const topUpWallet = async (userId, payload) => {
  const response = await apiClient.post(`/wallet/${userId}/topup`, payload);
  return response.data;
};

export const transferWallet = async (userId, payload) => {
  const response = await apiClient.post(`/wallet/${userId}/transfer`, payload);
  return response.data;
};
