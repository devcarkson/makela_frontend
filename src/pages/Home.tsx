import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import FeaturedSlider from '@/components/FeaturedSlider';
import SkeletonFeaturedSlider from '@/components/SkeletonFeaturedSlider';
import SimpleProductCard from '@/components/SimpleProductCard';
import SkeletonProductCard from '@/components/SkeletonProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, HeadphonesIcon, Shield, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useFeaturedProducts, useNewArrivalProducts, useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product.types';
import ErrorMessage from '@/components/ErrorMessage';

type HeroSlide = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  badge: string;
  background: string;
  imagePosition: string;
  icon: React.ReactNode;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'New season favorites',
    title: 'Radiant starts',
    accent: 'here',
    description: 'Discover premium beauty essentials curated to help you look and feel your best every day.',
    primaryLabel: 'Shop the collection',
    primaryHref: '/products',
    secondaryLabel: 'Explore new arrivals',
    secondaryHref: '/products',
    badge: 'Curated beauty',
    background: 'bg-brand-50',
    imagePosition: 'center',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    eyebrow: 'Made for your routine',
    title: 'Beauty, simplified',
    accent: 'for you',
    description: 'Find trusted skincare, makeup, and self-care favorites in one effortless shopping experience.',
    primaryLabel: 'Find your favorites',
    primaryHref: '/products',
    secondaryLabel: 'Shop bestsellers',
    secondaryHref: '/products',
    badge: 'Everyday essentials',
    background: 'bg-brand-100',
    imagePosition: '35% center',
    icon: <ShoppingBag className="h-6 w-6" />,
  },
  {
    eyebrow: 'A little more joy',
    title: 'Treat yourself',
    accent: 'today',
    description: 'Enjoy thoughtful picks, secure checkout, and fast delivery right to your door.',
    primaryLabel: 'View offers',
    primaryHref: '/products',
    secondaryLabel: 'Learn about delivery',
    secondaryHref: '/about',
    badge: 'Free delivery over £30,000',
    background: 'bg-brand-200',
    imagePosition: '65% center',
    icon: <Gift className="h-6 w-6" />,
  },
];

const Home = () => {
  const { data: featuredProducts, isLoading: isLoadingFeatured, error: errorFeatured, refetch: refetchFeatured } = useFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew, error: errorNew, refetch: refetchNew } = useNewArrivalProducts();
  const { data: allProducts = [], isLoading: isLoadingProducts, error: errorProducts } = useProducts({ page_size: 6 });

  const finalFeaturedProducts = featuredProducts || [];
  const finalNewArrivals = newArrivals || [];

  const displayProducts: Product[] = Array.isArray(allProducts)
    ? allProducts
    : allProducts?.results || [];

  const [api, setApi] = React.useState<CarouselApi>();
  const [count, setCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const updateSlide = () => {
      setCount(api.scrollSnapList().length);
    };

    updateSlide();
    api.on("select", updateSlide);
    api.on("reInit", updateSlide);

    return () => {
      api.off("select", updateSlide);
      api.off("reInit", updateSlide);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || count <= 1 || isPaused) return;

    const autoSlide = window.setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => window.clearInterval(autoSlide);
  }, [api, count, isPaused]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <section className="relative w-full" aria-label="Featured promotions">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            aria-label="Hero carousel"
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {heroSlides.map((slide) => (
                <CarouselItem key={slide.title} className="pl-0">
                  <div className={cn("relative flex min-h-[28rem] overflow-hidden md:h-[26rem] md:min-h-0 md:flex-row lg:h-[26rem] lg:min-h-0", slide.background)}>
                    <div className="absolute inset-0 bg-background md:static md:flex md:h-full md:min-h-0 md:w-1/2">
                      <img
                        src="/SnapInsta.to_518212817_18114381505497623_2927998923866283814_n.jpg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover md:static md:h-full md:object-contain"
                        style={{ objectPosition: slide.imagePosition }}
                        loading="eager"
                        decoding="async"
                        fetchpriority="high"
                      />
                    </div>

                    <div className="relative z-10 flex min-h-full flex-col justify-center bg-transparent px-4 py-8 sm:px-6 md:w-1/2 md:min-h-[26rem] md:bg-background/95 md:py-6 lg:px-8 lg:py-8 lg:min-h-[26rem]">
                      <div className="max-w-xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/75 px-4 py-2 text-sm font-medium text-primary backdrop-blur">
                          {slide.icon}
                          <span>{slide.eyebrow}</span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                          {slide.title}{" "}
                          <span className="text-brand-600">
                            {slide.accent}
                          </span>
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                          {slide.description}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <Button asChild size="lg" className="rounded-full">
                            <Link to={slide.primaryHref}>
                              {slide.primaryLabel}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="lg" asChild className="rounded-full bg-background/70 backdrop-blur">
                            <Link to={slide.secondaryHref}>{slide.secondaryLabel}</Link>
                          </Button>
                        </div>
                        <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-background/65 px-3 py-2 text-xs font-medium text-foreground backdrop-blur">
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          {slide.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>



      {/* Featured Products Slider */}
      <section className="py-2 w-full">
        <div className="container mx-auto px-4">
          {isLoadingFeatured ? (
            <SkeletonFeaturedSlider title="Featured Products" itemCount={4} />
          ) : finalFeaturedProducts.length > 0 ? (
            <>
              <FeaturedSlider 
                products={finalFeaturedProducts} 
                title="Featured Products" 
                isLoading={false}
                error={null}
              />
              {errorFeatured && (
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing sample products (API unavailable)
                  </p>
                  {import.meta.env.DEV && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Debug Info
                      </summary>
                      <div className="text-xs text-left bg-muted p-2 rounded mt-1">
                        <p><strong>Error:</strong> {errorFeatured.message}</p>
                        <p><strong>Status:</strong> {errorFeatured.response?.status}</p>
                        <p><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
                      </div>
                    </details>
                  )}
                </div>
              )}
            </>
          ) : (
            <ErrorMessage message="Failed to load featured products" onRetry={refetchFeatured} />
          )}
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="py-2 bg-muted/30 w-full">
        <div className="container mx-auto px-4">
          {isLoadingNew ? (
            <SkeletonFeaturedSlider title="New Arrivals" itemCount={3} />
          ) : finalNewArrivals.length > 0 ? (
            <>
              <FeaturedSlider 
                products={finalNewArrivals} 
                title="New Arrivals" 
                isLoading={false}
                error={null}
              />
              {errorNew && (
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing sample products (API unavailable)
                  </p>
                </div>
              )}
            </>
          ) : (
            <ErrorMessage message="Failed to load new arrivals" onRetry={refetchNew} />
          )}
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-2 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop Our Products</h2>
            <p className="text-muted-foreground mb-8">
              Browse through our carefully selected collection of quality products
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[2px]">
            {isLoadingProducts ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))
            ) : errorProducts ? (
              <div className="col-span-full text-center py-8">
                <ErrorMessage message="Failed to load products" />
              </div>
            ) : (
              displayProducts.map((product: Product) => (
                <SimpleProductCard key={product.slug} product={product} />
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-2 bg-background w-full">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over £30,000. Fast and reliable delivery nationwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-muted-foreground">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer support team is here to help you anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
