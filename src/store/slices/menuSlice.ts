
import { StateCreator } from 'zustand';
import { MenuItem, Category } from '@/store/types';

export interface MenuSlice {
  menuItems: MenuItem[];
  categories: Category[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const createMenuSlice: StateCreator<MenuSlice, [], [], MenuSlice> = (set) => ({
  menuItems: [],
  categories: [],
  
  addMenuItem: (item) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    set((state) => ({ menuItems: [...state.menuItems, newItem] }));
  },
  
  updateMenuItem: (id, updates) => {
    set((state) => ({
      menuItems: state.menuItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },
  
  deleteMenuItem: (id) => {
    set((state) => ({
      menuItems: state.menuItems.filter(item => item.id !== id)
    }));
  },
  
  addCategory: (category) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    set((state) => ({ categories: [...state.categories, newCategory] }));
  },
  
  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map(cat =>
        cat.id === id ? { ...cat, ...updates } : cat
      )
    }));
  },
  
  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(cat => cat.id !== id)
    }));
  }
});
