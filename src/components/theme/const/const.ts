import { RestaurantTheme, RestaurantThemeConfig, ThemeContextType } from "../types/types";
import React, { createContext } from 'react';



export const themes: Record<RestaurantTheme, RestaurantThemeConfig> = {
  'delice-moderne': {
    name: 'Délice Moderne',
    colors: {
      primary: '16 85% 55%',
      secondary: '45 90% 55%',
      accent: '25 95% 50%',
      neutral: '30 8% 20%',
      cream: '45 25% 95%',
      gold: '45 90% 60%'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF6B35 0%, #D32F2F 100%)',
      secondary: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)'
    }
  },
  'classic-bistro': {
    name: 'Bistro Classique',
    colors: {
      primary: '355 78% 45%',
      secondary: '25 85% 55%',
      accent: '45 95% 50%',
      neutral: '20 14% 25%',
      cream: '45 35% 92%',
      gold: '40 85% 65%'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Poppins'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B2635 0%, #D2691E 100%)',
      secondary: 'linear-gradient(135deg, #CD853F 0%, #DEB887 100%)'
    }
  },
  'modern-fusion': {
    name: 'Fusion Moderne',
    colors: {
      primary: '200 85% 45%',
      secondary: '280 75% 55%',
      accent: '320 85% 60%',
      neutral: '220 10% 25%',
      cream: '200 15% 95%',
      gold: '50 90% 65%'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1E88E5 0%, #7B1FA2 100%)',
      secondary: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)'
    }
  },
  'elegant-fine': {
    name: 'Élégance Fine',
    colors: {
      primary: '220 25% 20%',
      secondary: '45 15% 75%',
      accent: '45 95% 55%',
      neutral: '220 15% 15%',
      cream: '45 20% 97%',
      gold: '45 90% 60%'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Poppins'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
      secondary: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)'
    }
  }
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
