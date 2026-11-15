import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";
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
  const credit = payment.wallet_credit_usdmicro;
  const discount = payment.wallet_topup_discount_percent;
  return (
    <dl className="bg-muted/30 space-y-4 rounded-lg border p-4">
      {credit ? (
        <div className="flex items-center justify-between gap-4">
          <dt className="font-medium">
            {t("pages.payment.redirect.walletCredit")}
          </dt>
          <dd>
            {formatTokenAmount(credit)} {t("common.token")}
          </dd>
        </div>
      ) : null}
      {credit && discount ? (
        <div className="flex items-center justify-between gap-4">
          <dt className="font-medium">
            {t("pages.payment.redirect.walletTopupDiscount")}
          </dt>
          <dd className="text-accent-emerald font-semibold">
            {t("pages.payment.redirect.percentValue", {
              percent: discount.toLocaleString("fa-IR"),
            })}
          </dd>
        </div>
      ) : null}
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
