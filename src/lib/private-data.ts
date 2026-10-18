import { indexedDBPersister, queryClient } from "./react-query";

import { clearPaymentSession } from "@/feature/payment/checkout-session";
import { onSessionEnded } from "@/features/auth/session";

/**
 * Whenever an auth session ends (or a different one starts), drop everything
 * that belongs to the previous user: query cache, its IndexedDB copy and
 * in-flight payment state.
 */
onSessionEnded(() => {
  void queryClient.cancelQueries();
  queryClient.clear();
  void indexedDBPersister.removeClient();
  clearPaymentSession();
});
