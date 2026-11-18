import { Button } from "@/shared/ui/button";
import { getPaymentViewStatus, PaymentAmount } from "@/features/payment";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import type { SchemaPaymentHistoryItemResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

import { PaymentStatus } from "./payment-status";
import {
  FINANCE_TABLE_CLASS,
  FINANCE_TABLE_ID_CLASS,
  FINANCE_TABLE_SHELL_CLASS,
} from "@/shared/components/finance/finance-styles";

type Props = {
  payments: readonly SchemaPaymentHistoryItemResponse[];
  onOpenDetails: (id: string) => void;
};

export function PaymentTable({ payments, onOpenDetails }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className={FINANCE_TABLE_SHELL_CLASS}>
      <table className={FINANCE_TABLE_CLASS}>
        <caption className="sr-only">
          {t("pages.profile.finance.paymentArchive")}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t("pages.profile.payments.trackingCode")}</th>
            <th scope="col">{t("pages.profile.payments.paymentStatus")}</th>
            <th scope="col">{t("pages.profile.payments.fulfillmentStatus")}</th>
            <th scope="col">{t("pages.profile.payments.totalAmount")}</th>
            <th scope="col">{t("pages.profile.payments.type")}</th>
            <th scope="col">{t("pages.profile.payments.date")}</th>
            <th scope="col">{t("pages.profile.payments.details")}</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(({ payment, target_type, created_at }) => (
            <tr key={payment.id}>
              <td>
                <bdi className={FINANCE_TABLE_ID_CLASS} title={payment.id}>
                  {payment.id}
                </bdi>
              </td>
              <td>
                <PaymentStatus status={getPaymentViewStatus(payment)} />
              </td>
              <td>
                {t(
                  `pages.profile.payments.fulfillment.${payment.fulfillment_status}`,
                )}
              </td>
              <td className="font-semibold">
                <PaymentAmount
                  amount={payment.amount}
                  currency={payment.currency}
                />
              </td>
              <td>
                {t(`pages.profile.payments.targets.${target_type}`, {
                  defaultValue: t("pages.profile.payments.targets.other"),
                })}
              </td>
              <td className="whitespace-nowrap">
                {dayjs(created_at)
                  .calendar("jalali")
                  .locale("fa")
                  .format("YYYY/MM/DD HH:mm")}
              </td>
              <td>
                <Button
                  variant="outline"
                  onClick={() => onOpenDetails(payment.id)}
                >
                  {t("pages.profile.payments.details")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
