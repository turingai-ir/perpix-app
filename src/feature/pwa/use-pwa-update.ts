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
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Setup a global controllerchange listener to reload the page when the new SW becomes active.
  // We use sessionStorage to ensure ONLY the tab that clicked "Update" reloads,
  // preventing sudden reloads in other tabs where the user might be in the middle of an operation.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      if (sessionStorage.getItem("pwa-update-initiated") === "true") {
        refreshing = true;
        sessionStorage.removeItem("pwa-update-initiated");
        window.location.reload();
      }
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

  useEffect(() => {
    if (!registration || updateCheckIntervalMs === false) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void registration.update();
    }, updateCheckIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [registration, updateCheckIntervalMs]);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate,
    onRegisteredSW(_swScriptUrl, reg) {
      if (!reg) {
        return;
      }

      setRegistration(reg);
    },
    ...registerOptions,
  });

  const update = useCallback(async () => {
    setIsUpdating(true);
    sessionStorage.setItem("pwa-update-initiated", "true");
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
