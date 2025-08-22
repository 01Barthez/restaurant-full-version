
import { StateCreator } from 'zustand';
import { websocketService } from '@/services/websocket/WebSocketService';

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

export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/placeholder.svg',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });
    }
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter(notif => notif.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  initializeNotificationWebSocket: () => {
    websocketService.on('notification', (data) => {
      get().addNotification(data);
    });

    websocketService.on('order_update', (data) => {
      get().addNotification({
        type: 'order',
        title: 'Mise à jour de commande',
        message: `Votre commande #${data.orderId} est maintenant ${data.status}`,
        priority: 'normal',
        actionUrl: `/user/${data.userId}/orders/${data.orderId}`
      });
    });
  },

  disconnectNotificationWebSocket: () => {
    // WebSocket service handles cleanup
  }
});
