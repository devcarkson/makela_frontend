import { Product } from './product.types';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  id?: string | number; // Add id for backend sync
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
}

// src/types/index.ts
// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   rating?: number;
//   image: string;
//   slug: string;
//   is_featured?: boolean;
//   is_new_arrival?: boolean;
//   // Add any other product fields you need
// }

export interface FilterOptions {
  searchTerm: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
