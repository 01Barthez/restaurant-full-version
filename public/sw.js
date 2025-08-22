const CACHE_NAME = 'delice-moderne-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg'
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/menu',
  '/api/restaurants',
  '/api/offers'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method === 'GET') {
    if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
      // Static assets - cache first
      event.respondWith(cacheFirst(request));
    } else if (CACHEABLE_APIS.some(api => url.pathname.includes(api))) {
      // API requests - network first with cache fallback
      event.respondWith(networkFirst(request));
    } else if (url.pathname.includes('/images/') || url.pathname.includes('unsplash.com')) {
      // Images - cache first with network fallback
      event.respondWith(cacheFirst(request));
    } else {
      // Other requests - network first
      event.respondWith(networkFirst(request));
    }
  }
});

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first failed:', error);
    
    // Return offline fallback if available
    if (request.destination === 'document') {
      return caches.match('/offline.html') || new Response('Offline');
    }
    
    return new Response('Network error', { status: 500 });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network first failed:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline fallback
    if (request.destination === 'document') {
      return caches.match('/offline.html') || new Response('Offline');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline orders, user data, etc.
  try {
    // Implementation for syncing offline data
    console.log('Syncing offline data...');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  let notificationData = {};
  
  if (event.data) {
    notificationData = event.data.json();
  }
  
  const options = {
    body: notificationData.body || 'Nouvelle notification de Le Délice Moderne',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    image: notificationData.image,
    data: notificationData.data,
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/placeholder.svg'
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
        icon: '/placeholder.svg'
      }
    ],
    requireInteraction: true,
    tag: notificationData.tag || 'general'
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Le Délice Moderne',
      options
    )
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to the relevant page
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});
