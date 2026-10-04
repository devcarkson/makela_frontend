import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductImageLightbox from '@/components/ProductImageLightbox';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  /** Full resolution urls used by the fullscreen viewer. Falls back to `images`. */
  fullImages?: string[];
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images, productName, fullImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const viewerImages =
    fullImages && fullImages.length === images.length ? fullImages : images;

  const openLightbox = () => setLightboxOpen(true);

  if (images.length <= 1) {
    return (
      <div className="w-full space-y-4">
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`View ${productName} image fullscreen`}
          className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
        >
          <img
            src={images[0]}
            alt={productName}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded bg-background/80 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
            View fullscreen
          </span>
        </button>

        <ProductImageLightbox
          images={viewerImages}
          productName={productName}
          open={lightboxOpen}
          startIndex={0}
          onOpenChange={setLightboxOpen}
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
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`View ${productName} image ${currentIndex + 1} fullscreen`}
          className="block h-full w-full cursor-zoom-in"
        >
          <img
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </button>

        {/* Fullscreen hint */}
        <button
          type="button"
          onClick={openLightbox}
          aria-label="View image fullscreen"
          className="absolute bottom-2 right-12 flex cursor-zoom-in items-center gap-1.5 rounded bg-background/80 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Fullscreen
        </button>

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

      <ProductImageLightbox
        images={viewerImages}
        productName={productName}
        open={lightboxOpen}
        startIndex={currentIndex}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
};

export default ProductImageSlider;