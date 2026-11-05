import { useEffect, useState, useSyncExternalStore } from "react";

interface ReadySource {
  state: { initialized: boolean };
  subscribe: (listener: () => void) => () => void;
}

/**
 * True once the router finished its first load and `minMs` have passed since
 * the splash was `armed` (for the 3D fight: since its first frame).
 */
export function useAppReady(
  source: ReadySource,
  minMs: number,
  armed: boolean,
) {
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

  return initialized && waited;
}

function supportsWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
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

/** Whether the live 3D fight should run on this device. */
export function useSceneSupport() {
  const [support] = useState(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return {
      enabled: !reducedMotion && supportsWebGL(),
      lite: document.documentElement.dataset.fx === "lite",
    };
  });
  return support;
}
