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
    // event.waitUntil(
    //     caches
    //         .open(STATIC_CACHE)
    //         .then((cache))
    // )
    event.waitUntil(
      caches.open(STATIC_CACHE).then(function(cache) {
        console.log("installing");
        return cache.addAll(FILES_TO_CACHE)
      })
    )
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheList = keyList.filter(function (key) {
          return key.indexOf("static-cache-")
        })

        cacheList.push(STATIC_CACHE);

        return Promise.all(keyList.map(function (key, i) {
          if(cacheList.indexOf(key) === -1) {
            console.log("deleting")
            return caches.delete(keyList[i])
          }
        }))
      })
    )
});

self.addEventListener('fetch', (event) => {
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