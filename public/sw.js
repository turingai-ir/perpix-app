/* Kill-switch service worker.
 * The app no longer ships a service worker. Browsers that still have the old
 * Workbox worker will fetch this file (served with no-store), install it, and
 * it removes every cache, unregisters itself and reloads open tabs so users
 * get the latest version. Safe to delete after a few weeks.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        if ("navigate" in client) client.navigate(client.url);
      });
    })(),
  );
});

// Never answer from cache: always go to the network.
self.addEventListener("fetch", () => {});
