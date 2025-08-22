
import React, { createContext, useContext, useState, useEffect } from 'react';

type RestaurantTheme = 'delice-moderne' | 'classic-bistro' | 'modern-fusion' | 'elegant-fine';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  cream: string;
  gold: string;
}

interface RestaurantThemeConfig {
  name: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  gradients: {
    primary: string;
    secondary: string;
  };
}

const themes: Record<RestaurantTheme, RestaurantThemeConfig> = {
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

interface ThemeContextType {
  currentTheme: RestaurantTheme;
  setTheme: (theme: RestaurantTheme) => void;
  themeConfig: RestaurantThemeConfig;
  availableThemes: { key: RestaurantTheme; name: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: RestaurantTheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'delice-moderne' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<RestaurantTheme>(defaultTheme);

  const setTheme = (theme: RestaurantTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('restaurant-theme', theme);
    applyTheme(theme);
  };

  const applyTheme = (theme: RestaurantTheme) => {
    const themeConfig = themes[theme];
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--restaurant-${key}`, value);
    });

    // Apply font families
    root.style.setProperty('--font-heading', themeConfig.fonts.heading);
    root.style.setProperty('--font-body', themeConfig.fonts.body);
  };

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('restaurant-theme') as RestaurantTheme;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(defaultTheme);
    }
  }, [defaultTheme]);

  const availableThemes = Object.keys(themes).map(key => ({
    key: key as RestaurantTheme,
    name: themes[key as RestaurantTheme].name
  }));

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themeConfig: themes[currentTheme],
    availableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
