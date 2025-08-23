
import { CacheDB } from '@/types/global';
import { openDB, IDBPDatabase } from 'idb';

class CacheService {
  private db: IDBPDatabase<CacheDB> | null = null;
  private readonly DB_NAME = 'restaurant-cache';
  private readonly DB_VERSION = 1;

  async init() {
    try {
      this.db = await openDB<CacheDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Store for menu items
          if (!db.objectStoreNames.contains('menuItems')) {
            db.createObjectStore('menuItems', { keyPath: 'id' });
          }
          
          // Store for orders (with sync status)
          if (!db.objectStoreNames.contains('orders')) {
            db.createObjectStore('orders', { keyPath: 'id' });
          }
          
          // Store for cached images
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', { keyPath: 'url' });
          }
          
          // Store for analytics data
          if (!db.objectStoreNames.contains('analytics')) {
            db.createObjectStore('analytics', { keyPath: 'id' });
          }
        },
      });
      console.log('Cache service initialized');
    } catch (error) {
      console.error('Failed to initialize cache service:', error);
    }
  }

  // Generic cache methods
  async set<T>(store: keyof CacheDB, key: string, data: T, ttlMs = 3600000) { // 1 hour default
    if (!this.db) await this.init();
    if (!this.db) return;

    const expiresAt = Date.now() + ttlMs;
    
    try {
      await this.db.put(store as any, {
        id: key,
        data,
        timestamp: Date.now(),
        expiresAt,
        synced: true
      });
    } catch (error) {
      console.error(`Failed to cache ${store}:`, error);
    }
  }

  async get<T>(store: keyof CacheDB, key: string): Promise<T | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const cached = await this.db.get(store as any, key);
      
      if (!cached) return null;
      
      // Check if expired
      if (cached.expiresAt && Date.now() > cached.expiresAt) {
        await this.delete(store, key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error(`Failed to get from cache ${store}:`, error);
      return null;
    }
  }

  async delete(store: keyof CacheDB, key: string) {
    if (!this.db) return;
    
    try {
      await this.db.delete(store as any, key);
    } catch (error) {
      console.error(`Failed to delete from cache ${store}:`, error);
    }
  }

  async clear(store: keyof CacheDB) {
    if (!this.db) return;
    
    try {
      await this.db.clear(store as any);
    } catch (error) {
      console.error(`Failed to clear cache ${store}:`, error);
    }
  }

  // Menu items specific methods
  async cacheMenuItems(items: any[]) {
    await this.set('menuItems', 'all', items, 3600000); // 1 hour
  }

  async getCachedMenuItems() {
    return await this.get('menuItems', 'all');
  }

  // Orders specific methods with sync status
  async cacheOrder(order: any, synced = false) {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.put('orders', {
        id: order.id,
        data: order,
        timestamp: Date.now(),
        synced
      });
    } catch (error) {
      console.error('Failed to cache order:', error);
    }
  }

  async getUnsyncedOrders() {
    if (!this.db) await this.init();
    if (!this.db) return [];

    try {
      const allOrders = await this.db.getAll('orders');
      return allOrders.filter(order => !order.synced).map(order => order.data);
    } catch (error) {
      console.error('Failed to get unsynced orders:', error);
      return [];
    }
  }

  async markOrderSynced(orderId: string) {
    if (!this.db) return;
    
    try {
      const order = await this.db.get('orders', orderId);
      if (order) {
        order.synced = true;
        await this.db.put('orders', order);
      }
    } catch (error) {
      console.error('Failed to mark order as synced:', error);
    }
  }

  // Image caching
  async cacheImage(url: string, blob: Blob) {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.put('images', {
        url,
        blob,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to cache image:', error);
    }
  }

  async getCachedImage(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const cached = await this.db.get('images', url);
      return cached?.blob || null;
    } catch (error) {
      console.error('Failed to get cached image:', error);
      return null;
    }
  }
}

export const cacheService = new CacheService();
