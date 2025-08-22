
import { create } from 'zustand';
import { CartItem } from './types';

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        };
      }
      return { cart: [...state.cart, item] };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cart: state.cart.filter(item => item.id !== itemId)
    }));
  },

  updateCartQuantity: (itemId, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      cart: state.cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  }
}));
