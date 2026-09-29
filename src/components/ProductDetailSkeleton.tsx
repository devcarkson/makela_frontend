import React from 'react';

/** Mirrors the product detail layout so the page doesn't jump when data arrives. */
const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-md bg-muted" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image slider */}
          <div className="w-full">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 flex gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 w-16 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-4">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>

            <div className="flex gap-2 pt-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-9 w-16 animate-pulse rounded-md bg-muted" />
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <div className="h-11 w-32 animate-pulse rounded-full bg-muted" />
              <div className="h-11 w-32 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
