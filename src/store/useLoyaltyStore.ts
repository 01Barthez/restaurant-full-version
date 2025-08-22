
import { create } from 'zustand';
import { User } from './types';

interface LoyaltyState {
  calculatePointsEarned: (orderTotal: number, user: User) => number;
  getUserTier: (points: number) => string;
  getTierMultiplier: (tier: string) => number;
  getAnciennyBonus: (user: User) => number;
}

export const useLoyaltyStore = create<LoyaltyState>(() => ({
  calculatePointsEarned: (orderTotal: number, user: User) => {
    const basePoints = Math.floor(orderTotal); // 1 point per euro
    const tier = useLoyaltyStore.getState().getUserTier(user.loyaltyPoints);
    const multiplier = useLoyaltyStore.getState().getTierMultiplier(tier);
    const anciennyBonus = useLoyaltyStore.getState().getAnciennyBonus(user);
    
    let bonusPoints = 0;
    
    // Order size bonuses (be conservative with rewards)
    if (orderTotal >= 50) bonusPoints += 5;
    if (orderTotal >= 100) bonusPoints += 15; // Total 20 for 100+
    if (orderTotal >= 200) bonusPoints += 30; // Total 50 for 200+
    
    const totalPoints = Math.floor((basePoints + bonusPoints) * multiplier * (1 + anciennyBonus));
    return totalPoints;
  },

  getUserTier: (points: number) => {
    if (points >= 5000) return 'Platine';
    if (points >= 1500) return 'Or';
    if (points >= 500) return 'Argent';
    return 'Bronze';
  },

  getTierMultiplier: (tier: string) => {
    switch (tier) {
      case 'Platine': return 2.0;
      case 'Or': return 1.5;
      case 'Argent': return 1.2;
      default: return 1.0;
    }
  },

  getAnciennyBonus: (user: User) => {
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const monthsOld = accountAge / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsOld >= 12) return 0.20; // 20% bonus after 1 year
    if (monthsOld >= 6) return 0.10;  // 10% bonus after 6 months
    return 0;
  }
}));
