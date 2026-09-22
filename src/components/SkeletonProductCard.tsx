import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="bg-card rounded-lg border p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted rounded-md mb-4"></div>
      
      {/* Title skeleton */}
      <div className="h-4 bg-muted rounded mb-2"></div>
      
      {/* Price skeleton */}
      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
      
      {/* Rating skeleton */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-muted rounded"></div>
        ))}
      </div>
      
      {/* Button skeleton */}
      <div className="h-9 bg-muted rounded"></div>
    </div>
  );
};

export default SkeletonProductCard;