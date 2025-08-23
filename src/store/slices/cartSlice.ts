
import { ActivityLog, CartSlice } from '@/types/global';
import { StateCreator } from 'zustand';


export const createCartSlice: StateCreator<
  CartSlice & { 
    currentUser: { id: string } | null;
    addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  },
  [],
  [],
  CartSlice
> = (set, get) => ({
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

    const currentUser = get().currentUser;
    if (currentUser) {
      get().addActivityLog({
        userId: currentUser.id,
        action: 'add_to_cart',
        description: `Added ${item.name} to cart`,
        type: 'order'
      });
    }
  },

  removeFromCart: (itemId) => {
    const currentUser = get().currentUser;
    const item = get().cart.find(i => i.id === itemId);
    
    set((state) => ({
      cart: state.cart.filter(item => item.id !== itemId)
    }));

    if (currentUser && item) {
      get().addActivityLog({
        userId: currentUser.id,
        action: 'remove_from_cart',
        description: `Removed ${item.name} from cart`,
        type: 'order'
      });
    }
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
    const currentUser = get().currentUser;
    if (currentUser && get().cart.length > 0) {
      get().addActivityLog({
        userId: currentUser.id,
        action: 'clear_cart',
        description: 'Cart cleared',
        type: 'order'
      });
    }
    set({ cart: [] });
  }
});
