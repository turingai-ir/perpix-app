import { Link } from "react-router";

import { DashboardAccountMetrics } from "./dashboard-account-metrics";
import { GLASS_PANEL_CLASS, SECTION_LINK_CLASS } from "./dashboard-styles";
import { DashboardSectionHeader } from "./dashboard-parts";

import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import type {
  SchemaGetWalletResponse,
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

interface DashboardAccountProps {
  isLoading: boolean;
  subscription?: SchemaUserSubscriptionResponse;
  user?: SchemaUserGetInfoResponse;
  wallet?: SchemaGetWalletResponse;
}

export function DashboardAccount({
  isLoading,
  subscription,
  user,
  wallet,
}: DashboardAccountProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (isLoading) return <Skeleton className="h-44 w-full rounded-2xl" />;
  const balance = formatTokenAmount(wallet?.balance_usdmicro ?? 0);
  const expiry = subscription?.expires_at
    ? dayjs(subscription.expires_at)
        .calendar("jalali")
        .locale("fa")
        .format("YYYY/MM/DD")
    : t("pages.root.dashboard.account.noExpiry");

  return (
    <section
      aria-labelledby="account-heading"
      className={GLASS_PANEL_CLASS}
      data-dashboard-panel
    >
      <DashboardSectionHeader
        eyebrow={t("pages.root.dashboard.account.eyebrow")}
        title={t("pages.root.dashboard.account.title")}
        titleId="account-heading"
        action={
          <Link
            to={APP_ROUTES_KEY.profile.settings.path}
            className={SECTION_LINK_CLASS}
          >
            {t("pages.root.dashboard.actions.manage")}
          </Link>
        }
      />
      <DashboardAccountMetrics
        balance={balance}
        expiry={expiry}
        subscription={subscription}
        user={user}
      />
    </section>
  );
}
