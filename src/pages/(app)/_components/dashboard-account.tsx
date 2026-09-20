import { Link } from "react-router";

import { DashboardAccountMetrics } from "./dashboard-account-metrics";
import styles from "../dashboard.module.css";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import { APP_ROUTES_KEY } from "@/router/routes";
import type {
  SchemaGetWalletResponse,
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";

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
  const balance = formatLocalizedNumber({
    value: microDollarToToken(wallet?.balance_usdmicro ?? 0),
  });
  const expiry = subscription?.expires_at
    ? dayjs(subscription.expires_at)
        .calendar("jalali")
        .locale("fa")
        .format("YYYY/MM/DD")
    : t("pages.root.dashboard.account.noExpiry");

  return (
    <section aria-labelledby="account-heading" className={styles.glassPanel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>
            {t("pages.root.dashboard.account.eyebrow")}
          </p>
          <h2 id="account-heading" className={styles.sectionTitle}>
            {t("pages.root.dashboard.account.title")}
          </h2>
        </div>
        <Link
          to={APP_ROUTES_KEY.profile.settings.path}
          className={styles.sectionLink}
        >
          {t("pages.root.dashboard.actions.manage")}
        </Link>
      </div>
      <DashboardAccountMetrics
        balance={balance}
        expiry={expiry}
        subscription={subscription}
        user={user}
      />
    </section>
  );
}
