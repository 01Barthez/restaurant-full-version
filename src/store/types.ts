
// User types
export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  loyaltyPoints: number;
  referralCode?: string;
  referrals?: string[];
  orderHistory?: string[];
}

// Cart and Order types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specialRequests?: string;
  isOffer?: boolean;
  offerItems?: MenuItem[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt: Date;
  estimatedDelivery?: Date;
  specialRequests?: string;
  rating?: number;
  review?: string;
}

// Menu types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  ingredients: string[];
  available: boolean;
  featured: boolean;
  preparationTime: number;
  gallery?: string[];
  dietary?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  averageRating?: number;
  reviewCount?: number;
  stockLevel?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  items: { menuItemId: string; quantity: number }[];
  originalPrice: number;
  discountPrice: number;
  discount: string;
  image: string;
  available: boolean;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  menuItemId?: string;
  orderId?: string;
  rating: number;
  comment: string;
  date: Date;
  helpful?: number;
}

// Activity and Analytics types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  type: 'order' | 'profile' | 'login' | 'register' | 'review';
}

export interface Analytics {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  activeUsers: number;
  popularItems: { name: string; count: number }[];
  customerSegments: {
    new: number;
    regular: number;
    vip: number;
    inactive: number;
  };
}

// Contact and Messages
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
  replied: boolean;
}

// Stock Management
export interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastUpdated: Date;
  menuItemIds: string[];
}
