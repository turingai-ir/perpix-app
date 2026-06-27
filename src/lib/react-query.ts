import { APP_KEYS } from "@/utils";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { get, set, del } from "idb-keyval";

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
      staleTime: 0,
      gcTime: REACT_QUERY_CACHE_TIME,

      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      refetchOnReconnect: true,

      retry: 1,

      networkMode: "online",
    },
    mutations: {
      networkMode: "online",
    },
  },
});

export const indexedDBPersister: Persister = {
  persistClient: async (client) => {
    await set(APP_KEYS.INDEXED_DB.REACT_QUERY, client);
  },
  restoreClient: async () =>
    await get<PersistedClient>(APP_KEYS.INDEXED_DB.REACT_QUERY),
  removeClient: async () => {
    await del(APP_KEYS.INDEXED_DB.REACT_QUERY);
  },
};
