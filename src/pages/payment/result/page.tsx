import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { Check, Clock3, CircleAlert } from "lucide-react";

import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { Button } from "@/components/ui/button";
import {
  getPaymentViewStatus,
  usePaymentStatus,
  useRetryPayment,
} from "@/feature/payment";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";
import { PaymentAmount } from "@/features/payment";

function PaymentResultPage() {
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

  useEffect(() => {
    if (
      !paymentUuid ||
      !payment ||
      (status !== "pending" && status !== "processing")
    )
      return;
    const timer = window.setInterval(() => {
      void refetch();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paymentUuid, payment, status, refetch]);

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
    payment.financial_status === "PENDING" &&
    (payment.status === "FAILED" || payment.status === "EXPIRED");
  const retryPayment = async () => {
    const result = await retryState.mutateAsync({
      params: {
        path: { intent_uuid: payment.id },
      },
    });
    window.location.assign(
      result.payment_url ?? `/payment/verify/${result.execution_uuid}`,
    );
  };

  const Icon =
    status === "succeeded"
      ? Check
      : status === "failed" || status === "review"
        ? CircleAlert
        : Clock3;
  const tone =
    status === "succeeded"
      ? "text-green-600"
      : status === "failed" || status === "review"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <main className="bg-background flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-8 text-center" aria-live="polite">
        <Icon className={`mx-auto size-14 ${tone}`} aria-hidden="true" />
        <div className="space-y-3">
          <h1 className="text-foreground text-3xl font-bold">
            {t(`pages.payment.result.states.${status}.title`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`pages.payment.result.states.${status}.description`)}
          </p>
          {payment.financial_status === "SUCCEEDED" &&
          payment.fulfillment_status !== "SUCCEEDED" ? (
            <p className="text-muted-foreground">
              {t("pages.payment.result.fulfillmentPending")}
            </p>
          ) : null}
        </div>
        <div className="bg-card space-y-4 rounded-xl border p-6 text-right">
          <div className="flex flex-wrap justify-between gap-2">
            <span>{t("pages.payment.result.trackingCode")}</span>
            <span dir="ltr" className="font-mono text-xs">
              {payment.execution_uuid}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>{t("pages.payment.result.amount")}</span>
            <span>
              <PaymentAmount
                amount={payment.amount}
                currency={payment.currency}
              />
            </span>
          </div>
        </div>
        {canRetry ? (
          <Button
            disabled={retryState.isPending}
            onClick={() => void retryPayment()}
            className="w-full"
          >
            {t("pages.payment.result.retry")}
          </Button>
        ) : null}
        <Button asChild variant="outline" className="w-full">
          <Link to={APP_ROUTES_KEY.app.path}>
            {t("pages.payment.result.return")}
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default PaymentResultPage;
