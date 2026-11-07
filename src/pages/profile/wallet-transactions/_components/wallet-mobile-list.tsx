import { CalendarDays } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import type { SchemaWalletTransactionResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

import { WalletTransactionType } from "./wallet-transaction-type";
import {
  FINANCE_LIST_CLASS,
  FINANCE_RECORD_AMOUNT_CLASS,
  FINANCE_RECORD_CLASS,
  FINANCE_RECORD_FOOTER_CLASS,
  FINANCE_RECORD_ID_CLASS,
  FINANCE_RECORD_META_CLASS,
  FINANCE_RECORD_ROW_CLASS,
} from "@/pages/profile/_components/finance-styles";

export function WalletMobileList({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <ol
      className={FINANCE_LIST_CLASS}
      data-finance-list
      aria-label={t("pages.profile.finance.walletArchive")}
    >
      {transactions.map((transaction) => (
        <li key={transaction.transaction_uuid} className={FINANCE_RECORD_CLASS}>
          <div className={FINANCE_RECORD_ROW_CLASS}>
            <strong className={FINANCE_RECORD_AMOUNT_CLASS}>
              {formatTokenAmount(transaction.amount_usdmicro)}{" "}
              {t("common.token")}
            </strong>
            <WalletTransactionType type={transaction.type} />
          </div>
          <div className={FINANCE_RECORD_META_CLASS}>
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
          <div className={FINANCE_RECORD_FOOTER_CLASS}>
            <bdi
              className={FINANCE_RECORD_ID_CLASS}
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
