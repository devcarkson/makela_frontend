// src/utils/auth.ts
export const verifyAuthToken = (): boolean => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return false;
  
  // Simple JWT format validation (without decoding)
  const parts = token.split('.');
  return parts.length === 3; // Valid JWT has 3 parts
};

export const getCurrentToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};