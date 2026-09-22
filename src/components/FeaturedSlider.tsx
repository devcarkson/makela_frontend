

import React, { useEffect } from 'react';
import { Product } from '@/types/product.types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import SimpleProductCard from '@/components/SimpleProductCard';

interface FeaturedSliderProps {
  products?: Product[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ 
  products = [],
  isLoading = false,
  error = null,
  title = "Featured Products"
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isHovered, setIsHovered] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  // Update current slide and count
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
  }, [api]);

  // Progress bar effect
  useEffect(() => {
    if (!api || products.length === 0 || isHovered) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / 40); // 100% over 4 seconds (40 intervals of 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [api, products.length, isHovered]);

  // Auto-slide effect
  useEffect(() => {
    if (!api || products.length === 0 || isHovered) return;

    const autoSlide = setInterval(() => {
      api.scrollNext();
      setProgress(0); // Reset progress when sliding
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(autoSlide);
  }, [api, products.length, isHovered]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading featured products...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-destructive">
        <p>Error loading featured products: {error.message}</p>
      </div>
    );
  }

  // Show empty state
  if (!Array.isArray(products)) {  // Fixed: Added missing parenthesis
    console.error('Products is not an array:', products);
    return (
      <div className="flex justify-center items-center h-64">
        <p>No featured products available</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No featured products available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        <Carousel 
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-[2px]">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-[2px] basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <SimpleProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Auto-slide progress bar */}
        {count > 1 && !isHovered && (
          <div className="w-full max-w-xs mx-auto mt-3 mb-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeaturedSlider;