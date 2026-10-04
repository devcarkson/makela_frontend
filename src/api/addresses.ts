import apiClient from './client';

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  zipCode?: string;
  phone: string;
}

// Addresses keep one international number, e.g. "+44 7700 900123".
export function splitPhone(phone?: string): { code: string; number: string } {
  const raw = (phone ?? '').trim();
  const match = raw.match(/^\+(\d{1,3})\s*(.*)$/);
  if (!match) return { code: '+44', number: raw };
  return { code: `+${match[1]}`, number: match[2] };
}

export function joinPhone(code: string, number: string): string {
  const digits = number.trim().replace(/[^\d]/g, '');
  return digits ? `${code} ${digits}` : '';
}

interface AddressPayload {
  id: number | string;
  type?: Address['type'];
  is_default?: boolean;
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
}

// The API speaks snake_case; the UI works in camelCase.
function fromApi(data: AddressPayload): Address {
  return {
    id: String(data.id),
    type: data.type ?? 'home',
    isDefault: Boolean(data.is_default),
    firstName: data.first_name ?? '',
    lastName: data.last_name ?? '',
    street: data.street ?? '',
    city: data.city ?? '',
    state: data.state ?? '',
    country: data.country,
    zipCode: data.zip_code ?? '',
    phone: data.phone ?? '',
  };
}

function toApi(address: Partial<Address>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (address.type !== undefined) payload.type = address.type;
  if (address.firstName !== undefined) payload.first_name = address.firstName;
  if (address.lastName !== undefined) payload.last_name = address.lastName;
  if (address.street !== undefined) payload.street = address.street;
  if (address.city !== undefined) payload.city = address.city;
  if (address.state !== undefined) payload.state = address.state;
  if (address.country !== undefined) payload.country = address.country;
  if (address.zipCode !== undefined) payload.zip_code = address.zipCode;
  if (address.phone !== undefined) payload.phone = address.phone;
  if (address.isDefault !== undefined) payload.is_default = address.isDefault;
  return payload;
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await apiClient.get('/auth/addresses/');
  const data = response.data;
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map(fromApi);
}

export async function addAddress(address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> {
  const response = await apiClient.post('/auth/addresses/', toApi(address));
  return fromApi(response.data);
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
  const response = await apiClient.patch(`/auth/addresses/${id}/`, toApi(address));
  return fromApi(response.data);
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/auth/addresses/${id}/`);
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const response = await apiClient.patch(`/auth/addresses/${id}/`, { is_default: true });
  return fromApi(response.data);
}