// src/utils/imageUrl.ts
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';

  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:8000';
  // const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://makelacosmetic.uk';

  // If imagePath is already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If imagePath starts with "/media"
  if (imagePath.startsWith('/media')) {
    return `${baseUrl}${imagePath}`;
  }

  // Otherwise assume it's inside media/
  return `${baseUrl}/media/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
};

// Helper function to get the first image from various formats
export const getFirstImage = (images: any): string => {
  if (!images) return '/placeholder.svg';
  
  // If it's a string (legacy format)
  if (typeof images === 'string') {
    return getImageUrl(images);
  }
  
  // If it's an array of strings (legacy format)
  if (Array.isArray(images) && typeof images[0] === 'string') {
    return images.length > 0 ? getImageUrl(images[0]) : '/placeholder.svg';
  }
  
  // If it's an array of ProductImage objects (new format)
  if (Array.isArray(images) && images[0]?.image) {
    const primaryImage = images.find(img => img.is_primary) || images[0];
    return getImageUrl(primaryImage.thumbnail_medium || primaryImage.image);
  }
  
  return '/placeholder.svg';
};

// Helper function to get image from product (handles both list and detail views)
export const getProductImage = (product: any, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  // For list view - use primary_image object
  if (product.primary_image) {
    const sizeMap = {
      small: 'thumbnail_small',
      medium: 'thumbnail_medium', 
      large: 'thumbnail_medium' // Use medium for large in list view
    };
    return getImageUrl(product.primary_image[sizeMap[size]]);
  }
  
  // For detail view - use images array
  if (product.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img: any) => img.is_primary) || product.images[0];
    if (primaryImage) {
      const sizeMap = {
        small: 'thumbnail_small',
        medium: 'thumbnail_medium',
        large: 'thumbnail_large'
      };
      return getImageUrl(primaryImage[sizeMap[size]] || primaryImage.image);
    }
  }
  
  // Fallback to legacy format
  return getFirstImage(product.images);
};
