import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import styles from "../dashboard.module.css";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { SchemaWalletTransactionResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";

interface DashboardTransactionsProps {
  isLoading: boolean;
  transactions: readonly SchemaWalletTransactionResponse[];
}

const transactionIcons = {
  DEPOSIT: ArrowDownLeft,
  REFUND: RotateCcw,
  WITHDRAW: ArrowUpRight,
};

export function DashboardTransactions({
  isLoading,
  transactions,
}: DashboardTransactionsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (isLoading) return <Skeleton className="h-60 w-full rounded-2xl" />;

  return (
    <section
      aria-labelledby="transactions-heading"
      className={styles.glassPanel}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>
            {t("pages.root.dashboard.transactions.eyebrow")}
          </p>
          <h2 id="transactions-heading" className={styles.sectionTitle}>
            {t("pages.root.dashboard.transactions.title")}
          </h2>
        </div>
        <Link
          to={APP_ROUTES_KEY.profile.walletTransactions.path}
          className={styles.sectionLink}
        >
          {t("pages.root.dashboard.actions.viewAll")}
        </Link>
      </div>
      <div className={styles.dataList}>
        {transactions.length ? (
          transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type];
            const amount = formatLocalizedNumber({
              value: microDollarToToken(transaction.amount_usdmicro),
            });
            return (
              <div
                key={transaction.transaction_uuid}
                className={styles.dataRow}
              >
                <span className={styles.transactionIcon}>
                  <Icon className="h-4 w-4 text-zinc-300" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-zinc-200">
                    {t(
                      `pages.root.dashboard.transactions.types.${transaction.type.toLowerCase()}`,
                    )}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {dayjs(transaction.created_at)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD")}
                  </span>
                </span>
                <span dir="ltr" className="text-sm font-medium text-white">
                  {amount}
                </span>
              </div>
            );
          })
        ) : (
          <p className={styles.emptyState}>
            {t("pages.root.dashboard.transactions.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
