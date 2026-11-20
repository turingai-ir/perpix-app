import { queryClient } from "@/shared/lib/react-query";

import { clearPaymentSession } from "@/features/payment";
import { onSessionEnded } from "@/features/auth/session";
import { clearUploadSession } from "@/features/file-manager/services/upload-session";
import { pendingUploadsGroupedAtom } from "@/features/file-manager/hooks/upload-state";
import { jotaiStore } from "@/shared/lib/jotai-store";
import { clearExportStorage } from "@/features/studio/session";
import { captureError } from "@/shared/lib/observability";

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
  void clearExportStorage().catch(captureError);
  jotaiStore.set(pendingUploadsGroupedAtom, new Map());
});
