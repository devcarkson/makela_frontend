import apiClient from './client';

export const fetchWishlist = async () => {
  const { data } = await apiClient.get('/products/wishlist/');
  return data;
};

export const addToWishlist = async (product_id: number) => {
  const { data } = await apiClient.post('/products/wishlist/', { product_id });
  return data;
};

export const removeFromWishlist = async (id: number) => {
  const { data } = await apiClient.delete(`/products/wishlist/${id}/`);
  return data;
}; 