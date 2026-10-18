import { useCallback } from "react";
import { toast } from "sonner";

import {
  useSignOutEverywhereMutation,
  useSignOutMutation,
} from "./use-auth-mutations";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export function useSignOutActions() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const signOutMutation = useSignOutMutation();
  const everywhereMutation = useSignOutEverywhereMutation();
  const { mutateAsync: signOutAsync } = signOutMutation;

  const signOut = useCallback(async () => {
    const attempt = async (): Promise<void> => {
      if ((await signOutAsync()) === "confirmed") return;

      // Local state is already cleared, but the server may still hold the session.
      toast.warning(t("features.auth.toasts.signOutUnconfirmed"), {
        action: {
          label: t("features.auth.toasts.signOutRetry"),
          onClick: () => void attempt(),
        },
      });
    };
    await attempt();
  }, [signOutAsync, t]);

  const signOutEverywhere = useCallback(async () => {
    try {
      await everywhereMutation.mutateAsync();
      toast.success(t("features.auth.toasts.signedOutEverywhere"));
    } catch {
      toast.error(t("features.auth.failures.network"));
    }
  }, [everywhereMutation, t]);

  return {
    signOut,
    signOutEverywhere,
    isPending: signOutMutation.isPending || everywhereMutation.isPending,
  };
}
