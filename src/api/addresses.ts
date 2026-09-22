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
  zipCode?: string;
  phone: string;
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await apiClient.get('/auth/addresses/');
  return response.data;
}

export async function addAddress(address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> {
  // Convert camelCase to snake_case for backend
  const payload = {
    type: address.type,
    first_name: address.firstName,
    last_name: address.lastName,
    street: address.street,
    city: address.city,
    state: address.state,
    zip_code: address.zipCode,
    phone: address.phone,
  };
  const response = await apiClient.post('/auth/addresses/', payload);
  return response.data;
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
  const payload: any = {};
  if (address.type !== undefined) payload.type = address.type;
  if (address.firstName !== undefined) payload.first_name = address.firstName;
  if (address.lastName !== undefined) payload.last_name = address.lastName;
  if (address.street !== undefined) payload.street = address.street;
  if (address.city !== undefined) payload.city = address.city;
  if (address.state !== undefined) payload.state = address.state;
  if (address.zipCode !== undefined) payload.zip_code = address.zipCode;
  if (address.phone !== undefined) payload.phone = address.phone;
  const response = await apiClient.put(`/auth/addresses/${id}/`, payload);
  return response.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/auth/addresses/${id}/`);
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const response = await apiClient.post(`/auth/addresses/${id}/set_default/`);
  return response.data;
}
