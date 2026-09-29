// src/hooks/useProducts.ts
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Product } from '@/types/product.types';
import { PaginatedResponse } from '@/types';
import { ProductService } from '@/api/products';

// Infinite scroll products hook
export const useProductsInfinite = (params?: Record<string, unknown>) => {
  return useInfiniteQuery<PaginatedResponse<Product>, AxiosError>({
    queryKey: ['products', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await ProductService.getProducts({
        ...params,
        page: pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      
      try {
        // Handle both absolute and relative URLs
        let urlToParse = lastPage.next;
        if (!urlToParse.startsWith('http')) {
          // If it's a relative URL, make it absolute
          urlToParse = `${window.location.origin}${urlToParse}`;
        }
        
        const url = new URL(urlToParse);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      } catch (error) {
        // Fallback: try to extract page number with regex
        const match = lastPage.next.match(/[?&]page=(\d+)/);
        if (match) {
          return Number(match[1]);
        }
        
        return undefined;
      }
    },
    initialPageParam: 1,
    // Keep the previous page of results on screen while the next one loads,
    // so filters and pagination don't flash a skeleton
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};

// Regular products hook (non-infinite)
export const useProducts = (params?: Record<string, unknown>) => {
  return useQuery<PaginatedResponse<Product>, AxiosError>({
    queryKey: ['products', params],
    queryFn: () => ProductService.getProducts(params),
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};

// Featured products hook
export const useFeaturedProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ['featured-products'],
    queryFn: ProductService.getFeaturedProducts,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 500, // Faster retry
  });
};

// New arrival products hook
export const useNewArrivalProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ['new-arrival-products'],
    queryFn: ProductService.getNewArrivalProducts,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 500, // Faster retry
  });
};

// Single product hook
export const useProduct = (slug: string) => {
  return useQuery<Product, AxiosError>({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getProduct(slug),
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};