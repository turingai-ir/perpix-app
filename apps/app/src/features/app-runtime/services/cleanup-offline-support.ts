import { del, keys } from "idb-keyval";

async function removeLegacyOfflineData() {
  const storedKeys = await keys();
  await Promise.all(
    storedKeys
      .filter(
        (key) =>
          typeof key === "string" &&
          (key === "REACT_QUERY_OFFLINE_CACHE" ||
            key.startsWith("file-manager:completion:")),
      )
      .map((key) => del(key)),
  );
}
async function removeWorkers() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );
}
async function removeCaches() {
  if (!("caches" in window)) return;
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
}
/** Cleanup is independent of network access and never blocks application startup. */
export async function cleanupOfflineSupport() {
  await Promise.allSettled([
    removeWorkers(),
    removeCaches(),
    removeLegacyOfflineData(),
  ]);
}
