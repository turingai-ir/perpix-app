import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";
import { chargeWallet, refreshExchangeRate } from "../services/finance-service";

export function useFinanceActions() {
  const queryClient = useQueryClient();
  const { t } = useAppTranslate();

  const chargeMutation = useMutation({
    mutationFn: ({
      walletUuid,
      userUuid,
      amountUsdmicro,
      reason,
    }: {
      walletUuid: string;
      userUuid: string;
      amountUsdmicro: number;
      reason?: string;
    }) =>
      chargeWallet(walletUuid, {
        user_uuid: userUuid,
        amount_usdmicro: amountUsdmicro,
        reason,
      }),
    onSuccess: () => {
      toast.success(
        t("features.finance.actions.chargeSuccess", {
          defaultValue: "کیف پول با موفقیت شارژ شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.finance.actions.chargeError", {
            defaultValue: "شارژ کیف پول با خطا مواجه شد.",
          }),
      );
    },
  });

  const refreshRateMutation = useMutation({
    mutationFn: refreshExchangeRate,
    onSuccess: () => {
      toast.success(
        t("features.finance.actions.rateRefreshSuccess", {
          defaultValue: "نرخ ارز با موفقیت بروزرسانی شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.finance.actions.rateRefreshError", {
            defaultValue: "بروزرسانی نرخ ارز با خطا مواجه شد.",
          }),
      );
    },
  });

  return {
    chargeWallet: (params: {
      walletUuid: string;
      userUuid: string;
      amountUsdmicro: number;
      reason?: string;
    }) => chargeMutation.mutateAsync(params),
    refreshExchangeRate: () => refreshRateMutation.mutateAsync(),
    isCharging: chargeMutation.isPending,
    isRefreshingRate: refreshRateMutation.isPending,
  };
}
