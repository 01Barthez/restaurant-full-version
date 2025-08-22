
import { useStore } from 'zustand';
import { useMemo } from 'react';
import useStoreBase from '@/store/useStore';

// Type helper for extracting slice from store
type StoreSlice<T> = (state: ReturnType<typeof useStoreBase.getState>) => T;

// Selective subscription hook
export function useSelectiveStore<T>(selector: StoreSlice<T>): T {
  return useStore(useStoreBase, selector);
}

// Specific selectors for common use cases
export const storeSelectors = {
  // Auth selectors
  currentUser: (state: ReturnType<typeof useStoreBase.getState>) => state.currentUser,
  isAuthenticated: (state: ReturnType<typeof useStoreBase.getState>) => !!state.currentUser,
  
  // Cart selectors
  cartItems: (state: ReturnType<typeof useStoreBase.getState>) => state.cart,
  cartTotal: (state: ReturnType<typeof useStoreBase.getState>) => 
    state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
  cartItemCount: (state: ReturnType<typeof useStoreBase.getState>) => 
    state.cart.reduce((count, item) => count + item.quantity, 0),
  
  // Orders selectors
  userOrders: (userId: string) => (state: ReturnType<typeof useStoreBase.getState>) => 
    state.orders.filter(order => order.userId === userId),
  recentOrders: (limit = 5) => (state: ReturnType<typeof useStoreBase.getState>) =>
    state.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit),
  
  // Menu selectors
  availableMenuItems: (state: ReturnType<typeof useStoreBase.getState>) => 
    state.menuItems.filter(item => item.available),
  menuItemsByCategory: (category: string) => (state: ReturnType<typeof useStoreBase.getState>) =>
    state.menuItems.filter(item => item.category === category && item.available),
  
  // Theme selectors
  isDarkMode: (state: ReturnType<typeof useStoreBase.getState>) => state.isDarkMode,
  currentLanguage: (state: ReturnType<typeof useStoreBase.getState>) => state.currentLanguage,
  
  // Analytics selectors
  analytics: (state: ReturnType<typeof useStoreBase.getState>) => state.analytics,
  
  // Contact messages selectors
  unreadMessages: (state: ReturnType<typeof useStoreBase.getState>) => 
    state.contactMessages.filter(msg => !msg.read),
  messageCount: (state: ReturnType<typeof useStoreBase.getState>) => state.contactMessages.length,
};

// Convenience hooks using the selectors
export const useCurrentUser = () => useSelectiveStore(storeSelectors.currentUser);
export const useIsAuthenticated = () => useSelectiveStore(storeSelectors.isAuthenticated);
export const useCartItems = () => useSelectiveStore(storeSelectors.cartItems);
export const useCartTotal = () => useSelectiveStore(storeSelectors.cartTotal);
export const useCartItemCount = () => useSelectiveStore(storeSelectors.cartItemCount);
export const useIsDarkMode = () => useSelectiveStore(storeSelectors.isDarkMode);
export const useCurrentLanguage = () => useSelectiveStore(storeSelectors.currentLanguage);
export const useAnalytics = () => useSelectiveStore(storeSelectors.analytics);
export const useUnreadMessages = () => useSelectiveStore(storeSelectors.unreadMessages);

// Dynamic selectors
export const useUserOrders = (userId: string) => 
  useSelectiveStore(useMemo(() => storeSelectors.userOrders(userId), [userId]));

export const useMenuItemsByCategory = (category: string) => 
  useSelectiveStore(useMemo(() => storeSelectors.menuItemsByCategory(category), [category]));

export const useRecentOrders = (limit?: number) => 
  useSelectiveStore(useMemo(() => storeSelectors.recentOrders(limit), [limit]));
