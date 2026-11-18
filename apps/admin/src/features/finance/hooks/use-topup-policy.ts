import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppTranslate, useReactQueryApi } from "@/hooks";
import type { components } from "@/services/api/api";
import { updateTopupPolicy } from "../services/finance-service";

export function useTopupPolicy() {
  const api = useReactQueryApi();
  return api.useQuery("get", "/api/admin/v1/wallet/topup-policy", {});
}

export function useSaveTopupPolicy() {
  const queryClient = useQueryClient();
  const { t } = useAppTranslate();

  return useMutation({
    mutationFn: (body: components["schemas"]["UpdateTopupPolicyRequest"]) =>
      updateTopupPolicy(body),
    onSuccess: () => {
      toast.success(
        t("features.finance.topupPolicy.saved", {
          defaultValue: "تنظیمات شارژ کیف پول ذخیره شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
