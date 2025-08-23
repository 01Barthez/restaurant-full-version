
import { AuthState, User } from '@/types/global';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  
  login: (credentials) => {
    // Simple demo authentication - in real app, this would validate against backend
    const loginUser: User = {
      id: credentials.name === 'demo' ? 'demo-user' : `user-${Date.now()}`,
      name: credentials.name,
      phone: credentials.phone,
      email: credentials.email,
      createdAt: new Date(),
      loyaltyPoints: 50
    };
    
    set({ currentUser: loginUser });
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
    return true;
  },

  logout: () => {
    set({ currentUser: null });
  }
}));
