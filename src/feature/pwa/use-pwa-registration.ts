import { useEffect } from "react";

import { PWA_UPDATE_CHECK_INTERVAL_MS } from "./config";
import { checkForPwaUpdate, registerPwaWorker } from "./services/pwa-worker";

export function usePwaRegistration(): void {
  useEffect(() => {
    let registration: ServiceWorkerRegistration | null = null;

    const synchronizeWorker = async (checkForUpdate: boolean) => {
      try {
        registration ??= await registerPwaWorker();
        if (checkForUpdate && registration) {
          await checkForPwaUpdate(registration);
        }
      } catch {
        registration = null;
      }
    };
    const synchronizeWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void synchronizeWorker(true);
      }
    };

    void synchronizeWorker(false);
    const intervalId = window.setInterval(
      () => void synchronizeWorker(true),
      PWA_UPDATE_CHECK_INTERVAL_MS,
    );
    window.addEventListener("online", synchronizeWhenVisible);
    document.addEventListener("visibilitychange", synchronizeWhenVisible);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("online", synchronizeWhenVisible);
      document.removeEventListener("visibilitychange", synchronizeWhenVisible);
    };
  }, []);
}
