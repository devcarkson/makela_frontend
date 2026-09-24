
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import FeaturedSlider from '@/components/FeaturedSlider';
import RatingStars from '@/components/RatingStars';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useProduct } from '@/hooks/useProduct';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import ProductImageSlider from '@/components/ProductImageSlider';
import { getImageUrl, getFirstImage, getProductImage } from '@/utils/imageUrl';
import { getProductReviews, postProductReview } from '@/api/products';
import { addToWishlist } from '@/api/wishlist';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  const { data: apiProduct, isLoading, error, refetch } = useProduct(slug!);
  const { data: featuredProducts } = useFeaturedProducts();
  const { isAuthenticated, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  const product = apiProduct;

  // Fetch reviews
  const fetchReviews = async () => {
    setReviewsLoading(true);
    setReviewsError('');
    try {
      const data = await getProductReviews(slug!);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setReviews(data.results);
      } else {
        console.warn('Reviews API returned unexpected format:', data);
        setReviews([]);
      }
    } catch (e: any) {
      console.error('Failed to fetch reviews:', e);
      setReviewsError('Failed to load reviews');
      setReviews([]); // Ensure reviews is always an array
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchReviews();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only show error if we have no product at all (including fallback)
  if (!product) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message="Product not found or failed to load"
            onRetry={refetch}
            className="my-8"
          />
          <div className="text-center mt-4">
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get product images with proper URLs
  const productImages = (() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // New format: array of ProductImage objects
      return product.images.map(img => {
        if (typeof img === 'string') {
          return getImageUrl(img); // Legacy format
        }
        // New format: use thumbnail_large for detail view, fallback to image
        return getImageUrl(img.thumbnail_large || img.image);
      });
    }
    
    // Fallback: try to get from primary_image
    if (product.primary_image) {
      return [getImageUrl(product.primary_image.thumbnail_medium)];
    }
    
    return ['/placeholder.svg'];
  })();



  const handleAddToCart = () => {
    // Convert Django API product to local Product type for cart
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
      images: [productImages[0]],
      category: product.category
    };

    addToCart(cartProduct, quantity);
    toast({
      title: "✨ Added to cart!",
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
            <p className="text-sm text-muted-foreground">£{product.price.toLocaleString()} x {quantity}</p>
          </div>
        </div>
      ),
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
      toast({
        title: "Shared successfully! 💫",
        description: "Product shared with your friends!"
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied! 📋",
        description: "Product link copied to clipboard"
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Login required",
        description: "You must be logged in to add to wishlist.",
        variant: "destructive"
      });
      return;
    }
    try {
      await addToWishlist(product.id);
      toast({
        title: "💕 Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (e: any) {
      toast({
        title: "Failed to add to wishlist",
        description: e?.response?.data?.detail || e.message || 'Error',
        variant: "destructive"
      });
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast({
        title: "Please rate the product",
        description: "Your rating helps other customers make better decisions.",
        variant: "destructive"
      });
      return;
    }
    if (!isAuthenticated || !token) {
      toast({
        title: "Login required",
        description: "You must be logged in to submit a review.",
        variant: "destructive"
      });
      return;
    }
    try {
      await postProductReview(slug!, { rating: userRating, comment: review }, token);
      toast({
        title: "Review submitted! ⭐",
        description: "Thank you for your feedback!"
      });
      setShowReviewForm(false);
      setUserRating(0);
      setReview('');
      fetchReviews();
    } catch (e: any) {
      toast({
        title: "Failed to submit review",
        description: e?.response?.data?.detail || e.message || 'Error',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Slider */}
          <div className="w-full">
            <ProductImageSlider images={productImages} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="w-full space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 break-words">
                {product.name}
                {error && (
                  <span className="text-xs ml-2 text-primary font-normal">
                    (Sample product - API unavailable)
                  </span>
                )}
              </h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={product.rating} readonly />
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  £{Number(product.price).toLocaleString('en-GB')}
                </span>
                {product.discount_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    £{Number(product.price).toLocaleString('en-GB')}
                  </span>
                )}
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  size="default"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={handleAddToWishlist}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{product.category.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>PROD-{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </div>
          {showReviewForm && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="font-medium mb-2 block">Your Rating</label>
                  <RatingStars 
                    rating={userRating} 
                    onRatingChange={setUserRating}
                    size="lg"
                  />
                </div>
                <div>
                  <label className="font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview}>Submit Review</Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="mt-6">
            {reviewsLoading ? (
              <LoadingSpinner size="md" />
            ) : reviewsError ? (
              <ErrorMessage message={reviewsError} onRetry={fetchReviews} />
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {Array.isArray(reviews) && reviews.map((r: any) => (
                  <Card key={r.id}>
                    <CardContent className="py-4 px-6">
                      <div className="flex items-center gap-2 mb-1">
                        <RatingStars rating={r.rating} readonly size="sm" />
                        <span className="text-xs text-muted-foreground">{r.user}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm">{r.comment}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="mt-16">
            <FeaturedSlider products={featuredProducts} title="You Might Also Like" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
