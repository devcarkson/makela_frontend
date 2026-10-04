import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient, { refreshAccessToken } from "../api/client";

interface AuthContextType {
  token: string | null;
  refresh: string | null;
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
  login: (
    token: string, 
    refresh: string, 
    userId: number, 
    email: string, 
    remember: boolean
  ) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStored(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStored("token"));
  const [refresh, setRefresh] = useState<string | null>(() => getStored("refresh"));
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = getStored("userId");
    return stored ? parseInt(stored, 10) : null;
  });
  const [email, setEmail] = useState<string | null>(() => getStored("email"));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Unified storage management
  const setAuthStorage = (
    token: string | null,
    refresh: string | null,
    userId: number | null,
    email: string | null,
    remember: boolean
  ) => {
    const storage = remember ? localStorage : sessionStorage;
    
    // Clear opposite storage first
    const oppositeStorage = remember ? sessionStorage : localStorage;
    oppositeStorage.removeItem("token");
    oppositeStorage.removeItem("refresh");
    oppositeStorage.removeItem("userId");
    oppositeStorage.removeItem("email");

    if (token && userId && email) {
      storage.setItem("token", token);
      storage.setItem("refresh", refresh || "");
      storage.setItem("userId", String(userId));
      storage.setItem("email", email);
    } else {
      storage.removeItem("token");
      storage.removeItem("refresh");
      storage.removeItem("userId");
      storage.removeItem("email");
    }
  };

  const login = (
    newToken: string,
    newRefresh: string,
    newUserId: number,
    newEmail: string,
    remember = true
  ) => {
    setAuthStorage(newToken, newRefresh, newUserId, newEmail, remember);
    setToken(newToken);
    setRefresh(newRefresh);
    setUserId(newUserId);
    setEmail(newEmail);
  };

  const logout = async () => {
    const currentRefresh = getStored("refresh");
    try {
      // Revoke the refresh token server side so the session really ends.
      if (currentRefresh) {
        await apiClient.post("/auth/logout/", { refresh: currentRefresh });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthStorage(null, null, null, null, false);
      setToken(null);
      setRefresh(null);
      setUserId(null);
      setEmail(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!getStored("refresh")) return false;

    try {
      // Shared with the api interceptor so a background refresh and a 401
      // retry can never rotate the same single-use refresh token twice.
      await refreshAccessToken();

      const newToken = getStored("token");
      const newRefresh = getStored("refresh");
      const currentUserId = getStored("userId");
      const currentEmail = getStored("email");

      if (!newToken || !currentUserId || !currentEmail) return false;

      setToken(newToken);
      setRefresh(newRefresh);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Don't call logout here to avoid circular dependency
      setAuthStorage(null, null, null, null, false);
      setToken(null);
      setRefresh(null);
      setUserId(null);
      setEmail(null);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStored("token");
      const storedRefresh = getStored("refresh");
      const storedUserId = getStored("userId");
      const storedEmail = getStored("email");

      if (storedToken && storedUserId && storedEmail) {
        // Set the state - let API interceptor handle token validation when needed
        setToken(storedToken);
        setRefresh(storedRefresh);
        setUserId(parseInt(storedUserId, 10));
        setEmail(storedEmail);
      }
      setIsInitialized(true);
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // Access tokens are long lived, so there is no periodic refresh: the api
  // interceptor renews on demand if a token ever does expire or get revoked.

  return (
    <AuthContext.Provider
      value={{
        token,
        refresh,
        userId,
        email,
        isAuthenticated: !!token,
        isInitialized,
        isInitializing,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}