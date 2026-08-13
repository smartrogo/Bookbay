import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://bookbayapp.onrender.com/api/v1";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || error)
);
