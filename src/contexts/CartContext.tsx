
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem, removeCartItem, updateCartItem, clearCart as clearCartApi } from '../api/cart';
import { Product } from '../types/product.types';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: Cart };

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  loading: boolean; // <-- add this
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id.toString() === product.id.toString());
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id.toString() === product.id.toString()
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
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
    
    case 'SET_CART': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Add a loading state to prevent UI from showing stale cart
  const [loading, setLoading] = React.useState(true);

  // Initialize cart from localStorage for unauthenticated users only
  const getInitialCart = (): Cart => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
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

  const [cart, dispatch] = useReducer(cartReducer, getInitialCart());

  // Save cart to localStorage for unauthenticated users
  React.useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
      // console.log('Saved cart to localStorage:', cart);
    }
  }, [cart, isAuthenticated]);

  // Always fetch backend cart on mount and when auth changes
  React.useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        try {
          const backendCart = await fetchCart();
          const mappedCart = {
            items: backendCart.items || [],
            total: backendCart.subtotal || 0,
          };
          dispatch({ type: 'SET_CART', payload: mappedCart });
          localStorage.removeItem('cart'); // Clear local cart
        } catch (e) {
          console.error('Error syncing cart:', e);
        }
      } else {
        // For unauthenticated users, load from localStorage
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
      setLoading(false);
    };
    setLoading(true);
    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Debug log for cart state
  console.log('CartContext: cart', cart, 'loading', loading);

  const addToCart = async (product: Product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        await addCartItem(Number(product.id), quantity);
        const backendCart = await fetchCart();
        const mappedCart = {
          items: backendCart.items || [],
          total: backendCart.subtotal || 0,
        };
        dispatch({ type: 'SET_CART', payload: mappedCart });
      } catch (e) {
        console.error('addCartItem error:', e);
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      try {
        // Always fetch the latest cart before removing
        const backendCart = await fetchCart();
        const item = (backendCart.items || []).find(
          (i: any) => i.product.id.toString() === productId
        );
        if (item && item.id) {
          await removeCartItem(String(item.id));
          const refreshedCart = await fetchCart();
          const mappedCart = {
            items: refreshedCart.items || [],
            total: refreshedCart.subtotal || 0,
          };
          dispatch({ type: 'SET_CART', payload: mappedCart });
        }
      } catch (e) {
        console.error('removeFromCart error:', e);
      }
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        // Always fetch the latest cart before updating
        const backendCart = await fetchCart();
        const item = (backendCart.items || []).find(
          (i: any) => i.product.id.toString() === productId
        );
        if (item && item.id) {
          await updateCartItem(String(item.id), quantity, item.product.id);
          const refreshedCart = await fetchCart();
          const mappedCart = {
            items: refreshedCart.items || [],
            total: refreshedCart.subtotal || 0,
          };
          dispatch({ type: 'SET_CART', payload: mappedCart });
        }
      } catch (e) {
        console.error('updateQuantity error:', e);
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) {
      try {
        await clearCartApi();
      } catch (e) {
        console.error('clearCart error:', e);
      }
    } else {
      // Clear localStorage for unauthenticated users
      localStorage.removeItem('cart');
    }
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Wrap children with loading check
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      loading // <-- add this
    }}>
      {loading ? null : children}
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
