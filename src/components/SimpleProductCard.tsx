import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product.types';
import { Link } from 'react-router-dom';
import { getImageUrl, getProductImage } from '@/utils/imageUrl';

interface SimpleProductCardProps {
  product: Product;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  /* ----- Helpers ----- */
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-brand-500 fill-current' : 'text-muted-foreground'
        }`}
      />
    ));

  /* ----- Image handling ----- */
  const primaryImageUrl = getProductImage(product, 'medium');

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-3 md:p-4">
          {/* Product image */}
          <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
            <img
              src={primaryImageUrl}
              alt={product.name}
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-muted-foreground">
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl font-bold text-primary">
              £{Number(product.price ?? product.price).toLocaleString()}
            </div>
            {product.discount_price && (
              <div className="text-sm text-muted-foreground line-through">
                £{Number(product.discount_price).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SimpleProductCard;
