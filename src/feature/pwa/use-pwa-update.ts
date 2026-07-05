import { useCallback, useMemo, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { PWA_UPDATE_CHECK_INTERVAL_MS } from "./config";
import type { PwaUpdateOptions, PwaUpdateState } from "./types";

async function clearBrowserCaches() {
  if (!("caches" in window)) {
    return;
  }

  const cacheKeys = await window.caches.keys();

  await Promise.all(
    cacheKeys.map((cacheKey) => window.caches.delete(cacheKey)),
  );
}

export function usePwaUpdate(options: PwaUpdateOptions = {}): PwaUpdateState {
  const {
    immediate = true,
    onNeedReload,
    onNeedRefresh,
    onRegisteredSW,
    updateCheckIntervalMs = PWA_UPDATE_CHECK_INTERVAL_MS,
    ...registerOptions
  } = options;

  const [isUpdating, setIsUpdating] = useState(false);
  const [needReload, setNeedReload] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate,
    onNeedRefresh,
    onNeedReload() {
      setNeedReload(true);
      onNeedReload?.();
    },
    onRegisteredSW(swScriptUrl, registration) {
      onRegisteredSW?.(swScriptUrl, registration);

      if (!registration || updateCheckIntervalMs === false) {
        return;
      }

      const intervalId = window.setInterval(() => {
        void registration.update();
      }, updateCheckIntervalMs);

      return () => window.clearInterval(intervalId);
    },
    ...registerOptions,
  });

  const isUpdateAvailable = needRefresh || needReload;

  const update = useCallback(async () => {
    setIsUpdating(true);
    await clearBrowserCaches();

    if (needReload) {
      window.location.reload();
      return;
    }

    await updateServiceWorker(true);
  }, [needReload, updateServiceWorker]);

  const close = useCallback(() => {
    setNeedRefresh(false);
    setNeedReload(false);
  }, [setNeedRefresh]);

  return useMemo(
    () => ({
      needRefresh: isUpdateAvailable,
      status: isUpdating
        ? "updating"
        : isUpdateAvailable
          ? "available"
          : "idle",
      update,
      close,
    }),
    [close, isUpdateAvailable, isUpdating, update],
  );
}
