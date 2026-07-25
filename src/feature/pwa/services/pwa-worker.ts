export async function unregisterPwaWorker(): Promise<void> {
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch {
      // Ignore unregistration errors
    }
  }

  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    } catch {
      // Ignore cache deletion errors
    }
  }
}

