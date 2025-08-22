import React, { ReactNode } from 'react';
import { HomeIcon, InfoIcon, MenuIcon, ContactIcon } from './icons';

export interface NavItemType {
  key: string;
  label: string;
  path: string;
  icon: React.ReactElement;
}

export interface NavItemProps {
  item: NavItemType;
  currentPage: string;
  clickedTab: string;
  onClick: (path: string, key: string) => void;
  className?: string;
}

export interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onAdminClick?: () => void;
}

// Create navigation items with proper typing
export const navigationItems: NavItemType[] = [
  {
    key: 'home',
    label: 'Accueil',
    path: '/',
    icon: React.createElement(HomeIcon)
  },
  {
    key: 'about',
    label: 'À Propos',
    path: '/about',
    icon: React.createElement(InfoIcon)
  },
  {
    key: 'menu',
    label: 'Menu',
    path: '/menu',
    icon: React.createElement(MenuIcon)
  },
  {
    key: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: React.createElement(ContactIcon)
  }
];


export interface DesktopNavProps {
  currentPage: string;
  onNavClick: (path: string, key: string) => void;
  showAuthModal: () => void;
}


export interface MobileNavProps {
  currentPage: string;
  onNavClick: (path: string, key: string) => void;
  showAuthModal: () => void;
  clickedTab: string;
}

