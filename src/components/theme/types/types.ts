
export type RestaurantTheme = 'delice-moderne' | 'classic-bistro' | 'modern-fusion' | 'elegant-fine';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  cream: string;
  gold: string;
}

export interface RestaurantThemeConfig {
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

export interface ThemeContextType {
  currentTheme: RestaurantTheme;
  setTheme: (theme: RestaurantTheme) => void;
  themeConfig: RestaurantThemeConfig;
  availableThemes: { key: RestaurantTheme; name: string }[];
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: RestaurantTheme;

}

