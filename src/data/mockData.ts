
import { Product } from '@/types/product.types';
import { Category } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Clothing', slug: 'clothing' },
  { id: 3, name: 'Books', slug: 'books' },
  { id: 4, name: 'Home & Garden', slug: 'home-garden' },
  { id: 5, name: 'Sports', slug: 'sports' },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'],
    category: { id: 1, name: 'Electronics', slug: 'electronics' },
    stock: 15,
    is_featured: true,
    is_new_arrival: false,
    rating: 4.5,
    review_count: 128,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Smart Watch',
    slug: 'smart-watch',
    description: 'Feature-rich smartwatch with health tracking, GPS, and water resistance.',
    price: 299.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
    category: { id: 1, name: 'Electronics', slug: 'electronics' },
    stock: 8,
    is_featured: true,
    is_new_arrival: true,
    rating: 4.2,
    review_count: 89,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'],
    category: { id: 2, name: 'Clothing', slug: 'clothing' },
    stock: 50,
    is_featured: false,
    is_new_arrival: false,
    rating: 4.0,
    review_count: 45,
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'JavaScript: The Definitive Guide',
    slug: 'javascript-definitive-guide',
    description: 'Comprehensive guide to JavaScript programming for beginners and experts.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop'],
    category: { id: 3, name: 'Books', slug: 'books' },
    stock: 25,
    is_featured: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 312,
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: 5,
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip yoga mat perfect for home workouts and studio sessions.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop'],
    category: { id: 5, name: 'Sports', slug: 'sports' },
    stock: 30,
    is_featured: true,
    is_new_arrival: true,
    rating: 4.3,
    review_count: 67,
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 6,
    name: 'Coffee Maker',
    slug: 'coffee-maker',
    description: 'Programmable coffee maker with thermal carafe and auto-shutoff feature.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop'],
    category: { id: 4, name: 'Home & Garden', slug: 'home-garden' },
    stock: 12,
    is_featured: false,
    is_new_arrival: false,
    rating: 4.1,
    review_count: 156,
    created_at: '2024-01-06T00:00:00Z'
  }
];
