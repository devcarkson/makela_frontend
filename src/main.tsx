// src/index.tsx
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import type { AxiosError } from "axios";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data in memory so coming back to a page renders instantly
        // instead of flashing a skeleton and refetching from scratch.
        staleTime: 60 * 1000, // Data is fresh for 1 min: no refetch on mount
        gcTime: 5 * 60 * 1000, // Keep cached data 5 min after the last unmount
        retry: (failureCount, error: AxiosError) => {
          // Don't retry on 4xx errors
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: 500,
        // Stale-while-revalidate: any refetch below happens in the background
        // while the already-rendered data stays on screen, so updates still
        // land within a second or so without the page ever blanking out.
        refetchOnWindowFocus: true, // Re-check when the user comes back to the tab
        refetchOnMount: true, // Re-check when navigating back to a page
        refetchOnReconnect: true,
        // No global polling: it re-requested every query every 5s forever,
        // including background tabs. Focus/mount revalidation covers updates.
        refetchInterval: false,
        refetchIntervalInBackground: false,
      },
    },
  });

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <App />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
