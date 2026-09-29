
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem, removeCartItem, updateCartItem, clearCart as clearCartApi } from '../api/cart';
import { Product, ProductVariant } from '../types/product.types';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  backendId?: string;
  variant?: ProductVariant | null;
  variantId?: number | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variant?: ProductVariant | null; variantId?: number | null } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ITEM_ID'; payload: { productId: string; itemId: string } };

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variant, variantId } = action.payload;
      // Match by both product ID and variant ID (or both null for no variant)
      const existingItem = state.items.find(item => 
        item.product.id.toString() === product.id.toString() &&
        ((item.variantId || null) === (variantId || null))
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id.toString() === product.id.toString() &&
          (item.variantId || null) === (variantId || null)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, variant, variantId }];
      }

      const total = newItems.reduce((sum, item) => 
        sum + (item.variant?.current_price || item.variant?.effective_price || item.product.price) * item.quantity, 0
      );
      return { items: newItems, total };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id.toString() !== action.payload.productId);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, total };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.id.toString() === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, total };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    case 'SET_CART':
      return action.payload;

    case 'SET_ITEM_ID': {
      const { productId, itemId } = action.payload;
      const newItems = state.items.map(item =>
        item.product.id.toString() === productId
          ? { ...item, backendId: itemId }
          : item
      );
      return { ...state, items: newItems };
    }

    default:
      return state;
  }
};

interface BackendCartItem {
  id: string | number;
  product: Product;
  quantity: number;
  variant?: ProductVariant | null;
  variant_id?: number | null;
  size_name?: string;
  color_name?: string;
}

interface BackendCartResponse {
  items?: BackendCartItem[];
  subtotal?: number;
}

const normalizeBackendCart = (backendCart: BackendCartResponse): Cart => {
  const itemsWithBackendIds = (backendCart.items || []).map(
    (item: BackendCartItem) => ({
      product: item.product,
      quantity: item.quantity,
      backendId: String(item.id),
      variant: item.variant || null,
      variantId: item.variant_id || null,
    })
  );
  return {
    items: itemsWithBackendIds,
    total: backendCart.subtotal || 0,
  };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Load initial cart from localStorage — instant, no network call
  const getInitialCart = (): Cart => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('Error parsing saved cart:', e);
        }
      }
    }
    return { items: [], total: 0 };
  };

  const [cart, dispatch] = useReducer(cartReducer, undefined, getInitialCart);

  // Save cart to localStorage on every change — instant persistence, no frontend cache/stale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Fetch cart directly from backend and update state
  const refreshCart = useCallback(async () => {
    try {
      const backendCart = await fetchCart();
      dispatch({ type: 'SET_CART', payload: normalizeBackendCart(backendCart) });
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  }, []);

  // Sync with backend ONLY on auth state change (login/logout), not on mount
  // Mount loads from localStorage instantly — no network delay, no race condition
  useEffect(() => {
    // Skip on first render — localStorage already loaded via getInitialCart
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;

    const syncCart = async () => {
      if (isAuthenticated) {
        // Merging guest cart into backend on login
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const guestCart = JSON.parse(savedCart);
            if (guestCart.items && guestCart.items.length > 0) {
              for (const item of guestCart.items) {
                try {
                  await addCartItem(Number(item.product.id), item.quantity);
                } catch (e) {
                  console.error('Error merging guest cart item:', e);
                }
              }
            }
          } catch (e) {
            console.error('Error parsing guest cart for merge:', e);
          }
        }

        setLoading(true);
        try {
          await refreshCart();
          if (!cancelled) localStorage.removeItem('cart');
        } catch (e) {
          console.error('Error syncing cart:', e);
        }
      } else {
        // Logging out: load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
          } catch (e) {
            dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
          }
        } else {
          dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
        }
      }
      if (!cancelled) setLoading(false);
    };

    syncCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refreshCart]);

  // Every action: optimistic dispatch (instant) + direct single backend API call (no refetch)
  const addToCart = async (
    product: Product, 
    quantity = 1,
    variant: ProductVariant | null = null,
    variantId: number | null = null
  ) => {
    // Optimistic update — instant UI for both guest and logged-in users
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { product, quantity, variant, variantId } 
    });

    if (isAuthenticated) {
      try {
        const response = await addCartItem(
          Number(product.id), 
          quantity,
          variantId || (variant?.id || null)
        );
        const backendId = response?.data?.id || response?.data?.item?.id;
        if (backendId) {
          dispatch({ 
            type: 'SET_ITEM_ID', 
            payload: { 
              productId: String(product.id), 
              itemId: String(backendId) 
            } 
          });
        }
      } catch (e) {
        dispatch({ 
          type: 'REMOVE_ITEM', 
          payload: { productId: String(product.id) } 
        });
        console.error('addCartItem error:', e);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const item = cart.items.find(i => i.product.id.toString() === productId);
    const backendItemId = item?.backendId;

    // Optimistic update — instant UI
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

    if (isAuthenticated) {
      try {
        if (backendItemId) {
          await removeCartItem(String(backendItemId));
        } else {
          const backendCart = await fetchCart();
          const backendItem = (backendCart.items || []).find(
            (i: BackendCartItem) => i.product.id.toString() === productId
          );
          if (backendItem?.id) {
            await removeCartItem(String(backendItem.id));
          }
        }
      } catch (e) {
        console.error('removeFromCart error:', e);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const item = cart.items.find(i => i.product.id.toString() === productId);
    const backendItemId = item?.backendId;

    // Optimistic update — instant UI
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });

    if (isAuthenticated) {
      try {
        if (backendItemId) {
          await updateCartItem(String(backendItemId), quantity, Number(productId));
        } else {
          const backendCart = await fetchCart();
          const backendItem = (backendCart.items || []).find(
            (i: BackendCartItem) => i.product.id.toString() === productId
          );
          if (backendItem?.id) {
            await updateCartItem(String(backendItem.id), quantity, Number(productId));
          }
        }
      } catch (e) {
        console.error('updateQuantity error:', e);
      }
    }
  };

  const clearCart = async () => {
    // Optimistic update — instant UI
    dispatch({ type: 'CLEAR_CART' });

    if (isAuthenticated) {
      try {
        await clearCartApi();
      } catch (e) {
        console.error('clearCart error:', e);
      }
    } else {
      localStorage.removeItem('cart');
    }
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
