import apiClient from './client';

export const fetchCart = async () => {
  const { data } = await apiClient.get('/orders/cart/');
  return data;
};

export const addCartItem = async (productId: string | number, quantity: number) => {
  const response = await apiClient.post('/orders/cart/items/', { product_id: Number(productId), quantity });
  return response;
};

export const updateCartItem = async (itemId: string, quantity: number, productId: number) => {
  return apiClient.put(`/orders/cart/items/${itemId}/`, { quantity, product_id: productId });
};

export const removeCartItem = async (itemId: string) => {
  return apiClient.delete(`/orders/cart/items/${itemId}/`);
};

export const clearCart = async () => {
  return apiClient.post('/orders/cart/clear/');
}; 