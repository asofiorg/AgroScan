const CACHE_NAME = "agroscan-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/scan.html",
  "/scan.css",
  "/scan.js",
  "/manifest.json",
  "/favicon.ico",
  "/android-icon-36x36.png",
  "/android-icon-48x48.png",
  "/android-icon-72x72.png",
  "/android-icon-96x96.png",
  "/android-icon-144x144.png",
  "/android-icon-192x192.png",
];

const ML_RESOURCES = [
  "/tf.js",
  "/cocoa-disease/model.json",
  "/cocoa-disease/weights.bin",
  "/cocoa-disease/metadata.json"
];

const CACHE_TYPES = {
  static: APP_SHELL,
  ml: ML_RESOURCES
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(APP_SHELL);
      }),
      caches.open(`${CACHE_NAME}-ml`).then(async (cache) => {
        // Cache ML resources one by one to handle large files better
        for (const resource of ML_RESOURCES) {
          try {
            const response = await fetch(resource);
            if (!response.ok) throw new Error(`Failed to fetch ${resource}`);
            await cache.put(resource, response);
          } catch (error) {
            console.error(`Failed to cache ${resource}:`, error);
            // Continue with other resources even if one fails
          }
        }
      })
    ])
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => !cacheName.startsWith(CACHE_NAME))
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (response) => {
      // Check if this is a model resource
      const isMLResource = ML_RESOURCES.some(resource => 
        event.request.url.includes(resource.replace(/^\//, ''))
      );

      // If we have a cached response and it's a model resource, return it
      if (response && isMLResource) {
        return response;
      }

      try {
        const fetchResponse = await fetch(event.request);
        
        // Check if we received a valid response
        if (!fetchResponse || fetchResponse.status !== 200) {
          return fetchResponse;
        }

        // Clone the response
        const responseToCache = fetchResponse.clone();

        // Cache the response in the appropriate cache
        const cacheName = isMLResource ? `${CACHE_NAME}-ml` : CACHE_NAME;
        const cache = await caches.open(cacheName);
        await cache.put(event.request, responseToCache);

        return fetchResponse;
      } catch (error) {
        // If the network is unavailable, try to return any cached response
        if (response) {
          return response;
        }
        throw error;
      }
    })
  );
});
