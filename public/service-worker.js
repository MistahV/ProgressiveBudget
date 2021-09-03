const FILES_TO_CACHE = [
    "/db.js",
    "/index.html",
    "/index.js",
    "/styles.css",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ];
  
const STATIC_CACHE = `static-cache-v1`;
const RUNTIME_CACHE = `runtime-cache`;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache))
    )
});

self.addEventListener('activate', (event) => {
    const Caches = [RUNTIME_CACHE, STATIC_CACHE];
    event.waitUntil(
        caches.keys().then
    )
});

self.addEventListenter('fetch', (event) => {
    if (event.request.url.includes(`/api/transaction`)) {
        event.respondWith(
          caches.open(RUNTIME_CACHE).then((cache) =>
            fetch(event.request)
              .then((response) => {
                cache.put(event.request, response.clone());
                return response;
              })
              .catch(() => caches.match(event.request))
          )
        );
        return;
      }

      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
    
          return caches
            .open(RUNTIME_CACHE)
            .then((cache) =>
              fetch(event.request).then((response) =>
                cache.put(event.request, response.clone()).then(() => response)
              )
            );
        })
      );
});