
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContext, themes } from './const/const';
import { RestaurantTheme, ThemeContextType, ThemeProviderProps } from './types/types';

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
