import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import {
  DATA_ICON_CLASS,
  DATA_ROW_CLASS,
  EMPTY_STATE_CLASS,
  GLASS_PANEL_CLASS,
  SECTION_LINK_CLASS,
} from "../model/dashboard-styles";
import { DashboardSectionHeader } from "./dashboard-parts";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { SchemaWalletTransactionResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

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
      className={GLASS_PANEL_CLASS}
      data-dashboard-panel
    >
      <DashboardSectionHeader
        eyebrow={t("pages.root.dashboard.transactions.eyebrow")}
        title={t("pages.root.dashboard.transactions.title")}
        titleId="transactions-heading"
        action={
          <Link
            to={APP_ROUTES_KEY.profile.walletTransactions.path}
            className={SECTION_LINK_CLASS}
          >
            {t("pages.root.dashboard.actions.viewAll")}
          </Link>
        }
      />
      <div className="grid gap-1">
        {transactions.length ? (
          transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type];
            const amount = formatTokenAmount(transaction.amount_usdmicro);
            return (
              <div
                key={transaction.transaction_uuid}
                className={DATA_ROW_CLASS}
              >
                <span
                  className={cn(DATA_ICON_CLASS, "size-9 rounded-[0.65rem]")}
                >
                  <Icon className="text-foreground/80 size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground/90 block text-sm">
                    {t(
                      `pages.root.dashboard.transactions.types.${transaction.type.toLowerCase()}`,
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {dayjs(transaction.created_at)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD")}
                  </span>
                </span>
                <span dir="ltr" className="text-foreground text-sm font-medium">
                  {amount}
                </span>
              </div>
            );
          })
        ) : (
          <p className={EMPTY_STATE_CLASS}>
            {t("pages.root.dashboard.transactions.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
