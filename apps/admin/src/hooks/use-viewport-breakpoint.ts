import { useSyncExternalStore } from "react";

export const BREAKPOINTS = {
  sm: "(min-width: 40rem)",
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
  xl: "(min-width: 80rem)",
  "2xl": "(min-width: 96rem)",
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

let lastMatches: Record<BreakpointKey, boolean> | null = null;

export function getViewportBreakpoints(): Record<BreakpointKey, boolean> {
  if (typeof window === "undefined") {
    return {
      sm: false,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    };
  }

  const sm = window.matchMedia(BREAKPOINTS.sm).matches;
  const md = window.matchMedia(BREAKPOINTS.md).matches;
  const lg = window.matchMedia(BREAKPOINTS.lg).matches;
  const xl = window.matchMedia(BREAKPOINTS.xl).matches;
  const xxl = window.matchMedia(BREAKPOINTS["2xl"]).matches;

  if (
    lastMatches &&
    lastMatches.sm === sm &&
    lastMatches.md === md &&
    lastMatches.lg === lg &&
    lastMatches.xl === xl &&
    lastMatches["2xl"] === xxl
  ) {
    return lastMatches;
  }

  lastMatches = { sm, md, lg, xl, "2xl": xxl };
  return lastMatches;
}

const getServerSnapshots = () => ({
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
});

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};

  const cleanups = Object.values(BREAKPOINTS).map((query) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};

export function useViewportBreakpoint() {
  return useSyncExternalStore(
    subscribe,
    getViewportBreakpoints,
    getServerSnapshots,
  );
}
