import { CircleAlert, CircleCheckBig, Hourglass } from "lucide-react";

import { getPaymentViewStatus } from "@/feature/payment";
import { FinanceSummary } from "@/pages/profile/_components/finance-summary";
import type { SchemaPaymentHistoryItemResponse } from "@/services/api";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, formatTomanAmount } from "@/utils";

export function PaymentSummary({
  payments,
}: {
  payments: readonly SchemaPaymentHistoryItemResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  let paidTotal = 0n;
  let pendingCount = 0;
  let failedCount = 0;

  for (const item of payments) {
    const status = getPaymentViewStatus(item.payment);
    if (item.payment.financial_status === "SUCCEEDED") {
      paidTotal += BigInt(item.payment.amount);
    }
    if (item.payment.financial_status === "PENDING") pendingCount += 1;
    if (status === "failed") failedCount += 1;
  }

  return (
    <FinanceSummary
      items={[
        {
          label: t("pages.profile.finance.paidTotal"),
          value: formatTomanAmount(paidTotal),
          unit: t("common.tomans"),
          icon: CircleCheckBig,
          tone: "positive",
        },
        {
          label: t("pages.profile.finance.pendingCount"),
          value: formatLocalizedNumber({ value: pendingCount }),
          icon: Hourglass,
          tone: "neutral",
        },
        {
          label: t("pages.profile.finance.failedCount"),
          value: formatLocalizedNumber({ value: failedCount }),
          icon: CircleAlert,
          tone: "negative",
        },
      ]}
    />
  );
}
