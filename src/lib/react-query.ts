import { APP_KEYS } from "@/utils";
import { QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { get, set, del } from "idb-keyval";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 15,

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      retry: 1,

      retryOnMount: true,

      networkMode: "offlineFirst",
    },
    mutations: {
      networkMode: "offlineFirst",
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
