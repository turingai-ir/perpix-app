import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import type { PaymentBreakdown as Breakdown } from "../model/payment-money";
import { PaymentAmount } from "./payment-amount";

export function PaymentBreakdown({ payment }: { payment: Breakdown }) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const rows = [
    { label: "pages.payment.redirect.baseAmount", amount: payment.base_amount },
    { label: "pages.payment.redirect.taxAmount", amount: payment.tax_amount },
    {
      label: "pages.payment.redirect.finalAmount",
      amount: payment.total_amount,
    },
  ] as const;
  return (
    <dl className="bg-muted/30 space-y-4 rounded-lg border p-4">
      {rows.map(({ label, amount }, index) => (
        <div key={label} className="flex items-center justify-between gap-4">
          <dt className="font-medium">{t(label)}</dt>
          <dd className={index === 2 ? "text-lg font-semibold" : ""}>
            <PaymentAmount amount={amount} currency={payment.currency} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
