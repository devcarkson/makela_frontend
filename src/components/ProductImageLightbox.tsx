import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductImageLightboxProps {
  images: string[];
  productName: string;
  open: boolean;
  startIndex: number;
  onOpenChange: (open: boolean) => void;
}

const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
  images,
  productName,
  open,
  startIndex,
  onOpenChange,
}) => {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Reset to the image that was clicked and drop any zoom when opening
  useEffect(() => {
    if (open) {
      setIndex(Math.min(Math.max(startIndex, 0), Math.max(images.length - 1, 0)));
      setZoomed(false);
    }
  }, [open, startIndex, images.length]);

  const count = images.length;

  const goNext = useCallback(() => {
    setZoomed(false);
    setIndex((prev) => (count > 0 ? (prev + 1) % count : prev));
  }, [count]);

  const goPrev = useCallback(() => {
    setZoomed(false);
    setIndex((prev) => (count > 0 ? (prev - 1 + count) % count : prev));
  }, [count]);

  // Arrow / Home / End navigation
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'Home') {
        event.preventDefault();
        setZoomed(false);
        setIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setZoomed(false);
        setIndex(Math.max(count - 1, 0));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, goNext, goPrev, count]);

  // Warm the neighbouring images so sliding feels instant
  useEffect(() => {
    if (!open || count < 2) return;
    const next = new Image();
    next.src = images[(index + 1) % count];
    const prev = new Image();
    prev.src = images[(index - 1 + count) % count];
  }, [open, index, images, count]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || count < 2) return;
    const end = event.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  if (count === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-w-[95vw] flex-col gap-3 border-none bg-transparent p-0 shadow-none sm:max-w-[95vw] sm:rounded-none"
        hideCloseButton
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button - anchored to the dialog corner with a large touch target */}
        <DialogClose
          aria-label="Close image viewer"
          className="absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-black/10 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 sm:right-3 sm:top-3"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </DialogClose>

        {/* Top bar: product name + counter */}
        <div className="flex items-center justify-between gap-4 py-1 pl-1 pr-14 text-white sm:pr-16">
          <DialogTitle className="min-w-0 truncate text-left text-sm font-medium text-white/90">
            {productName} image {index + 1} of {count}
          </DialogTitle>
          {count > 1 && (
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-medium tabular-nums text-white ring-1 ring-inset ring-white/25">
              {index + 1} / {count}
            </span>
          )}
        </div>

        {/* Image stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          <img
            key={images[index]}
            src={images[index]}
            alt={`${productName} - Image ${index + 1} of ${count}`}
            className={cn(
              'max-h-[75vh] w-auto max-w-full rounded-md bg-white/5 object-contain shadow-2xl transition-transform duration-200',
              zoomed ? 'scale-[2] cursor-zoom-out' : 'cursor-zoom-in'
            )}
            onClick={() => setZoomed((prev) => !prev)}
            loading="eager"
            decoding="async"
          />

          {count > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous image"
                className="absolute left-0 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/40 bg-black/60 text-white hover:bg-black/80 hover:text-white"
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label="Next image"
                className="absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/40 bg-black/60 text-white hover:bg-black/80 hover:text-white"
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {count > 1 && (
            <Button
              variant="outline"
              size="icon"
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              className="absolute bottom-3 right-3 rounded-full border-white/40 bg-black/60 text-white hover:bg-black/80 hover:text-white"
              onClick={() => setZoomed((prev) => !prev)}
            >
              {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Thumbnail strip */}
        {count > 1 && (
          <div className="flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
            {images.map((image, thumbIndex) => (
              <button
                key={thumbIndex}
                type="button"
                onClick={() => {
                  setZoomed(false);
                  setIndex(thumbIndex);
                }}
                aria-current={thumbIndex === index}
                aria-label={`View image ${thumbIndex + 1}`}
                className={cn(
                  'h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                  thumbIndex === index
                    ? 'border-white'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${thumbIndex + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageLightbox;