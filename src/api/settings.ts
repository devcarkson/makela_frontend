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

interface UserSettingsPayload {
  email_notifications?: boolean;
  sms_notifications?: boolean;
  order_updates?: boolean;
  promotional_emails?: boolean;
  two_factor_auth?: boolean;
  language?: string;
  currency?: string;
  theme?: string;
}

// The API speaks snake_case; the UI works in camelCase.
const TO_API: Record<keyof UserSettings, string> = {
  emailNotifications: 'email_notifications',
  smsNotifications: 'sms_notifications',
  orderUpdates: 'order_updates',
  promotionalEmails: 'promotional_emails',
  twoFactorAuth: 'two_factor_auth',
  language: 'language',
  currency: 'currency',
  theme: 'theme',
};

function fromApi(data: UserSettingsPayload): UserSettings {
  return {
    emailNotifications: Boolean(data?.email_notifications),
    smsNotifications: Boolean(data?.sms_notifications),
    orderUpdates: Boolean(data?.order_updates),
    promotionalEmails: Boolean(data?.promotional_emails),
    twoFactorAuth: Boolean(data?.two_factor_auth),
    language: data?.language ?? 'en',
    currency: data?.currency ?? 'GBP',
    theme: data?.theme ?? 'light',
  };
}

export async function fetchSettings(): Promise<UserSettings> {
  const response = await apiClient.get('/auth/settings/');
  return fromApi(response.data);
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const payload: Record<string, unknown> = {};
  (Object.keys(settings) as (keyof UserSettings)[]).forEach(key => {
    const value = settings[key];
    if (value !== undefined) payload[TO_API[key]] = value;
  });
  const response = await apiClient.patch('/auth/settings/', payload);
  return fromApi(response.data);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/auth/settings/delete_account/');
}