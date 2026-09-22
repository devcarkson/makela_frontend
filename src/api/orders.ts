import apiClient from './client';

export const fetchOrders = async () => {
  const { data } = await apiClient.get('/orders/orders/');
  return data;
};

export const fetchOrderDetail = async (id: string) => {
  const { data } = await apiClient.get(`/orders/orders/${id}/`);
  return data;
}; 