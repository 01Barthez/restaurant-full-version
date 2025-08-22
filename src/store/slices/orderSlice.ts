
import { StateCreator } from 'zustand';
import { Order } from '@/store/types';

export interface OrderSlice {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  reorderItems: (order: Order) => void;
}

export const createOrderSlice: StateCreator<
  OrderSlice & { addToCart: (item: any) => void; clearCart: () => void; addActivityLog: (log: any) => void },
  [],
  [],
  OrderSlice
> = (set, get) => ({
  orders: [],
  
  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000)
    };
    
    set((state) => ({
      orders: [...state.orders, newOrder]
    }));
    
    get().addActivityLog({
      userId: orderData.userId,
      action: 'create_order',
      description: `New order placed #${newOrder.id.slice(-6)} - ${newOrder.total.toFixed(2)}€`,
      type: 'order'
    });
    
    return newOrder.id;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    }));
  },

  cancelOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      )
    }));
  },

  reorderItems: (order) => {
    get().clearCart();
    order.items.forEach((item) => {
      get().addToCart(item);
    });
  }
});
