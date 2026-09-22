import apiClient from './client';
import { Product, ProductListResponse } from '@/types/product.types';

export const getProductReviews = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}/reviews/`);
  return data;
};

export const postProductReview = async (slug: string, review: { rating: number; comment: string }, token: string) => {
  const { data } = await apiClient.post(
    `/products/${slug}/reviews/`,
    review,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const ProductService = {
  getProducts: async (params?: Record<string, any>): Promise<ProductListResponse> => {
    const { data } = await apiClient.get('/products/', { params });
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    // Use the dedicated featured endpoint since we know it works
    const { data } = await apiClient.get('/products/featured/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  getNewArrivalProducts: async (): Promise<Product[]> => {
    // Use the dedicated new arrival endpoint since we know it works
    const { data } = await apiClient.get('/products/new_arrival/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}/`);
    return data;
  }
};
