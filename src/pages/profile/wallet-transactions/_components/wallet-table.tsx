import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import type { SchemaWalletTransactionResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount } from "@/utils";

import { WalletTransactionType } from "./wallet-transaction-type";

export function WalletTable({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className="finance-table-shell">
      <table className="finance-table">
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
                  className="finance-table-id"
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
