import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { Button } from "@/components/ui/button";
import { usePaymentStatus, usePayments } from "@/feature/payment";
import { useReactQueryApi } from "@/hooks/app";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import {
  PaymentStatusEnumMap,
  type SchemaPaymentListItemResponse,
} from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { PaymentReceipt } from "./payment-receipt";

function PaymentResultPage() {
  const { paymentUuid } = useParams<{ paymentUuid: string }>();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const statusState = usePaymentStatus(paymentUuid);
  const paymentsState = usePayments({ enabled: !!paymentUuid });
  const status = statusState.data?.status;
  const payments = paymentsState.data
    ? Array.from(
        paymentsState.data.items as ArrayLike<SchemaPaymentListItemResponse>,
      )
    : [];
  const payment = payments.find((item) => item.payment_uuid === paymentUuid);

  useEffect(() => {
    if (status !== PaymentStatusEnumMap.PAID) return;
    const walletKey = queryOptions(
      "get",
      "/api/v1/wallet/wallet",
      undefined,
    ).queryKey;
    void queryClient.invalidateQueries({ queryKey: walletKey });
  }, [queryClient, queryOptions, status]);

  if (statusState.isLoading || paymentsState.isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingSection />
      </div>
    );
  }
  if (statusState.isError || paymentsState.isError || !status) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <ErrorSection
          onRetry={() => {
            void statusState.refetch();
            void paymentsState.refetch();
          }}
        />
      </div>
    );
  }

  const rows = [
    {
      label: t("pages.payment.result.initialAmount"),
      value: payment?.amount_irr_without_tax ?? 0,
    },
    {
      label: t("pages.payment.result.tax", {
        percent: payment?.tax_percent ?? 0,
      }),
      value: payment?.tax_amount_irr ?? 0,
    },
    {
      label: t("pages.payment.result.amount"),
      value: payment?.total_amount_irr ?? 0,
    },
  ];
  const common = {
    rows,
    trackingCode: paymentUuid ?? "",
    trackingLabel: t("pages.payment.result.trackingCode"),
    amountLabel: t("common.rials"),
  };

  if (status === PaymentStatusEnumMap.PENDING) {
    return (
      <PaymentReceipt
        {...common}
        accent="pending"
        title={t("pages.payment.result.pending.title")}
        description={t("pages.payment.result.pending.description")}
        actions={
          <>
            <Button
              className="h-11 w-full"
              onClick={() => statusState.refetch()}
            >
              {t("pages.payment.result.checkAgain")}
            </Button>
            <HomeLink label={t("pages.payment.result.return")} />
          </>
        }
      />
    );
  }
  if (status === PaymentStatusEnumMap.PAID) {
    return (
      <PaymentReceipt
        {...common}
        accent="success"
        title={t("pages.payment.result.successful.title")}
        description={t("pages.payment.result.successful.description")}
        actions={<HomeLink primary label={t("pages.payment.result.return")} />}
      />
    );
  }
  return (
    <PaymentReceipt
      {...common}
      accent="failed"
      title={t("pages.payment.result.failed.title")}
      description={t("pages.payment.result.failed.description")}
      actions={
        <>
          <HomeLink primary label={t("pages.payment.result.retry")} />
          <HomeLink label={t("pages.payment.result.return")} />
        </>
      }
    />
  );
}

function HomeLink({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <Button
      asChild
      variant={primary ? "default" : "ghost"}
      className="h-11 w-full transition-transform duration-150 active:scale-[0.98]"
    >
      <Link to={APP_ROUTES_KEY.app.path}>{label}</Link>
    </Button>
  );
}

export default PaymentResultPage;
