import { Link, useParams } from "react-router";

import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { Button } from "@/components/ui/button";
import {
  getPaymentViewStatus,
  usePaymentStatus,
  useRetryPayment,
} from "@/feature/payment";
import { PaymentAmount } from "@/features/payment";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";
import { PaymentReceipt } from "./payment-receipt";

function PaymentResultPage() {
  const { paymentUuid } = useParams<{ paymentUuid: string }>();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { data: payment, refetch, isLoading, isError } =
    usePaymentStatus(paymentUuid);
  const retryState = useRetryPayment();
  const status = payment ? getPaymentViewStatus(payment) : "pending";

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingSection />
      </div>
    );
  }
  if (isError || !payment) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <ErrorSection onRetry={() => refetch()} />
      </div>
    );
  }

  const canRetry =
    !payment.requires_review &&
    payment.fulfillment_status !== "NEEDS_REVIEW" &&
    payment.financial_status === "PENDING" &&
    (payment.status === "FAILED" || payment.status === "EXPIRED");
  const retryPayment = () => {
    retryState.mutate(
      { params: { path: { intent_uuid: payment.id } } },
      {
        onSuccess: (result) =>
          window.location.assign(
            result.payment_url ?? `/payment/verify/${result.execution_uuid}`,
          ),
      },
    );
  };

  let accent: "success" | "pending" | "failed" = "pending";
  if (status === "succeeded") accent = "success";
  if (status === "failed" || status === "review") accent = "failed";

  return (
    <PaymentReceipt
      accent={accent}
      title={t(`pages.payment.result.states.${status}.title`)}
      description={
        <>
          {t(`pages.payment.result.states.${status}.description`)}
          {payment.financial_status === "SUCCEEDED" &&
          payment.fulfillment_status !== "SUCCEEDED" ? (
            <span className="mt-2 block">
              {t("pages.payment.result.fulfillmentPending")}
            </span>
          ) : null}
        </>
      }
      rows={[
        {
          label: t("pages.payment.result.amount"),
          value: (
            <PaymentAmount amount={payment.amount} currency={payment.currency} />
          ),
        },
      ]}
      trackingCode={payment.execution_uuid}
      trackingLabel={t("pages.payment.result.trackingCode")}
      actions={
        <>
          {canRetry ? (
            <Button
              disabled={retryState.isPending}
              onClick={retryPayment}
              className="h-11 w-full"
            >
              {t("pages.payment.result.retry")}
            </Button>
          ) : null}
          <Button asChild variant="outline" className="h-11 w-full">
            <Link to={APP_ROUTES_KEY.app.path}>
              {t("pages.payment.result.return")}
            </Link>
          </Button>
        </>
      }
    />
  );
}

export default PaymentResultPage;