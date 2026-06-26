import { Activity } from "react";
import { Link, useParams } from "react-router";
import { Check } from "lucide-react";

import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import {
  PaymentStatusEnumMap,
  type SchemaPaymentListItemResponse,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { formatLocalizedNumber } from "@/utils";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { APP_ROUTES_KEY } from "@/router/routes";
import { usePayments, usePaymentStatus } from "@/feature/payment";

function PaymentResultPage() {
  const { paymentUuid } = useParams<{ paymentUuid: string }>();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const paymentStatusState = usePaymentStatus(paymentUuid);
  const paymentsState = usePayments(!!paymentUuid);
  const paymentResult = paymentStatusState.data;
  const payments = paymentsState.data
    ? Array.from(
        paymentsState.data.items as ArrayLike<SchemaPaymentListItemResponse>,
      )
    : [];
  const payment = payments.find(
    (item: SchemaPaymentListItemResponse) => item.payment_uuid === paymentUuid,
  );
  const isPaid = paymentResult?.status === PaymentStatusEnumMap.PAID;
  const paymentRows = [
    {
      label: t("pages.payment.result.initialAmount"),
      value: payment?.amount_irr_without_tax ?? 0,
    },
    {
      label: t("pages.payment.result.tax", {
        percent: formatLocalizedNumber({ value: payment?.tax_percent ?? 0 }),
      }),
      value: payment?.tax_amount_irr ?? 0,
    },
    {
      label: t("pages.payment.result.amount"),
      value: payment?.total_amount_irr ?? 0,
    },
  ];

  return (
    <div className="h-dvh w-full">
      {paymentStatusState.isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}
      {paymentStatusState.isError ? (
        <div className="flex h-full w-full items-center justify-center">
          <ErrorSection onRetry={() => paymentStatusState.refetch()} />
        </div>
      ) : null}
      <Activity mode={paymentResult && isPaid ? "visible" : "hidden"}>
        <div className="bg-background flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl dark:bg-green-400/10" />
                <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-green-50 to-green-100 p-6 dark:from-green-950/40 dark:to-green-900/20">
                  <Check className="h-12 w-12 stroke-3 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
                {t("pages.payment.result.successful.title")}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {t("pages.payment.result.successful.description")}
              </p>
            </div>

            <div className="bg-card border-border mb-8 space-y-4 rounded-xl border p-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                <span className="text-muted-foreground text-sm">
                  {t("pages.payment.result.trackingCode")}
                </span>
                <span
                  dir="ltr"
                  className="text-foreground font-mono font-semibold"
                >
                  {paymentUuid ?? ""}
                </span>
              </div>
              <div className="bg-border h-px" />
              {paymentRows.map((row, index) => (
                <div
                  key={row.label}
                  className="flex flex-col items-start justify-between gap-4 lg:flex-row"
                >
                  <span className="text-muted-foreground text-sm">
                    {row.label}
                  </span>
                  <span
                    className={
                      index === paymentRows.length - 1
                        ? "text-2xl font-bold text-green-500 dark:text-green-400"
                        : "text-foreground font-medium"
                    }
                  >
                    {`${formatLocalizedNumber({
                      value: row.value,
                    })} ${t("common.rials")}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Link to={APP_ROUTES_KEY.app.path}>
                <Button className="h-11 w-full bg-green-500 font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700">
                  {t("pages.payment.result.return")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Activity>

      <Activity mode={paymentResult && !isPaid ? "visible" : "hidden"}>
        <div className="bg-background flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl dark:bg-red-400/10" />
                <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-red-50 to-red-100 p-6 dark:from-red-950/40 dark:to-red-900/20">
                  <Check className="h-12 w-12 stroke-3 text-red-500 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
                {t("pages.payment.result.failed.title")}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {t("pages.payment.result.failed.description")}
              </p>
            </div>

            <div className="bg-card border-border mb-8 space-y-4 rounded-xl border p-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                <span className="text-muted-foreground text-sm">
                  {t("pages.payment.result.trackingCode")}
                </span>
                <span
                  dir="ltr"
                  className="text-foreground font-mono font-semibold"
                >
                  {paymentUuid ?? ""}
                </span>
              </div>
              <div className="bg-border h-px" />
              {paymentRows.map((row, index) => (
                <div
                  key={row.label}
                  className="flex flex-col items-start justify-between gap-4 lg:flex-row"
                >
                  <span className="text-muted-foreground text-sm">
                    {row.label}
                  </span>
                  <span
                    className={
                      index === paymentRows.length - 1
                        ? "text-2xl font-bold text-red-500 dark:text-red-400"
                        : "text-foreground font-medium"
                    }
                  >
                    {`${formatLocalizedNumber({
                      value: row.value,
                    })} ${t("common.rials")}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Link to={APP_ROUTES_KEY.app.path}>
                <Button className="h-11 w-full bg-red-500 font-semibold text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700">
                  {t("pages.payment.result.return")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
}

export default PaymentResultPage;
