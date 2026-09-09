import {
  CalendarClock,
  CheckCircle2,
  CircleUserRound,
  WalletCards,
} from "lucide-react";

import { DashboardMetricCard } from "./dashboard-metric-card";

import { useAppTranslate } from "@/hooks";
import type {
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardAccountMetricsProps {
  balance: string;
  expiry: string;
  subscription?: SchemaUserSubscriptionResponse;
  user?: SchemaUserGetInfoResponse;
}

export function DashboardAccountMetrics({
  balance,
  expiry,
  subscription,
  user,
}: DashboardAccountMetricsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <DashboardMetricCard
        icon={<WalletCards className="h-5 w-5 text-fuchsia-300" />}
        label={t("pages.root.dashboard.account.balance")}
      >
        <p className="mt-1 text-2xl font-semibold text-white">
          {balance}{" "}
          <span className="text-xs font-normal text-zinc-500">
            {t("common.token")}
          </span>
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CalendarClock className="h-5 w-5 text-blue-300" />}
        label={t("pages.root.dashboard.account.plan")}
      >
        <p className="mt-1 truncate text-lg font-semibold text-white">
          {subscription?.plan.display_name ||
            t("pages.root.dashboard.account.freePlan")}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {t("pages.root.dashboard.account.expires", { date: expiry })}
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CircleUserRound className="h-5 w-5 text-cyan-300" />}
        label={t("pages.root.dashboard.account.status")}
      >
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {user?.is_verified
            ? t("pages.root.dashboard.account.verified")
            : t("pages.root.dashboard.account.unverified")}
        </p>
        <p dir="ltr" className="mt-2 truncate text-right text-xs text-zinc-500">
          {user?.phone_number}
        </p>
      </DashboardMetricCard>
    </div>
  );
}
