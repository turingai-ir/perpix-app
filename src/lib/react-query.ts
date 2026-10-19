import { APP_KEYS } from "@/utils";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { get, set, del } from "idb-keyval";
import { sessionStore } from "@/features/auth/session";

export const REACT_QUERY_CACHE_TIME = 1000 * 60 * 60 * 24 * 7;

if (typeof window !== "undefined") {
  onlineManager.setEventListener((setOnline) => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: REACT_QUERY_CACHE_TIME,

      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,

      retry: 1,

      networkMode: "online",
    },
    mutations: {
      networkMode: "online",
    },
  },
});

// Persist only for this in-memory auth cycle. A reload must authenticate again
// before any private data can be used; another user never restores this cache.
const cacheInstance = crypto.randomUUID();
type SessionPersistedClient = PersistedClient & { session: string };
const getCacheSession = () => `${cacheInstance}:${sessionStore.getCycle()}`;
let storageWork: Promise<unknown> = Promise.resolve();

export const indexedDBPersister: Persister = {
  persistClient: async (client) => {
    if (sessionStore.getStatus() !== "authenticated") return;
    const session = getCacheSession();
    storageWork = storageWork
      .catch(() => undefined)
      .then(async () => {
        if (
          sessionStore.getStatus() !== "authenticated" ||
          session !== getCacheSession()
        )
          return;
        await set(APP_KEYS.INDEXED_DB.REACT_QUERY, { ...client, session });
      });
    await storageWork;
  },
  restoreClient: async () => {
    if (sessionStore.getStatus() !== "authenticated") return undefined;
    const session = getCacheSession();
    await storageWork.catch(() => undefined);
    const client = await get<SessionPersistedClient>(
      APP_KEYS.INDEXED_DB.REACT_QUERY,
    );
    if (session !== getCacheSession() || client?.session !== session)
      return undefined;
    return client;
  },
  removeClient: async () => {
    storageWork = storageWork
      .catch(() => undefined)
      .then(() => del(APP_KEYS.INDEXED_DB.REACT_QUERY));
    await storageWork;
  },
};
