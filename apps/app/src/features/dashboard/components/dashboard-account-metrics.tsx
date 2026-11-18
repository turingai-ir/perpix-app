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
          <span className="text-muted-foreground text-xs font-normal">
            {t("common.token")}
          </span>
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CalendarClock className="h-5 w-5 text-(--video-accent)" />}
        label={t("pages.root.dashboard.account.plan")}
      >
        <p className="text-foreground mt-1 truncate text-lg font-semibold">
          {subscription?.plan.display_name ||
            t("pages.root.dashboard.account.freePlan")}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {t("pages.root.dashboard.account.expires", { date: expiry })}
        </p>
      </DashboardMetricCard>
      <DashboardMetricCard
        icon={<CircleUserRound className="text-accent-sky h-5 w-5" />}
        label={t("pages.root.dashboard.account.status")}
      >
        <p className="text-foreground mt-1 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="text-accent-emerald h-4 w-4" />
          {user?.is_verified
            ? t("pages.root.dashboard.account.verified")
            : t("pages.root.dashboard.account.unverified")}
        </p>
        <p
          dir="ltr"
          className="text-muted-foreground mt-2 truncate text-right text-xs"
        >
          {user?.phone_number}
        </p>
      </DashboardMetricCard>
    </div>
  );
}
