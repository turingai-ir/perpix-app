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

export function PaymentTable({ payments, onOpenDetails }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="finance-table-shell">
      <table className="finance-table">
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
                <bdi className="finance-table-id" title={payment.id}>
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
