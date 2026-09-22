import apiClient from './client';

export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  twoFactorAuth: boolean;
  language: string;
  currency: string;
  theme: string;
}

export async function fetchSettings(): Promise<UserSettings> {
  const response = await apiClient.get('/auth/settings/');
  return response.data;
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const response = await apiClient.put('/auth/settings/', settings);
  return response.data;
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/auth/settings/delete_account/');
}
