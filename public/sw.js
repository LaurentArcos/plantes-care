// SW très simple: cache statique + offline fallback.
const CACHE = "plantes-cache-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([
      "/",
      "/manifest.json",
      "/favicon.ico"
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    (async () => {
      try {
        const net = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, net.clone()).catch(() => {});
        return net;
      } catch {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        return cached || cache.match(OFFLINE_URL);
      }
    })()
  );
});
