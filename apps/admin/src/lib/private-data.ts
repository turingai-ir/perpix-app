import { indexedDBPersister, queryClient } from "./react-query";

import { onSessionEnded } from "@/features/auth/session";

/**
 * Whenever an auth session ends (or a different one starts), drop everything
 * that belongs to the previous user: query cache and its IndexedDB copy.
 */
onSessionEnded(() => {
  void queryClient.cancelQueries();
  queryClient.clear();
  void indexedDBPersister.removeClient();
});
