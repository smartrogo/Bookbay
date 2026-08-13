import { apiClient } from "./api";

export const fetchWishlist = async (params = {}) => {
  const response = await apiClient.get("/wishlist", { params });
  return response.data;
};

export const addToWishlist = async (payload) => {
  const response = await apiClient.post("/wishlist", payload);
  return response.data;
};

export const removeFromWishlist = async (wishlistItemId) => {
  const response = await apiClient.delete(`/wishlist/${wishlistItemId}`);
  return response.data;
};
