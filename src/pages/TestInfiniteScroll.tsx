import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useProductsInfinite } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import SimpleProductCard from '@/components/SimpleProductCard';

const TestInfiniteScroll = () => {
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    rootMargin: '100px'
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProductsInfinite({ page_size: 6 }); // Small page size for testing

  // Flatten all pages
  const products = data?.pages.flatMap(page => page?.results || []) || [];

  // Infinite scroll effect
  useEffect(() => {
    console.log('InView changed:', { inView, hasNextPage, isFetchingNextPage });
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Fetching next page...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debug info
  useEffect(() => {
    console.log('Query state:', {
      pagesLoaded: data?.pages?.length || 0,
      totalProducts: products.length,
      hasNextPage,
      isFetchingNextPage,
      error: error?.message
    });
  }, [data, products.length, hasNextPage, isFetchingNextPage, error]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" className="py-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Products</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Infinite Scroll Test</h1>
      
      <div className="mb-4 p-4 bg-muted rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Pages loaded: {data?.pages?.length || 0}</p>
        <p>Products shown: {products.length}</p>
        <p>Total products: {data?.pages[0]?.count || 0}</p>
        <p>Has next page: {hasNextPage ? 'Yes' : 'No'}</p>
        <p>Is fetching: {isFetchingNextPage ? 'Yes' : 'No'}</p>
        <p>In view: {inView ? 'Yes' : 'No'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className="border p-4 rounded">
            <SimpleProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="w-full h-20 flex items-center justify-center py-8 border-2 border-dashed border-muted mt-8">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Loading more products...</span>
          </div>
        ) : hasNextPage ? (
          <span className="text-muted-foreground">Scroll trigger area</span>
        ) : (
          <span className="text-muted-foreground">No more products</span>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Showing {products.length} of {data?.pages[0]?.count || 0} products
      </div>
    </div>
  );
};

export default TestInfiniteScroll;