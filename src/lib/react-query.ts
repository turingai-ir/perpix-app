import { get, set, del } from 'idb-keyval';
import { type PersistedClient, type Persister } from '@tanstack/react-query-persist-client';
import { QueryClient } from '@tanstack/react-query';

export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Consider data fresh for 1 minute
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      retry: false, // Don't retry failed queries
    },
  },
});

// const idbPersister = createIDBPersister('reactQuery');

// persistQueryClient({
//   queryClient,
//   persister: idbPersister,
//   maxAge: 1000 * 60 * 60 * 24,
//   dehydrateOptions: {
//     shouldDehydrateQuery: (query) => {
//       return query.meta?.persist === true;
//     },
//   },
// });
