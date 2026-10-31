import { CalendarDays, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPaymentViewStatus } from "@/feature/payment";
import { PaymentAmount } from "@/features/payment";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import type { SchemaPaymentHistoryItemResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

import { PaymentStatus } from "./payment-status";

type Props = {
  payments: readonly SchemaPaymentHistoryItemResponse[];
  onOpenDetails: (id: string) => void;
};

export function PaymentMobileList({ payments, onOpenDetails }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <ol
      className="finance-mobile-list"
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
