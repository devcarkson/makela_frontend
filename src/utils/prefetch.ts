import { QueryClient } from '@tanstack/react-query';
import { ProductService } from '@/api/products';

export const prefetchHomePageData = async (queryClient: QueryClient) => {
  // Prefetch featured products
  queryClient.prefetchQuery({
    queryKey: ['featured-products'],
    queryFn: ProductService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch new arrivals
  queryClient.prefetchQuery({
    queryKey: ['new-arrival-products'],
    queryFn: ProductService.getNewArrivalProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch first page of products
  queryClient.prefetchInfiniteQuery({
    queryKey: ['products', {}],
    queryFn: ({ pageParam = 1 }) => ProductService.getProducts({ page: pageParam }),
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};