import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useAppTranslate } from "@/hooks";
import type { SchemaWalletTransactionResponse } from "@/services/api";
import { financeDate, financeNumber } from "../_components/finance-format";

const typeIcons = {
  DEPOSIT: ArrowDownLeft,
  WITHDRAW: ArrowUpRight,
  REFUND: RotateCcw,
};

export function WalletRecord({
  transaction,
}: {
  transaction: SchemaWalletTransactionResponse;
}) {
  const { t, i18n } = useAppTranslate();
  const tokens = (value: number) => financeNumber(value, i18n.language, true);
  const TypeIcon = typeIcons[transaction.type];
  return (
    <details className={`finance-record finance-record--${transaction.type}`}>
      <summary>
        <span className="finance-record-icon">
          <TypeIcon size={21} aria-hidden="true" />
        </span>
        <span className="finance-record-name">
          <strong>{t(`pages.profile.finance.${transaction.type}`)}</strong>
          <time dir="ltr" dateTime={transaction.created_at}>
            {financeDate(transaction.created_at)}
          </time>
        </span>
        <span className="finance-record-amount">
          <bdi dir="ltr">
            {transaction.type === "WITHDRAW" ? "−" : "+"}
            {tokens(Math.abs(transaction.amount_usdmicro))}
          </bdi>
          <small>{t("pages.profile.finance.token")}</small>
        </span>
        <ChevronDown className="finance-chevron" size={17} aria-hidden="true" />
        <span className="sr-only">
          {t("pages.profile.finance.transactionDetails")}
        </span>
      </summary>
      <div className="finance-receipt">
        <div className="finance-receipt-id">
          <span>{t("pages.profile.finance.trackingId")}</span>
          <bdi>{transaction.transaction_uuid}</bdi>
        </div>
        <dl className="finance-receipt-grid">
          <div>
            <dt>{t("pages.profile.finance.beforeBalance")}</dt>
            <dd>
              {tokens(transaction.balance_before)}{" "}
              <small>{t("pages.profile.finance.token")}</small>
            </dd>
          </div>
          <div>
            <dt>{t("pages.profile.finance.afterBalance")}</dt>
            <dd>
              {tokens(transaction.balance_after)}{" "}
              <small>{t("pages.profile.finance.token")}</small>
            </dd>
          </div>
        </dl>
        <p className="finance-updated">
          {t("pages.profile.finance.updatedAt")}{" "}
          <time dir="ltr" dateTime={transaction.updated_at}>
            {financeDate(transaction.updated_at)}
          </time>
        </p>
      </div>
    </details>
  );
}
