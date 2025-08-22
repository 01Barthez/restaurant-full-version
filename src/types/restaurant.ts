
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'plats' | 'boissons' | 'desserts' | 'supplements';
  preparationTime: number;
  ingredients: string[];
  available: boolean;
  featured: boolean;
  gallery?: string[];
  dietary?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered';
  customerName: string;
  customerPhone: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialRequests?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  fullDescription: string;
  capacity: number;
  terrace: number;
  parking: boolean;
  accessible: boolean;
  images: string[];
  specialties: string[];
  coordinates: Coordinates;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
