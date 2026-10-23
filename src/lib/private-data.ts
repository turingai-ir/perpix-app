import { indexedDBPersister, queryClient } from "./react-query";

import { clearPaymentSession } from "@/feature/payment";
import { onSessionEnded } from "@/features/auth/session";

/**
 * Whenever an auth session ends (or a different one starts), drop everything
 * that belongs to the previous user: query cache, its IndexedDB copy and
 * in-flight payment state.
 */
onSessionEnded(() => {
  void queryClient.cancelQueries();
  queryClient.clear();
  void Promise.resolve(indexedDBPersister.removeClient()).catch(() => {
    // The in-memory cycle still prevents restoring data if storage is unavailable.
  });
  clearPaymentSession();
});
