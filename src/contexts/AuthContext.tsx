import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

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
    try {
      await apiClient.post("/auth/logout/");
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
    const currentRefresh = getStored("refresh");
    if (!currentRefresh) return false;
    
    try {
      const response = await apiClient.post("/auth/token/refresh/", {
        refresh: currentRefresh
      });
      
      const newToken = response.data.access;
      // Save new refresh token if provided (for rotation)
      const newRefresh = response.data.refresh || currentRefresh;
      const remember = localStorage.getItem("refresh") !== null;
      const currentUserId = getStored("userId");
      const currentEmail = getStored("email");
      
      if (currentUserId && currentEmail) {
        setAuthStorage(newToken, newRefresh, parseInt(currentUserId, 10), currentEmail, remember);
        setToken(newToken);
        setRefresh(newRefresh);
        return true;
      }
      return false;
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

  // Set up periodic token refresh (separate effect)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

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