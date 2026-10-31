import { CalendarDays } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import type { SchemaWalletTransactionResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount } from "@/utils";

import { WalletTransactionType } from "./wallet-transaction-type";

export function WalletMobileList({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <ol
      className="finance-mobile-list"
      aria-label={t("pages.profile.finance.walletArchive")}
    >
      {transactions.map((transaction) => (
        <li key={transaction.transaction_uuid} className="finance-record">
          <div className="finance-record-top">
            <strong className="finance-record-amount">
              {formatTokenAmount(transaction.amount_usdmicro)}{" "}
              {t("common.token")}
            </strong>
            <WalletTransactionType type={transaction.type} />
          </div>
          <div className="finance-record-meta">
            <span>
              {t("pages.profile.finance.afterBalance")}:{" "}
              {formatTokenAmount(transaction.balance_after)} {t("common.token")}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {dayjs(transaction.created_at)
                .calendar("jalali")
                .locale("fa")
                .format("YYYY/MM/DD")}
            </span>
          </div>
          <div className="finance-record-footer">
            <bdi
              className="finance-record-id"
              title={transaction.transaction_uuid}
            >
              {transaction.transaction_uuid}
            </bdi>
          </div>
        </li>
      ))}
    </ol>
  );
}
