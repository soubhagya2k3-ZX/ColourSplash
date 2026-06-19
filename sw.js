/**
 * ColourSplash Studio Service Worker
 *
 * Strategy:
 *  - App shell: cache-first with network fallback (instant repeat-visit loads)
 *  - HTML documents: network-first (always get the latest deploy)
 *  - Static assets (js/css/images/fonts): stale-while-revalidate
 *  - Firestore / API: never cached
 */

const VERSION = 'v1.0.0';
const SHELL_CACHE = `cs-shell-${VERSION}`;
const RUNTIME_CACHE = `cs-runtime-${VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

const isApiRequest = (url) =>
  url.hostname.endsWith('googleapis.com') ||
  url.hostname.endsWith('firebaseio.com') ||
  url.pathname.startsWith('/api/');

const isStaticAsset = (req) => {
  const url = new URL(req.url);
  return (
    /\.(?:js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|avif|ico)$/.test(url.pathname) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'images.unsplash.com'
  );
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Firestore / API / cross-origin POSTs
  if (isApiRequest(url)) return;

  // HTML navigation: network-first, fall back to cached shell
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((cached) => cached || Response.error()))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type !== 'opaque') {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
