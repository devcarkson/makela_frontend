import apiClient from './client';

export const fetchCart = async () => {
  console.log('fetchCart called');
  try {
    const { data } = await apiClient.get('/orders/cart/');
    console.log('fetchCart response:', data);
    return data;
  } catch (error) {
    console.error('fetchCart error:', error);
    throw error;
  }
};

export const addCartItem = async (productId: string | number, quantity: number) => {
  console.log('addCartItem called with:', { productId, quantity });
  try {
    const response = await apiClient.post('/orders/cart/items/', { product_id: Number(productId), quantity });
    console.log('addCartItem response:', response);
    return response;
  } catch (error: any) {
    console.error('addCartItem error:', error);
    console.error('addCartItem error response:', error.response?.data);
    console.error('addCartItem error status:', error.response?.status);
    throw error;
  }
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