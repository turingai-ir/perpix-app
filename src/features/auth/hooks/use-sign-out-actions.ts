import { useCallback } from "react";
import { toast } from "sonner";

import {
  useSignOutEverywhereMutation,
  useSignOutMutation,
} from "./use-auth-mutations";
import { onSessionEnded } from "../services/session-manager";
import { sessionStore } from "../services/session-store";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { isErrorAbortError } from "@/shared/utils/custom-fetch/helpers";

export function useSignOutActions() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const signOutMutation = useSignOutMutation();
  const everywhereMutation = useSignOutEverywhereMutation();
  const { mutateAsync: signOutAsync } = signOutMutation;

  const signOut = useCallback(async () => {
    let cycle = sessionStore.getCycle();
    const attempt = async (): Promise<void> => {
      if (sessionStore.getCycle() !== cycle) return;
      const confirmation = await signOutAsync(cycle);
      cycle += 1;
      if (
        confirmation !== "unconfirmed" ||
        sessionStore.getCycle() !== cycle ||
        sessionStore.getStatus() !== "anonymous"
      ) {
        return;
      }

      // Local state is already cleared, but the server may still hold the session.
      const stopListening = onSessionEnded(() => {
        toast.dismiss(toastId);
        stopListening();
      });
      const toastId = toast.warning(
        t("features.auth.toasts.signOutUnconfirmed"),
        {
          onDismiss: stopListening,
          onAutoClose: stopListening,
          action: {
            label: t("features.auth.toasts.signOutRetry"),
            onClick: () => {
              stopListening();
              toast.dismiss(toastId);
              void attempt();
            },
          },
        },
      );
    };
    await attempt();
  }, [signOutAsync, t]);

  const signOutEverywhere = useCallback(async () => {
    try {
      await everywhereMutation.mutateAsync();
      toast.success(t("features.auth.toasts.signedOutEverywhere"));
    } catch (error) {
      if (isErrorAbortError(error)) return;
      toast.error(t("features.auth.failures.network"));
    }
  }, [everywhereMutation, t]);

  return {
    signOut,
    signOutEverywhere,
    isPending: signOutMutation.isPending || everywhereMutation.isPending,
  };
}
