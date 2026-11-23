import {
  CalendarClock,
  CheckCircle2,
  CircleUserRound,
  WalletCards,
} from "lucide-react";

import { DashboardMetricCard } from "./dashboard-metric-card";

import { useAppTranslate } from "@/shared/hooks";
import type {
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

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
        icon={<WalletCards className="h-5 w-5 text-(--image-accent)" />}
        label={t("pages.root.dashboard.account.balance")}
      >
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {balance}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {t("common.token")}
          </span>
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CalendarClock className="h-5 w-5 text-(--video-accent)" />}
        label={t("pages.root.dashboard.account.plan")}
      >
        <p className="mt-1 truncate text-lg font-semibold text-foreground">
          {subscription?.plan.display_name ||
            t("pages.root.dashboard.account.freePlan")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("pages.root.dashboard.account.expires", { date: expiry })}
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CircleUserRound className="h-5 w-5 text-accent-sky" />}
        label={t("pages.root.dashboard.account.status")}
      >
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
          {user?.is_verified
            ? t("pages.root.dashboard.account.verified")
            : t("pages.root.dashboard.account.unverified")}
        </p>
        <p
          dir="ltr"
          className="mt-2 truncate text-right text-xs text-muted-foreground"
        >
          {user?.phone_number}
        </p>
      </DashboardMetricCard>
    </div>
  );
}
