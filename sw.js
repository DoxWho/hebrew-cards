// ============================================================
// sw.js — Service Worker for Hebrew Learning Cards PWA
// Implements a Cache-First strategy for app shell assets,
// and a Network-First strategy for Google Fonts.
// ============================================================

const CACHE_VERSION = 'hebrew-cards-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  // Vite/CRA build outputs — update these to match your actual build filenames
  // The service worker will cache whatever is listed here on install
  './assets/index.js',
  './assets/index.css',
];

const FONT_CACHE = 'hebrew-fonts-v1';
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// ── Install ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL);
    }).catch((err) => {
      // Non-fatal: continue even if some shell assets fail (dev mode)
      console.warn('[SW] Pre-cache partial failure:', err);
    })
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== FONT_CACHE)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Fonts — Stale-While-Revalidate
  if (FONT_ORIGINS.some((origin) => url.origin === new URL(origin).origin)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // App Shell — Cache First, fallback to network
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      }).catch(() => {
        // Offline fallback — return cached index.html for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
    );
  }
});

// ── Background Sync (mastery score persistence) ────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mastery') {
    console.log('[SW] Background sync: mastery scores');
    // In a real app, POST mastery data to your backend here
  }
});
