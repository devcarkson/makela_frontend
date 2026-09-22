import apiClient from './client';

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth?: string | null;
  avatarUrl?: string;
}

export async function fetchProfile(): Promise<UserProfile> {
  const response = await apiClient.get('/auth/profile/');
  return response.data;
}

export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const response = await apiClient.put('/auth/profile/', profile);
  return response.data;
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await apiClient.post('/auth/profile/avatar/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function fetchAccountStats(): Promise<{
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  memberSince: string;
}> {
  const response = await apiClient.get('/auth/profile/stats/');
  return response.data;
}
