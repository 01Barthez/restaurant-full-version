import { DBSchema } from "idb";

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

export interface FlowerDishClusterProps {
  images?: string[];
  className?: string;
}

export interface HomePageProps {
  onMenuClick: () => void;
  onItemSelect: (itemId: string) => void;
  onCategorySelect: (category: string) => void;
}


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

export interface LoyaltyState {
  calculatePointsEarned: (orderTotal: number, user: User) => number;
  getUserTier: (points: number) => string;
  getTierMultiplier: (tier: string) => number;
  getAnciennyBonus: (user: User) => number;
}

export interface AuthSlice {
  currentUser: User | null;
  login: (credentials: { name: string; password: string; phone?: string; email?: string }) => boolean;
  register: (userData: { name: string; phone: string; email?: string; password: string }) => boolean;
  logout: () => void;
}

export interface CartSlice {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

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

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}

export interface NotificationSlice {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;

  // WebSocket integration
  initializeNotificationWebSocket: () => void;
  disconnectNotificationWebSocket: () => void;
}

export interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface AppState extends AuthSlice, CartSlice, ReviewSlice, MenuSlice, OrderSlice {
  // Theme and Language
  isDarkMode: boolean;
  currentLanguage: 'fr' | 'en' | 'ar';
  toggleDarkMode: () => void;
  setLanguage: (lang: 'fr' | 'en' | 'ar') => void;

  // Enhanced user management
  users: User[];
  updateUserLoyaltyPoints: (userId: string, pointsToAdd: number) => void;
  createDemoUser: () => void;
  sendMessageToUser: (userId: string, message: string) => void;

  // Offers management
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;

  // Enhanced activity tracking
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // Contact messages
  contactMessages: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  addContactMessage: (message: { name: string; email: string; message: string }) => void;
  markMessageAsRead: (messageId: string) => void;

  // Enhanced analytics
  analytics: Analytics;
  calculateDashboardStats: () => Analytics;

  // Utility functions
  scrollToTop: () => void;
  initializeTestData: () => void;
}


export interface Review {
  id: string;
  userId: string;
  userName: string;
  menuItemId: string;
  rating: number;
  comment: string;
  date: Date;
  moderated: boolean;
}

export interface ReviewSlice {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'moderated'>) => void;
  getMenuItemReviews: (menuItemId: string) => Review[];
  moderateReview: (reviewId: string, approved: boolean) => void;
}

export interface AuthState {
  currentUser: User | null;
  login: (credentials: { name: string; password: string; phone?: string; email?: string }) => boolean;
  register: (userData: { name: string; phone: string; email?: string; password: string }) => boolean;
  logout: () => void;
}

export interface OrderSlice {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  reorderItems: (order: Order) => void;
}

export interface ReviewAIModerationResult {
  isAcceptable: boolean;
  reason?: string;
  suggestedEdit?: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface LocationValidationResult {
  isValid: boolean;
  distance?: number;
  error?: string;
}

export interface CacheDB extends DBSchema {
  menuItems: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
  orders: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
      synced: boolean;
    };
  };
  images: {
    key: string;
    value: {
      url: string;
      blob: Blob;
      timestamp: number;
    };
  };
  analytics: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
}

export interface AppShortcut {
  name: string;
  short_name: string;
  description: string;
  url: string;
  icons: Array<{
    src: string;
    sizes: string;
  }>;
}

export interface MenuActionsProps {
  item: MenuItem;
  onAddToCart: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export interface MenuInfoProps {
  item: MenuItem;
  averageRating: number;
  reviewCount: number;
}

export interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  distance?: number;
  onRetry: () => void;
}

export interface OffersCarouselProps {
  onOfferSelect?: (offer: any) => void;
}

export interface MenuPageProps {
  onItemSelect: (item: MenuItem) => void;
  selectedCategory?: string;
}

export interface MenuFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  timeFilter: string;
  onTimeFilterChange: (time: string) => void;
  onClearFilters: () => void;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  menuItemId?: string;
  moderated: boolean;
}

export interface ReviewSystemProps {
  menuItemId?: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'moderated'>) => void;
}

export interface PostOrderFeedbackProps {
  orderId: string;
  orderItems: any[];
  onSubmitFeedback: (feedback: any) => void;
  onClose: () => void;
}

export interface ReferralSystemProps {
  userId: string;
  referralCode: string;
  referralsCount: number;
  earnedPoints: number;
}

export interface SmartRecommendationsProps {
  userHistory: string[]; // Array of menu item IDs
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export interface OrderProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalAmount: number;
  isAdminSimulation?: boolean;
}

export type OrderStep = 'auth' | 'location' | 'payment' | 'confirmation';
export type PaymentMethod = 'cash' | 'orange_money' | 'mtn_money' | 'paypal' | 'bank_transfer';

export interface OfferInfoProps {
  offer: Offer;
  items: MenuItem[];
}

export interface OfferGalleryProps {
  images: string[];
  title: string;
}

export interface PDFGeneratorProps {
  data: any;
  filename: string;
  title: string;
}

export interface SearchFilters {
  categories: string[];
  dietary: string[];
  priceRange: [number, number];
  sortBy: 'name' | 'price' | 'rating' | 'popularity';
}

export interface SmartSearchBarProps {
  visible: boolean;
  onSearch: (query: string, filters: SearchFilters) => void;
}

export interface ShareButtonsProps {
  title: string;
  description: string;
  image?: string;
  price?: number;
}

export interface ActivityLogProps {
  logs: ActivityLogType[];
}

export interface RecentOrdersProps {
  orders: Order[];
  userId: string;
  onReorder: (order: Order) => void;
}

export interface UserStatsProps {
  user: User;
  orders: Order[];
}

export interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
}

export interface FeaturedItemsSectionProps {
  onMenuClick: () => void;
  onItemSelect: (itemId: string) => void;
}

export interface HeroSectionProps {
  onMenuClick: () => void;
}

export interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export interface MenuDetailProps {
  item: MenuItem;
  onBack: () => void;
  onOrder: (item: MenuItem) => void;
}
