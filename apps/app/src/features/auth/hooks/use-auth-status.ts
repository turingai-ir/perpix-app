import { useSyncExternalStore } from "react";

import { sessionStore } from "../services/session-store";

export const useAuthSnapshot = () =>
  useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getSnapshot,
  );

export const useAuthStatus = () => useAuthSnapshot().status;
