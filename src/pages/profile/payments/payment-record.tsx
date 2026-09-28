import { Check, ChevronDown, Clock3, ReceiptText, X } from "lucide-react";
import { useAppTranslate } from "@/hooks";
import type { SchemaPaymentListItemResponse } from "@/services/api";
import { financeDate, financeNumber } from "../_components/finance-format";

const statusIcons = { PAID: Check, PENDING: Clock3, FAILED: X };

export function PaymentRecord({
  payment,
}: {
  payment: SchemaPaymentListItemResponse;
}) {
  const { t, i18n } = useAppTranslate();
  const number = (value: number) => financeNumber(value, i18n.language);
  const StatusIcon = statusIcons[payment.status];
  const amountFields = [
    ["subtotal", payment.amount_irr_without_tax],
    ["tax", payment.tax_amount_irr],
    ["total", payment.total_amount_irr],
  ] as const;
  return (
    <details className="finance-record">
      <summary>
        <span className="finance-record-icon">
          <ReceiptText size={21} aria-hidden="true" />
        </span>
        <span className="finance-record-name">
          <strong>
            {t(
              `pages.profile.finance.${payment.target_type ?? "otherPayment"}`,
            )}
          </strong>
          <time dateTime={payment.created_at} dir="ltr">
            {financeDate(payment.created_at)}
          </time>
        </span>
        <span className={`finance-status finance-status--${payment.status}`}>
          <StatusIcon size={14} aria-hidden="true" />
          {t(`pages.profile.finance.${payment.status}`)}
        </span>
        <span className="finance-record-amount">
          <bdi>{number(payment.total_amount_irr)}</bdi>
          <small>{t("pages.profile.finance.rial")}</small>
        </span>
        <ChevronDown className="finance-chevron" size={17} aria-hidden="true" />
        <span className="sr-only">{t("pages.profile.finance.receipt")}</span>
      </summary>
      <div className="finance-receipt">
        <div className="finance-receipt-id">
          <span>{t("pages.profile.finance.trackingId")}</span>
          <bdi>{payment.payment_uuid}</bdi>
        </div>
        <dl className="finance-receipt-grid">
          {amountFields.map(([label, value]) => (
            <div key={label}>
              <dt>{t(`pages.profile.finance.${label}`)}</dt>
              <dd>
                {number(value)} <small>{t("pages.profile.finance.rial")}</small>
              </dd>
            </div>
          ))}
          <div>
            <dt>{t("pages.profile.finance.taxPercent")}</dt>
            <dd>
              {new Intl.NumberFormat(i18n.language, {
                style: "percent",
                maximumFractionDigits: 2,
              }).format(payment.tax_percent / 100)}
            </dd>
          </div>
        </dl>
        <p className="finance-updated">
          {t("pages.profile.finance.updatedAt")}{" "}
          <time dir="ltr" dateTime={payment.updated_at}>
            {financeDate(payment.updated_at)}
          </time>
        </p>
      </div>
    </details>
  );
}
