import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleProductCard from '@/components/SimpleProductCard';
import SkeletonProductCard from '@/components/SkeletonProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useProductsInfinite } from '@/hooks/useProducts';
import { FilterOptions } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from 'use-debounce';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    rootMargin: '100px' // Trigger 100px before the element comes into view
  });

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000, // Increased to accommodate higher prices
    inStock: false
  });

  const [debouncedFilters] = useDebounce(filters, 300);

  // Sync filters from URL query string
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCategory = params.get('category') || '';
    const urlSearch = params.get('search') || '';
    setFilters(prev => ({ 
      ...prev, 
      category: urlCategory,
      searchTerm: urlSearch
    }));
  }, [location.search]);

  const [sortBy, setSortBy] = useState<string>('name');

  const apiParams = useMemo(() => {
    const params: Record<string, unknown> = {};
    if (debouncedFilters.searchTerm) params.search = debouncedFilters.searchTerm;
    if (debouncedFilters.category && debouncedFilters.category !== 'all') {
      params.category = debouncedFilters.category;
    }
    if (debouncedFilters.minPrice && debouncedFilters.minPrice > 0) params.min_price = debouncedFilters.minPrice;
    // Only send max_price if it's been changed from default (10000) or if min_price is set
    if (debouncedFilters.maxPrice && (debouncedFilters.maxPrice < 10000 || debouncedFilters.minPrice > 0)) {
      params.max_price = debouncedFilters.maxPrice;
    }
    if (debouncedFilters.inStock) params.in_stock = true;

    switch (sortBy) {
      case 'price-low': params.ordering = 'price'; break;
      case 'price-high': params.ordering = '-price'; break;
      case 'rating': params.ordering = '-rating'; break;
      default: params.ordering = 'name';
    }
    return params;
  }, [debouncedFilters, sortBy]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProductsInfinite(apiParams);



  // Safely flatten all pages of products with null checks
  const products = useMemo(() => {
    const apiProducts = data?.pages.flatMap(page => 
      page?.results?.filter(product => product?.id) || []
    ) || [];
    
    return apiProducts;
  }, [data, error]);

  const totalProducts = data?.pages[0]?.count || 0;

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = (key: keyof FilterOptions, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      inStock: false
    });
  };

  // No full-page loader: the header, filters and sort controls render straight
  // away and only the product grid shows skeletons while data is in flight.

  // Only show error if we have no products at all (including fallback)
  if (error && products.length === 0) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message="Failed to load products"
            onRetry={refetch}
            className="my-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* --- Filters Sidebar --- */}
          <aside className={`${
            isMobile ? 'fixed inset-0 z-50 bg-background p-4' : 'lg:w-64'
          } ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
            {isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Card className={isMobile ? 'h-full overflow-y-auto' : ''}>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Input
                      id="search"
                      placeholder="Search products..."
                      value={filters.searchTerm || ''}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <Label>Price Range: £{filters.minPrice} - £{filters.maxPrice}</Label>
                  <div className="mt-2 space-y-3">
                    <Slider
                      value={[filters.minPrice]}
                      onValueChange={([val]) => handleFilterChange('minPrice', val)}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={([val]) => handleFilterChange('maxPrice', val)}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* In Stock */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock || false}
                    onCheckedChange={(checked) => handleFilterChange('inStock', !!checked)}
                  />
                  <Label htmlFor="inStock">In Stock Only</Label>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                  {isMobile && (
                    <Button onClick={() => setShowFilters(false)} className="w-full">
                      Apply Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                {/* <h1 className="text-3xl font-bold">Products</h1> */}
                {error && (
                  <span className="text-xs ml-2 text-primary">
                    (Sample data - API unavailable)
                  </span>
                )}
              </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                )}
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">List</span>
                  </Button>
                </div>
              </div>
            </div>

            {isLoading && products.length === 0 ? (
              <div className={`grid gap-[2px] ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <SkeletonProductCard key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found.</p>
                <Button onClick={clearFilters} className="mt-4">Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-[2px] ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    product?.id ? (
                      <SimpleProductCard key={product.id} product={product} />
                    ) : null
                  ))}
                </div>
                
                {/* Infinite scroll trigger */}
                <div ref={ref} className="w-full h-20 flex flex-col items-center justify-center py-4 gap-3">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground">Loading more products...</span>
                    </div>
                  )}
                  
                  {hasNextPage && !isFetchingNextPage && (
                    <div className="flex flex-col items-center gap-2">
                      <Button 
                        onClick={() => fetchNextPage()} 
                        variant="outline"
                        className="px-6"
                      >
                        Load More Products
                      </Button>
                      <p className="text-muted-foreground text-xs">
                        Or scroll down for automatic loading
                      </p>
                    </div>
                  )}
                  
                  {!hasNextPage && products.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      {products.length >= totalProducts 
                        ? `You've reached the end (${products.length} of ${totalProducts} products)` 
                        : "No more products to load"}
                    </p>
                  )}
                  

                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;