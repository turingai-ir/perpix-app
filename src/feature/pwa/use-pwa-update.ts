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
