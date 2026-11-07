import { expect, test } from "@playwright/test";

test.describe("PWA Service Worker cleanup", () => {
  test("unregisters active service workers and clears caches on boot", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      let unregisters = 0;
      let cacheDeletes = 0;

      const mockRegistration = {
        unregister: async () => {
          unregisters += 1;
          return true;
        },
      } as unknown as ServiceWorkerRegistration;

      const container = {
        getRegistrations: async () => [mockRegistration],
      };

      Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: container,
      });

      const mockCaches = {
        keys: async () => ["workbox-precache-v1", "custom-cache"],
        delete: async () => {
          cacheDeletes += 1;
          return true;
        },
      };

      Object.defineProperty(window, "caches", {
        configurable: true,
        value: mockCaches,
      });

      Object.defineProperties(window, {
        __swUnregisters: { get: () => unregisters },
        __cacheDeletes: { get: () => cacheDeletes },
      });
    });

    await page.goto("/");

    await expect
      .poll(() => page.evaluate(() => window.__swUnregisters))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(() => page.evaluate(() => window.__cacheDeletes))
      .toBeGreaterThanOrEqual(1);
  });
});

declare global {
  interface Window {
    __swUnregisters: number;
    __cacheDeletes: number;
  }
}

