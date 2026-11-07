import { CalendarDays, ReceiptText } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { getPaymentViewStatus, PaymentAmount } from "@/features/payment";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import type { SchemaPaymentHistoryItemResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

import {
  FINANCE_LIST_CLASS,
  FINANCE_RECORD_AMOUNT_CLASS,
  FINANCE_RECORD_CLASS,
  FINANCE_RECORD_META_CLASS,
  FINANCE_RECORD_ROW_CLASS,
} from "@/pages/profile/_components/finance-styles";
import { PaymentStatus } from "./payment-status";

type Props = {
  payments: readonly SchemaPaymentHistoryItemResponse[];
  onOpenDetails: (id: string) => void;
};

export function PaymentMobileList({ payments, onOpenDetails }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <ol
      className={FINANCE_LIST_CLASS}
      data-finance-list
      aria-label={t("pages.profile.finance.paymentArchive")}
    >
      {payments.map(({ payment, target_type, created_at }) => (
        <li key={payment.id} className={FINANCE_RECORD_CLASS}>
          <div className={FINANCE_RECORD_ROW_CLASS}>
            <strong className={FINANCE_RECORD_AMOUNT_CLASS}>
              <PaymentAmount
                amount={payment.amount}
                currency={payment.currency}
              />
            </strong>
            <PaymentStatus status={getPaymentViewStatus(payment)} />
          </div>
          <div className={FINANCE_RECORD_META_CLASS}>
            <span>
              {t(`pages.profile.payments.targets.${target_type}`, {
                defaultValue: t("pages.profile.payments.targets.other"),
              })}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {dayjs(created_at)
                .calendar("jalali")
                .locale("fa")
                .format("YYYY/MM/DD")}
            </span>
          </div>
          <div className="border-border mt-4 grid grid-cols-1 gap-2 border-t pt-3 [&>button]:mt-1 [&>button]:min-h-11">
            <span className="text-muted-foreground text-xs">
              {t("pages.profile.finance.trackingId")}
            </span>
            <bdi
              className="min-w-0 font-mono text-xs leading-relaxed wrap-anywhere [direction:ltr]"
              title={payment.id}
            >
              {payment.id}
            </bdi>
            <Button variant="outline" onClick={() => onOpenDetails(payment.id)}>
              <ReceiptText aria-hidden="true" />
              {t("pages.profile.finance.receipt")}
            </Button>
          </div>
        </li>
      ))}
    </ol>
  );
}
