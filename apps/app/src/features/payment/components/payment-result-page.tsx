import type { FC, ReactNode } from "react";
import { Link } from "react-router";

import LoadingSection from "@/shared/components/loading-section";
import ErrorSection from "@/shared/components/error-section";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { PaymentAmount } from "./payment-amount";
import { PaymentReceipt } from "./payment-receipt";
import { usePaymentResult } from "../hooks/use-payment-result";

type Props = {
  /** Guidance shown once the purchase is paid and fulfilled. */
  successNextStep?: ReactNode;
};

export const PaymentResultPage: FC<Props> = ({ successNextStep }) => {
  const {
    t,
    payment,
    refetch,
    isLoading,
    isError,
    status,
    accent,
    canRetry,
    isRetrying,
    retryPayment,
  } = usePaymentResult();

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
            <PaymentAmount
              amount={payment.amount}
              currency={payment.currency}
            />
          ),
        },
      ]}
      trackingCode={payment.execution_uuid}
      trackingLabel={t("pages.payment.result.trackingCode")}
      actions={
        <>
          {status === "succeeded" && payment.fulfillment_status === "SUCCEEDED"
            ? successNextStep
            : null}
          {canRetry ? (
            <Button
              disabled={isRetrying}
              onClick={retryPayment}
              className="h-11 w-full"
            >
              {t("pages.payment.result.retry")}
            </Button>
          ) : null}
          <Link
            to={APP_ROUTES_KEY.app.path}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full",
            )}
          >
            {t("pages.payment.result.return")}
          </Link>
        </>
      }
    />
  );
};

export default PaymentResultPage;
