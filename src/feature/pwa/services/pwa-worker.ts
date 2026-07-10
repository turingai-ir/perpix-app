import { PWA_SERVICE_WORKER_URL } from "../config";

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null =
  null;

export function registerPwaWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return Promise.resolve(null);

  registrationPromise ??= navigator.serviceWorker
    .register(PWA_SERVICE_WORKER_URL, {
      scope: "/",
      updateViaCache: "none",
    })
    .catch((error: unknown) => {
      registrationPromise = null;
      throw error;
    });
  return registrationPromise;
}

export async function checkForPwaUpdate(
  registration: ServiceWorkerRegistration,
): Promise<void> {
  if (!navigator.onLine || registration.installing) return;

  const response = await fetch(PWA_SERVICE_WORKER_URL, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });
  if (response.ok) await registration.update();
}
