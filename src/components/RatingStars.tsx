
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md' 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoveredRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const starRating = i + 1;
          const isActive = starRating <= (hoveredRating || rating);

          return (
            <Star
              key={i}
              className={`${sizeClasses[size]} transition-colors ${
                isActive
                  ? 'text-brand-500 fill-current'
                  : 'text-muted-foreground'
              } ${!readonly ? 'cursor-pointer hover:text-brand-600' : ''}`}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              onMouseLeave={handleStarLeave}
            />
          );
        })}
      </div>
    );
};

export default RatingStars;
