import { useParams } from "react-router";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { isSafeExternalUrl } from "@/shared/utils/safe-external-url";
import { usePaymentStatus, useRetryPayment } from "./payment-queries";
import { getPaymentViewStatus } from "../model/payment-status";

export function usePaymentResult() {
  const { paymentUuid } = useParams<{ paymentUuid: string }>();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const {
    data: payment,
    refetch,
    isLoading,
    isError,
  } = usePaymentStatus(paymentUuid);
  const retryState = useRetryPayment();
  const status = payment ? getPaymentViewStatus(payment) : "pending";

  const canRetry =
    Boolean(payment) &&
    !payment!.requires_review &&
    payment!.fulfillment_status !== "NEEDS_REVIEW" &&
    payment!.financial_status === "PENDING" &&
    (payment!.status === "FAILED" || payment!.status === "EXPIRED");

  const retryPayment = () => {
    if (!payment) return;
    retryState.mutate(
      { params: { path: { intent_uuid: payment.id } } },
      {
        onSuccess: (result: {
          payment_url?: string | null;
          execution_uuid: string;
        }) =>
          window.location.assign(
            result.payment_url && isSafeExternalUrl(result.payment_url)
              ? result.payment_url
              : `/payment/verify/${result.execution_uuid}`,
          ),
      },
    );
  };

  let accent: "success" | "pending" | "failed" = "pending";
  if (status === "succeeded") accent = "success";
  if (status === "failed" || status === "review") accent = "failed";

  return {
    t,
    payment,
    refetch,
    isLoading,
    isError,
    status,
    accent,
    canRetry,
    isRetrying: retryState.isPending,
    retryPayment,
  };
}
