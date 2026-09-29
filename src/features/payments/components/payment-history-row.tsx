import { Badge } from "@/components/ui/badge";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import { APP_I18_KEYS } from "@/services/i18";
import type { SchemaPaymentHistoryItemResponse } from "@/services/api";
import { formatLocalizedNumber } from "@/utils";

type BadgeVariant = "default" | "destructive" | "secondary";
type Payment = SchemaPaymentHistoryItemResponse["payment"];

function financialState(payment: Payment): {
  key: string;
  variant: BadgeVariant;
} {
  if (payment.financial_status === "SUCCEEDED" && payment.outcome === "review")
    return { key: "paidReview", variant: "destructive" };
  if (payment.financial_status === "SUCCEEDED")
    return { key: "succeeded", variant: "default" };
  if (payment.outcome === "review")
    return { key: "review", variant: "destructive" };
  if (payment.outcome === "failed")
    return { key: "failed", variant: "destructive" };
  if (payment.outcome === "expired")
    return { key: "expired", variant: "destructive" };
  return { key: "pending", variant: "secondary" };
}

function fulfillmentState(
  payment: Payment,
  targetType: string,
): { key: string; variant: BadgeVariant } {
  if (payment.fulfillment_status === "SUCCEEDED") {
    if (targetType === "wallet_topup")
      return { key: "walletSucceeded", variant: "default" };
    if (targetType === "subscription")
      return { key: "subscriptionSucceeded", variant: "default" };
    return { key: "completed", variant: "default" };
  }
  if (
    payment.fulfillment_status === "NEEDS_REVIEW" ||
    (payment.financial_status === "SUCCEEDED" && payment.outcome === "review")
  ) {
    return { key: "review", variant: "destructive" };
  }
  if (payment.fulfillment_status === "PENDING") {
    if (targetType === "wallet_topup")
      return { key: "walletPending", variant: "secondary" };
    if (targetType === "subscription")
      return { key: "subscriptionPending", variant: "secondary" };
    return { key: "pending", variant: "secondary" };
  }
  return { key: "notReady", variant: "secondary" };
}

export function PaymentHistoryRow({
  item,
}: {
  item: SchemaPaymentHistoryItemResponse;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { payment, target_type, created_at } = item;
  const isWallet = target_type === "wallet_topup";
  const financial = financialState(payment);
  const fulfillment = fulfillmentState(payment, target_type);
  let targetLabel = target_type;
  if (isWallet) targetLabel = t("pages.profile.payments.target.wallet");
  if (target_type === "subscription")
    targetLabel = t("pages.profile.payments.target.subscription");

  return (
    <tr className="[&>td]:px-4 [&>td]:py-3">
      <td dir="ltr" className="text-foreground font-mono text-xs">
        {payment.id}
      </td>
      <td>
        <Badge variant={financial.variant}>
          {t(`pages.profile.payments.financial.${financial.key}`)}
        </Badge>
      </td>
      <td>
        <Badge variant={fulfillment.variant}>
          {t(`pages.profile.payments.fulfillment.${fulfillment.key}`)}
        </Badge>
      </td>
      <td>
        {formatLocalizedNumber({ value: Number(payment.amount) || 0 })}{" "}
        {t("common.rials")}
      </td>
      <td>{targetLabel}</td>
      <td>{dayjs(created_at).locale("fa").format("YYYY/MM/DD HH:mm")}</td>
    </tr>
  );
}
