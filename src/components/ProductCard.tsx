import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getImageUrl, getFirstImage, getProductImage } from '@/utils/imageUrl';

interface ProductCardProps {
  product: Product;
  isSliderCard?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSliderCard = false }) => {
  const { addToCart } = useCart();

  const primaryImageUrl = getProductImage(product, 'medium');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      stock: product.stock,
      rating: product.rating,
      review_count: product.review_count,
      created_at: product.created_at,
      images: [primaryImageUrl],
      category: product.category
    };

    addToCart(cartProduct);
    toast({
      title: '✨ Added to cart!',
      description: (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
            <img
              src={cartProduct.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              £{Number(product.price).toLocaleString('en-GB')}
            </p>
          </div>
        </div>
      ),
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-rating fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const CardImage = (
    <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
      <img
        src={primaryImageUrl}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  if (isSliderCard) {
    return (
      <Link to={`/product/${product.slug}`}>
        <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
          <CardContent className="p-3">
            {CardImage}
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-xs text-muted-foreground">
                  ({product.review_count || 0})
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-primary">
                £{Number(product.price ?? product.price).toLocaleString('en-GB')}
              </div>
              {product.discount_price && (
                <div className="text-sm text-muted-foreground line-through">
                  £{Number(product.discount_price).toLocaleString('en-GB')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-4">
          {CardImage}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          {product.rating && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-muted-foreground">
                ({product.review_count || 0})
              </span>
            </div>
          )}
          {/* <div className="flex items-center gap-2 justify-between">
            <span className="text-2xl font-bold text-primary">
              £{Number(product.price ?? product.discount_price).toLocaleString('en-GB')}
            </span>
            {product.price && (
              <span className="text-sm text-muted-foreground line-through">
                £{Number(product.price).toLocaleString('en-GB')}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div> */}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
