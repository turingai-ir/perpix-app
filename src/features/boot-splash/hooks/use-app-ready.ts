import { useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ReadySource {
  state: { initialized: boolean };
  subscribe: (listener: () => void) => () => void;
}

/**
 * Wait for the initial route and observed shell-blocking queries, not background
 * refetches or decorative assets. `minMs` only controls the entrance duration.
 */
export function useAppReady(
  source: ReadySource,
  minMs: number,
  armed: boolean,
) {
  const cache = useQueryClient().getQueryCache();
  const shellPending = useSyncExternalStore(
    (notify) => cache.subscribe(() => notify()),
    () =>
      cache
        .getAll()
        .some(
          (query) =>
            query.meta?.bootBlocking === true &&
            query.getObserversCount() > 0 &&
            query.state.status === "pending",
        ),
  );
  const initialized = useSyncExternalStore(
    (notify) => source.subscribe(notify),
    () => source.state.initialized,
  );
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setWaited(true), minMs);
    return () => window.clearTimeout(timer);
  }, [minMs, armed]);

  return initialized && waited && !shellPending;
}

export const SPLASH_OPT_IN_KEY = "perpix:boot-splash";

/**
 * Automated browsers skip the splash so E2E suites are not delayed or
 * blocked by it; a test opts back in with `localStorage[SPLASH_OPT_IN_KEY]`.
 */
export function shouldShowSplash() {
  if (!navigator.webdriver) return true;
  try {
    return window.localStorage.getItem(SPLASH_OPT_IN_KEY) === "on";
  } catch {
    return false;
  }
}
