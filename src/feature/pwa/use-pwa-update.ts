import { useCallback, useEffect, useMemo, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { PWA_UPDATE_CHECK_INTERVAL_MS } from "./config";
import type { PwaUpdateOptions, PwaUpdateState } from "./types";

export function usePwaUpdate(options: PwaUpdateOptions = {}): PwaUpdateState {
  const {
    immediate = true,
    updateCheckIntervalMs = PWA_UPDATE_CHECK_INTERVAL_MS,
    ...registerOptions
  } = options;

  const [isUpdating, setIsUpdating] = useState(false);

  // Setup a global controllerchange listener as a bulletproof way to reload the page
  // whenever a new service worker becomes active (e.g. from prompt click or page refresh).
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate,
    onRegisteredSW(_swScriptUrl, registration) {
      if (!registration) {
        return;
      }

      // If there is already a waiting service worker when the page registers/loads,
      // it means the user refreshed/reloaded the app. We skip waiting and activate it immediately.
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      if (updateCheckIntervalMs === false) {
        return;
      }

      const intervalId = window.setInterval(() => {
        void registration.update();
      }, updateCheckIntervalMs);

      return () => window.clearInterval(intervalId);
    },
    ...registerOptions,
  });

  const update = useCallback(async () => {
    setIsUpdating(true);
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  const close = useCallback(() => {
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  return useMemo(
    () => ({
      needRefresh,
      status: isUpdating ? "updating" : needRefresh ? "available" : "idle",
      update,
      close,
    }),
    [close, needRefresh, isUpdating, update],
  );
}
