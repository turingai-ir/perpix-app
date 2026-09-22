import { ArrowUpLeft, Crown, Wallet } from "lucide-react";
import { Link } from "react-router";

import { useActiveSubscription } from "@/feature/pricing";
import { useWallet } from "@/feature/wallet";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";

export function AccountGlance() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const wallet = useWallet();
  const subscription = useActiveSubscription();
  let walletValue = t("pages.profile.settings.loading");
  if (wallet.isError) {
    walletValue = t("pages.profile.settings.unavailable");
  } else if (wallet.isSuccess) {
    walletValue = formatLocalizedNumber({
      value: microDollarToToken(wallet.data.balance_usdmicro),
    });
  }

  let planValue = t("pages.profile.settings.loading");
  if (subscription.isError) {
    planValue = t("pages.profile.settings.unavailable");
  } else if (subscription.isSuccess) {
    planValue =
      subscription.data.plan.display_name || subscription.data.plan.name;
  }

  return (
    <aside
      className="settings-panel overflow-hidden p-5 sm:p-7"
      aria-labelledby="account-glance-title"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="settings-eyebrow">
            {t("pages.profile.settings.overviewKicker")}
          </p>
          <h2 id="account-glance-title" className="mt-1 text-xl font-bold">
            {t("pages.profile.settings.overviewTitle")}
          </h2>
        </div>
        <div className="settings-icon-box">
          <SparkleIcon />
        </div>
      </div>
      <div className="mt-7 grid gap-3">
        <div className="settings-stat">
          <div className="settings-stat-icon settings-stat-icon-wallet">
            <Wallet aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs">
              {t("pages.profile.settings.walletBalance")}
            </p>
            <p className="mt-1 truncate text-xl font-bold">
              {walletValue}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                {wallet.isSuccess ? t("pages.profile.settings.token") : ""}
              </span>
            </p>
          </div>
        </div>
        <div className="settings-stat">
          <div className="settings-stat-icon settings-stat-icon-plan">
            <Crown aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs">
              {t("pages.profile.settings.activePlan")}
            </p>
            <p className="mt-1 truncate text-base font-bold">{planValue}</p>
          </div>
        </div>
      </div>
      <div className="border-border/70 mt-6 grid gap-1 border-t pt-4">
        <Link
          className="settings-quick-link"
          to={APP_ROUTES_KEY.profile.walletTransactions.path}
        >
          {t("pages.profile.settings.walletHistory")}
          <ArrowUpLeft aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className="settings-quick-link"
          to={APP_ROUTES_KEY.profile.payments.path}
        >
          {t("pages.profile.settings.paymentHistory")}
          <ArrowUpLeft aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

function SparkleIcon() {
  return (
    <span aria-hidden="true" className="text-xl leading-none">
      ✦
    </span>
  );
}
