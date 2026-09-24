
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length <= 1) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <img
          src={images[0]}
          alt={productName}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted group">
        <img
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
        
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          onClick={previousImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              index === currentIndex ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
