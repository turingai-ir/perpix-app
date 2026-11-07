import { CalendarDays, ReceiptText } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { getPaymentViewStatus, PaymentAmount } from "@/features/payment";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import type { SchemaPaymentHistoryItemResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

import { PaymentStatus } from "./payment-status";

type Props = {
  payments: readonly SchemaPaymentHistoryItemResponse[];
  onOpenDetails: (id: string) => void;
};

export function PaymentMobileList({ payments, onOpenDetails }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <ol
      className="finance-mobile-list finance-payment-list"
      aria-label={t("pages.profile.finance.paymentArchive")}
    >
      {payments.map(({ payment, target_type, created_at }) => (
        <li key={payment.id} className="finance-record">
          <div className="finance-record-top">
            <strong className="finance-record-amount">
              <PaymentAmount
                amount={payment.amount}
                currency={payment.currency}
              />
            </strong>
            <PaymentStatus status={getPaymentViewStatus(payment)} />
          </div>
          <div className="finance-record-meta">
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
          <div className="finance-record-footer">
            <span className="finance-record-id-label">
              {t("pages.profile.finance.trackingId")}
            </span>
            <bdi className="finance-record-id" title={payment.id}>
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
