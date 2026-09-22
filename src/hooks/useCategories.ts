import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/categories';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
