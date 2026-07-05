import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const getMobileSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia(MOBILE_MEDIA_QUERY).matches;

const getServerMobileSnapshot = () => false;

const subscribeToMobileChange = (onStoreChange: () => void) => {
  const mql = window.matchMedia(MOBILE_MEDIA_QUERY);

  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
};

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobileChange,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
}
