import { queryClient } from "./react-query";

import { clearPaymentSession } from "@/feature/payment/checkout-session";
import { onSessionEnded } from "@/features/auth/session";
import { clearUploadSession } from "@/features/file-manager/session";

/**
 * Whenever an auth session ends (or a different one starts), drop everything
 * that belongs to the previous user: in-memory query cache, unfinished
 * uploads and in-flight payment state.
 */
onSessionEnded(() => {
  void queryClient.cancelQueries();
  queryClient.clear();
  clearPaymentSession();
  clearUploadSession();
});
