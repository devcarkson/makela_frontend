import apiClient from './client';

export const fetchNotifications = async () => {
  const { data } = await apiClient.get('/products/notifications/');
  return data;
};

export const markNotificationRead = async (id: number) => {
  const { data } = await apiClient.patch(`/products/notifications/${id}/`, { read: true });
  return data;
}; 