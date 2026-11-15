import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type { PaymentBreakdown as Breakdown } from "../model/payment-money";
import { PaymentAmount } from "./payment-amount";

const ROW_CLASS = "flex items-center justify-between gap-4";

export function PaymentBreakdown({ payment }: { payment: Breakdown }) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const discount = payment.discount_amount;
  const hasDiscount = Boolean(discount) && discount !== "0";
  const rows = [
    {
      label: hasDiscount
        ? "pages.payment.redirect.discountedAmount"
        : "pages.payment.redirect.baseAmount",
      amount: payment.base_amount,
    },
    { label: "pages.payment.redirect.taxAmount", amount: payment.tax_amount },
    {
      label: "pages.payment.redirect.finalAmount",
      amount: payment.total_amount,
    },
  ] as const;
  return (
    <dl className="bg-muted/30 space-y-4 rounded-lg border p-4">
      {hasDiscount ? (
        <>
          <div className={ROW_CLASS}>
            <dt className="font-medium">
              {t("pages.payment.redirect.regularAmount")}
            </dt>
            <dd className="text-muted-foreground">
              <s className="decoration-1">
                <PaymentAmount
                  amount={(
                    BigInt(payment.base_amount) + BigInt(discount)
                  ).toString()}
                  currency={payment.currency}
                />
              </s>
            </dd>
          </div>
          <div className={ROW_CLASS}>
            <dt className="font-medium">
              {t("pages.payment.redirect.discountAmount")}
            </dt>
            <dd className="text-accent-emerald font-semibold">
              <PaymentAmount amount={discount} currency={payment.currency} />
            </dd>
          </div>
        </>
      ) : null}
      {rows.map(({ label, amount }, index) => (
        <div key={label} className={ROW_CLASS}>
          <dt className="font-medium">{t(label)}</dt>
          <dd className={index === 2 ? "text-lg font-semibold" : ""}>
            <PaymentAmount amount={amount} currency={payment.currency} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
