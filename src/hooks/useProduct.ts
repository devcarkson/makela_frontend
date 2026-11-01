
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/products';

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getProduct(slug),
    enabled: !!slug, // Only fetch if slug is provided
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
