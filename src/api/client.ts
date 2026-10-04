// src/api/apiClient.ts
import axios from 'axios';

const PUBLIC_ENDPOINTS = [
  '/auth/login/', 
  '/auth/register/', 
  '/auth/token/refresh/',
  '/auth/contact/',
  '/products', 
  '/home', 
  '/categories', 
  '/contact'
];

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  withCredentials: true, // Essential for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Skip modification for external URLs
    if (config.url?.startsWith('http') && !config.url?.includes(import.meta.env.VITE_API_BASE_URL)) {
      return config;
    }

    // Send Cache-Control: no-cache to bypass server-side cache middleware
    config.headers['Cache-Control'] = 'no-cache';

    // Get tokens from storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.startsWith(endpoint) || 
      config.url?.includes(`?next=${endpoint}`)
    );

    // Add Authorization header for non-public endpoints when token exists
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure CSRF token is included for session-based endpoints
    if (!isPublicEndpoint && !config.url?.startsWith('/auth/token/')) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ROTATE_REFRESH_TOKENS is on, so a refresh token is single use: the first
// call blacklists it and returns a new one. Without sharing the in-flight
// promise, two parallel 401s both send the same token and the loser gets
// "Token is blacklisted" - which used to log the user out.
let refreshInFlight: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem('refresh') || sessionStorage.getItem('refresh');
    if (!refreshToken) throw new Error('No refresh token available');

    // Bare axios so this cannot re-enter the response interceptor.
    const { data } = await axios.post(
      `${apiClient.defaults.baseURL}/auth/token/refresh/`,
      { refresh: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const storage = localStorage.getItem('refresh') ? localStorage : sessionStorage;
    storage.setItem('token', data.access);
    // Rotation returns a new refresh token; keep using the newest one.
    if (data.refresh) storage.setItem('refresh', data.refresh);
    return data.access as string;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 404 errors - don't trigger logout for missing endpoints
    if (error.response?.status === 404) {
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (originalRequest.url?.includes('/auth/token/refresh/')) {
        // The refresh call itself was rejected: the session is unrecoverable.
        expireSession(originalRequest.url, true);
        return Promise.reject(error);
      }

      // Another request may already have rotated the token while this 401 was
      // in flight - if so, retry with the stored token instead of refreshing
      // again (the previous refresh token is blacklisted by then).
      const sentToken = String(originalRequest.headers?.Authorization ?? '').replace(/^Bearer\s+/i, '');
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (sentToken && storedToken && storedToken !== sentToken) {
        originalRequest.headers.Authorization = `Bearer ${storedToken}`;
        return apiClient(originalRequest);
      }

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refreshing failed: clear auth data
        expireSession(originalRequest.url, true);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Only tear down the session for endpoints that genuinely gate the account.
// Optional widgets (orders, wishlist, addresses, settings, notifications)
// must not sign the user out - they surface an inline error instead.
// force = true means the failure is fatal regardless of the endpoint.
function expireSession(url?: string, force = false) {
  if (!force && url && !isCriticalEndpoint(url)) {
    return;
  }
  clearAuthStorage();
  // Only redirect if we're not on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session_expired=1';
  }
}

// Helper functions
function clearAuthStorage() {
  ['token', 'refresh', 'userId', 'email'].forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

function isCriticalEndpoint(url?: string): boolean {
  if (!url) return true;

  // Requests that must never sign the user out: the auth entry points plus the
  // optional account widgets, which report failures inline on their own page.
  const nonCriticalEndpoints = [
    '/auth/login/',
    '/auth/register/',
    '/auth/verify/',
    '/auth/addresses/',
    '/auth/settings/',
    '/orders/orders/',
    '/products/wishlist/',
    '/products/notifications/',
  ];
  if (nonCriticalEndpoints.some(endpoint => url.includes(endpoint))) {
    return false;
  }

  // Account-gating endpoints: a 401 here means the session is really gone.
  const criticalEndpoints = ['/auth/profile/', '/auth/password-reset/'];
  return criticalEndpoints.some(endpoint => url.includes(endpoint));
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Pull a human-readable message out of an axios failure.
export function apiErrorMessage(error: unknown, fallback: string): string {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' && detail ? detail : fallback;
}

export default apiClient;