
const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Advanced caching strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Cache configurations
const CACHE_CONFIG = {
  static: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 100
  },
  images: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  },
  api: {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  pages: {
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 20
  }
};

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Advanced Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        // Ne pas forcer le skipWaiting pour éviter les rafraîchissements automatiques
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Advanced Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim(),
      // Clean up expired cache entries
      cleanupExpiredCaches()
    ])
  );
});

// Advanced fetch handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Route requests to appropriate strategy
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, CACHE_CONFIG.static));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, CACHE_CONFIG.images));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE, CACHE_CONFIG.api));
  } else if (isPageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, CACHE_CONFIG.pages));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, CACHE_CONFIG.api));
  }
});

// Request classification functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|ico|svg)$/) ||
         STATIC_ASSETS.some(asset => url.pathname === asset);
}

function isImageRequest(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif)$/) ||
         url.hostname.includes('unsplash.com') ||
         url.hostname.includes('images.');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') ||
         url.hostname !== self.location.hostname;
}

function isPageRequest(url) {
  return url.hostname === self.location.hostname &&
         !url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$/);
}

// Cache-first strategy
async function cacheFirst(request, cacheName, config) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached && !isExpired(cached, config.maxAge)) {
      return cached;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), config);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache-first failed:', error);
    return await fallbackResponse(request);
  }
}

// Network-first strategy
async function networkFirst(request, cacheName, config) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await putInCache(cache, request, networkResponse.clone(), config);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network-first failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    return await fallbackResponse(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName, config) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Start network request in background
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), config);
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cached) {
    return cached;
  }
  
  // Wait for network if no cache
  try {
    const networkResponse = await networkResponsePromise;
    return networkResponse || await fallbackResponse(request);
  } catch (error) {
    return await fallbackResponse(request);
  }
}

// Enhanced cache management
async function putInCache(cache, request, response, config) {
  // Check cache size limits
  await enforceMaxEntries(cache, config.maxEntries);
  
  // Add expiration metadata
  const responseWithExpiry = addExpirationHeaders(response, config.maxAge);
  await cache.put(request, responseWithExpiry);
}

async function enforceMaxEntries(cache, maxEntries) {
  const keys = await cache.keys();
  
  if (keys.length >= maxEntries) {
    // Remove oldest entries
    const entriesToRemove = keys.slice(0, keys.length - maxEntries + 1);
    await Promise.all(entriesToRemove.map(key => cache.delete(key)));
  }
}

function addExpirationHeaders(response, maxAge) {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-timestamp', Date.now().toString());
  headers.set('sw-cache-max-age', maxAge.toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function isExpired(response, maxAge) {
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (!timestamp) return false;
  
  const age = Date.now() - parseInt(timestamp);
  return age > maxAge;
}

async function fallbackResponse(request) {
  if (request.destination === 'document') {
    const cache = await caches.open(STATIC_CACHE);
    return await cache.match('/offline.html') || new Response('Offline', { status: 503 });
  }
  
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#999">Image non disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Service Unavailable', { status: 503 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'orders-sync') {
    event.waitUntil(syncOrders());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncOrders() {
  try {
    const db = await openDB();
    const unsyncedOrders = await getUnsyncedOrders(db);
    
    for (const order of unsyncedOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          await markOrderSynced(db, order.id);
          console.log('Order synced:', order.id);
        }
      } catch (error) {
        console.error('Failed to sync order:', order.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncAnalytics() {
  // Sync analytics data when back online
  console.log('Syncing analytics data...');
}

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {
    title: 'Le Délice Moderne',
    body: 'Nouvelle notification',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    tag: 'general',
    data: {}
  };
  
  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      console.error('Failed to parse push data:', error);
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    data: notificationData.data,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction || false,
    actions: notificationData.actions || [
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
    vibrate: [200, 100, 200],
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    const urlToOpen = data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.navigate(urlToOpen);
              return client.focus();
            }
          }
          
          // Open new window if app not open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  } else if (action === 'dismiss') {
    // Handle dismiss action
    console.log('Notification dismissed');
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    console.log('Performance metrics:', event.data.metrics);
    // Send to analytics endpoint
  }
});

// Enhanced cache cleanup
async function cleanupExpiredCaches() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const cachedDate = response.headers.get('sw-cache-date');
        const cacheType = getCacheType(key.url);
        const maxAge = CACHE_CONFIG.maxAge[cacheType] || CACHE_CONFIG.maxAge.dynamic;
        
        if (cachedDate && Date.now() - new Date(cachedDate).getTime() > maxAge) {
          console.log('Removing expired cache entry:', key.url);
          await cache.delete(key);
        }
      }
    }
  }
}

function getCacheType(url) {
  if (url.includes('/api/')) return 'api';
  if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) return 'images';
  if (url.includes('/static/')) return 'static';
  return 'dynamic';
}

// Enhanced image optimization
async function optimizeImageResponse(response, request) {
  const url = new URL(request.url);
  const isSlowConnection = request.headers.get('connection-type') === 'slow';
  
  if (isSlowConnection && response.ok) {
    // Pour les connexions lentes, on peut implémenter une compression côté service worker
    const responseClone = response.clone();
    const headers = new Headers(responseClone.headers);
    headers.set('Cache-Control', 'max-age=2592000'); // 30 jours pour les images
    
    return new Response(responseClone.body, {
      status: responseClone.status,
      statusText: responseClone.statusText,
      headers
    });
  }
  
  return response;
}

// Error handling and reporting
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
  // Report to error tracking service
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled promise rejection:', event.reason);
  // Report to error tracking service
});

console.log('Advanced Service Worker loaded successfully');
