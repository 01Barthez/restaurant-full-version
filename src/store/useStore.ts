import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User,
  CartItem,
  Category,
  ActivityLog,
  Analytics,
  MenuItem
} from '@/types/global';

type Offer = {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  available: boolean;
  items: Array<{ menuItemId: string; quantity: number }>;
  originalPrice: number;
  discountPrice: number;
};
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createCartSlice, CartSlice } from './slices/cartSlice';
import { createReviewSlice, ReviewSlice } from './slices/reviewSlice';
import { createMenuSlice, MenuSlice } from './slices/menuSlice';
import { createOrderSlice, OrderSlice } from './slices/orderSlice';


const useStore = create<AppState>()(
  persist(
    (set, get, store) => ({
      // Theme and Language
      isDarkMode: typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
      currentLanguage: 'fr',
      
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        // Save preference to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('darkMode', String(newMode));
        }
        return { isDarkMode: newMode };
      }),
      
      setLanguage: (lang) => {
        set({ currentLanguage: lang });
      },

      // Include all slices
      ...createAuthSlice(set, get, store),
      ...createCartSlice(set, get, store),
      ...createReviewSlice(set, get, store),
      ...createMenuSlice(set, get, store),
      ...createOrderSlice(set, get, store),

      // Enhanced user management
      users: [],

      updateUserLoyaltyPoints: (userId, pointsToAdd) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId 
              ? { ...user, loyaltyPoints: user.loyaltyPoints + pointsToAdd }
              : user
          ),
          currentUser: state.currentUser?.id === userId 
            ? { ...state.currentUser, loyaltyPoints: state.currentUser.loyaltyPoints + pointsToAdd }
            : state.currentUser
        }));
      },

      sendMessageToUser: (userId, message) => {
        get().addActivityLog({
          userId: userId,
          action: 'admin_message',
          description: `Admin message: ${message}`,
          type: 'profile'
        });
      },

      createDemoUser: () => {
        // Implementation in auth slice
      },

      // Offers management
      offers: [],
      
      addOffer: (offer) => {
        const newOffer: Offer = {
          ...offer,
          id: `offer-${Date.now()}`
        };
        set((state) => ({ offers: [...state.offers, newOffer] }));
      },
      
      updateOffer: (id, updates) => {
        set((state) => ({
          offers: state.offers.map(offer =>
            offer.id === id ? { ...offer, ...updates } : offer
          )
        }));
      },
      
      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter(offer => offer.id !== id)
        }));
      },

      // Enhanced activity tracking
      activityLogs: [],
      
      addActivityLog: (logData) => {
        const newLog: ActivityLog = {
          ...logData,
          id: `log-${Date.now()}`,
          timestamp: new Date()
        };
        
        set((state) => ({
          activityLogs: [...state.activityLogs, newLog]
        }));
      },

      // Contact messages management
      contactMessages: [],
      
      addContactMessage: (messageData) => {
        const newMessage = {
          ...messageData,
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
          read: false
        };
        
        set((state) => ({
          contactMessages: [...state.contactMessages, newMessage]
        }));
      },
      
      markMessageAsRead: (messageId) => {
        set((state) => ({
          contactMessages: state.contactMessages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
      },

      // Enhanced analytics
      analytics: {
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        activeUsers: 0,
        popularItems: [],
        customerSegments: {
          new: 0,
          regular: 0,
          vip: 0,
          inactive: 0
        }
      },

      calculateDashboardStats: () => {
        const orders = get().orders;
        const users = get().users;
        const now = new Date();
        
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const deliveredOrders = orders.filter(order => order.status === 'delivered');
        
        const dailyRevenue = deliveredOrders
          .filter(order => new Date(order.createdAt) >= oneDayAgo)
          .reduce((sum, order) => sum + order.total, 0);
          
        const weeklyRevenue = deliveredOrders
          .filter(order => new Date(order.createdAt) >= oneWeekAgo)
          .reduce((sum, order) => sum + order.total, 0);
          
        const monthlyRevenue = deliveredOrders
          .filter(order => new Date(order.createdAt) >= oneMonthAgo)
          .reduce((sum, order) => sum + order.total, 0);

        const itemCounts: { [key: string]: { name: string; count: number } } = {};
        deliveredOrders.forEach(order => {
          order.items.forEach(item => {
            if (itemCounts[item.name]) {
              itemCounts[item.name].count += item.quantity;
            } else {
              itemCounts[item.name] = { name: item.name, count: item.quantity };
            }
          });
        });
        
        const popularItems = Object.values(itemCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const activeUsers = users.filter(user => {
          const hasRecentOrder = orders.some(order => 
            order.userId === user.id && 
            new Date(order.createdAt) >= oneMonthAgo
          );
          return hasRecentOrder;
        }).length;

        const customerSegments = {
          new: 0,
          regular: 0,
          vip: 0,
          inactive: 0
        };

        users.forEach(user => {
          const userOrders = orders.filter(order => order.userId === user.id);
          const recentOrders = userOrders.filter(order => 
            new Date(order.createdAt) >= oneMonthAgo
          );

          if (userOrders.length === 0) {
            customerSegments.new++;
          } else if (recentOrders.length === 0) {
            customerSegments.inactive++;
          } else if (user.loyaltyPoints > 500) {
            customerSegments.vip++;
          } else {
            customerSegments.regular++;
          }
        });

        const analytics = {
          dailyRevenue,
          weeklyRevenue,
          monthlyRevenue,
          totalOrders: orders.length,
          activeUsers,
          popularItems,
          customerSegments
        };

        set({ analytics });
        return analytics;
      },

      // Initialize test data
      initializeTestData: async () => {
        // Importer les données complètes depuis menuItems.data.ts de manière asynchrone
        const { menuItems: fullMenuItems } = await import('@/data/menuItems.data');
        
        // Mapper les données pour correspondre à l'interface MenuItem complète
        const testMenuItems = fullMenuItems.map((item: MenuItem) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          images: [item.image],
          category: item.category,
          ingredients: item.ingredients || [],
          available: item.available !== false, // Par défaut à true si non spécifié
          featured: item.featured || false,
          preparationTime: item.preparationTime || 15,
          dietary: item.dietary || [],
          nutritionalInfo: item.nutritionalInfo || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          },
          gallery: item.gallery || [],
          averageRating: item.averageRating,
          reviewCount: item.reviewCount,
          stockLevel: item.stockLevel
        }));

        const testCategories: Category[] = [
          {
            id: 'appetizers',
            name: 'Entrées',
            description: 'Nos délicieuses entrées',
            image: '/placeholder.svg'
          },
          {
            id: 'mains',
            name: 'Plats Principaux',
            description: 'Nos plats principaux signature',
            image: '/placeholder.svg'
          },
          {
            id: 'desserts',
            name: 'Desserts',
            description: 'Nos desserts maison',
            image: '/placeholder.svg'
          }
        ];

        // Mettre à jour le store avec les nouvelles données de test
        set({
          menuItems: testMenuItems,
          categories: testCategories
        });
        
        console.log('Test data initialized with', testMenuItems.length, 'menu items and', testCategories.length, 'categories');
      },

      // Utility functions
      scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }),
    {
      name: 'restaurant-app-storage',
      // Load dark mode from localStorage on initial load
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const savedMode = localStorage.getItem('darkMode') === 'true';
          if (savedMode !== state.isDarkMode) {
            state.isDarkMode = savedMode;
            const root = window.document.documentElement;
            if (savedMode) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }
        }
      },
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        currentLanguage: state.currentLanguage,
        currentUser: state.currentUser,
        cart: state.cart,
        orders: state.orders,
        users: state.users,
        menuItems: state.menuItems,
        categories: state.categories,
        offers: state.offers,
        activityLogs: state.activityLogs,
        contactMessages: state.contactMessages,
        reviews: state.reviews
      })
    }
  )
);

export default useStore;
