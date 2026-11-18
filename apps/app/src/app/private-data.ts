import { queryClient } from "@/shared/lib/react-query";

import { clearPaymentSession } from "@/features/payment";
import { onSessionEnded } from "@/features/auth/session";
import {
  clearUploadSession,
  pendingUploadsGroupedAtom,
} from "@/features/file-manager";
import { jotaiStore } from "@/shared/lib/jotai-store";

/**
 * Whenever an auth session ends (or a different one starts), drop everything
 * that belongs to the previous user: in-memory query cache, unfinished uploads and
 * in-flight payment state.
 */
onSessionEnded(() => {
  void queryClient.cancelQueries();
  queryClient.clear();
  clearPaymentSession();
  clearUploadSession();
  jotaiStore.set(pendingUploadsGroupedAtom, new Map());
});
