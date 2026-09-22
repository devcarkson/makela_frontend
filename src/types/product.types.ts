export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock: number;
  rating: number;
  review_count: number;
  created_at: string;
  images?: ProductImage[]; // Full product details have images array
  primary_image?: PrimaryImage; // List view has primary_image object
  category: Category;
}

export interface ProductImage {
  id: number;
  image: string;
  thumbnail_small: string;
  thumbnail_medium: string;
  thumbnail_large: string;
  is_primary: boolean;
}

export interface PrimaryImage {
  id: number;
  thumbnail_small: string;
  thumbnail_medium: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}