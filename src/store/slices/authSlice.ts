
import { ActivityLog, AuthSlice, User } from '@/types/global';
import { StateCreator } from 'zustand';

export const createAuthSlice: StateCreator<
  AuthSlice & { addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void },
  [],
  [],
  AuthSlice
> = (set, get) => ({
  currentUser: null,
  
  login: (credentials) => {
    // Check for demo user
    if (credentials.name === 'demo' && credentials.password === 'demo123') {
      const demoUser: User = {
        id: 'demo-user-001',
        name: 'Jean Démo',
        phone: '0123456789',
        email: 'jean.demo@example.com',
        createdAt: new Date(Date.now() - 86400000 * 90),
        loyaltyPoints: 350
      };
      
      set({ currentUser: demoUser });
      
      get().addActivityLog({
        userId: demoUser.id,
        action: 'login',
        description: 'Demo user logged in successfully',
        type: 'login'
      });
      
      return true;
    }
    
    // Regular login logic
    const loginUser: User = {
      id: credentials.name === 'admin' ? 'admin-user' : `user-${Date.now()}`,
      name: credentials.name,
      phone: credentials.phone,
      email: credentials.email,
      createdAt: new Date(),
      loyaltyPoints: 50
    };
    
    set({ currentUser: loginUser });
    
    get().addActivityLog({
      userId: loginUser.id,
      action: 'login',
      description: 'User logged in successfully',
      type: 'login'
    });
    
    return true;
  },

  register: (userData) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      createdAt: new Date(),
      loyaltyPoints: 50 // Welcome bonus
    };
    
    set({ currentUser: newUser });
    
    get().addActivityLog({
      userId: newUser.id,
      action: 'register',
      description: 'New user account created - Welcome bonus: 50 points',
      type: 'register'
    });
    
    return true;
  },

  logout: () => {
    const currentUser = get().currentUser;
    if (currentUser) {
      get().addActivityLog({
        userId: currentUser.id,
        action: 'logout',
        description: 'User logged out',
        type: 'login'
      });
    }
    set({ currentUser: null });
  }
});
