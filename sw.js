// CACHE_NAME is replaced at build time (see the GitHub Actions workflow) with a value
// unique to that specific build, so every new deployment automatically invalidates
// whatever was cached from the last one — no manual version bump needed.
const CACHE_NAME = "money-ledger-__BUILD_ID__";

// Core app-shell files, cached immediately on install.
const APP_SHELL = [
  "./",
  "./index.html",
  "./bundle.js",
  "./storage.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first for the app's own files, so a new deployment is picked up on the very
// next load instead of waiting on cache invalidation. Falls back to cache only when
// offline. CDN dependencies (React, Recharts, etc.) rarely change and are safe to
// keep cache-first, so they don't cost a network round-trip on every load.
const APP_FILES = ["/", "/index.html", "/bundle.js", "/storage.js"];

function isAppFile(pathname) {
  return APP_FILES.some((f) => pathname === f || pathname.endsWith(f));
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && isAppFile(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Everything else (icons, manifest, CDN libraries): cache-first, since these change rarely.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
