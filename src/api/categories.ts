import apiClient from './client';
import { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/products/categories/');
    // Ensure we always return an array
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      // Handle paginated response
      return data.results;
    } else {
      console.warn('Categories API returned unexpected format:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error; // Let React Query handle the error
  }
};