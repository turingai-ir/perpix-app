import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import type { SchemaWalletTransactionResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

import { WalletTransactionType } from "./wallet-transaction-type";
import {
  FINANCE_TABLE_CLASS,
  FINANCE_TABLE_ID_CLASS,
  FINANCE_TABLE_SHELL_CLASS,
} from "@/pages/profile/_components/finance-styles";

export function WalletTable({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className={FINANCE_TABLE_SHELL_CLASS}>
      <table className={FINANCE_TABLE_CLASS}>
        <caption className="sr-only">
          {t("pages.profile.finance.walletArchive")}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t("pages.profile.finance.trackingId")}</th>
            <th scope="col">{t("pages.profile.payments.type")}</th>
            <th scope="col">{t("pages.profile.payments.amount")}</th>
            <th scope="col">{t("pages.profile.finance.beforeBalance")}</th>
            <th scope="col">{t("pages.profile.finance.afterBalance")}</th>
            <th scope="col">{t("pages.profile.payments.date")}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_uuid}>
              <td>
                <bdi
                  className={FINANCE_TABLE_ID_CLASS}
                  title={transaction.transaction_uuid}
                >
                  {transaction.transaction_uuid}
                </bdi>
              </td>
              <td>
                <WalletTransactionType type={transaction.type} />
              </td>
              <td className="font-semibold">
                {formatTokenAmount(transaction.amount_usdmicro)}{" "}
                {t("common.token")}
              </td>
              <td>
                {formatTokenAmount(transaction.balance_before)}{" "}
                {t("common.token")}
              </td>
              <td>
                {formatTokenAmount(transaction.balance_after)}{" "}
                {t("common.token")}
              </td>
              <td className="whitespace-nowrap">
                {dayjs(transaction.created_at)
                  .calendar("jalali")
                  .locale("fa")
                  .format("YYYY/MM/DD HH:mm")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
