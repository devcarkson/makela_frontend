import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SkeletonProductCard from './SkeletonProductCard';

interface SkeletonFeaturedSliderProps {
  title: string;
  itemCount?: number;
}

const SkeletonFeaturedSlider: React.FC<SkeletonFeaturedSliderProps> = ({ 
  title,
  itemCount = 4 
}) => {
  return (
    <div className="space-y-6 w-full">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent>
          {[...Array(itemCount)].map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SkeletonProductCard />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default SkeletonFeaturedSlider;