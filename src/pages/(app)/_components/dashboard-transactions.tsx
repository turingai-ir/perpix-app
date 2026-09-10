import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { Link } from "react-router";

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
      className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5"
    >
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-fuchsia-300">
            {t("pages.root.dashboard.transactions.eyebrow")}
          </p>
          <h2
            id="transactions-heading"
            className="mt-1 text-lg font-semibold text-white"
          >
            {t("pages.root.dashboard.transactions.title")}
          </h2>
        </div>
        <Link
          to={APP_ROUTES_KEY.profile.walletTransactions.path}
          className="text-xs text-zinc-400 hover:text-white"
        >
          {t("pages.root.dashboard.actions.viewAll")}
        </Link>
      </div>
      <div className="space-y-1">
        {transactions.length ? (
          transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type];
            const amount = formatLocalizedNumber({
              value: microDollarToToken(transaction.amount_usdmicro),
            });
            return (
              <div
                key={transaction.transaction_uuid}
                className="flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-white/8 hover:bg-white/[0.045]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
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
          <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
            {t("pages.root.dashboard.transactions.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
