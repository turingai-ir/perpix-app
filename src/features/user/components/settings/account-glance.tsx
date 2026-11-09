import { ArrowUpLeft, Crown, Wallet } from "lucide-react";
import { Link } from "react-router";

import { useActiveSubscription } from "@/features/pricing";
import { useWallet } from "@/features/wallet";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";
import { cn } from "@/shared/lib/utils";

import {
  SettingsAsidePanel,
  SettingsEyebrow,
  SettingsIconBox,
} from "./settings-parts";

const STAT_CLASS =
  "flex min-h-22 items-center gap-3.5 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_13%,var(--border))] bg-linear-120 from-primary/11 to-card/30 p-4 shadow-[inset_0_1px_rgb(255_255_255/7%)]";
const STAT_ICON_CLASS =
  "grid size-10.5 flex-none place-items-center rounded-[0.85rem]";
const QUICK_LINK_CLASS =
  "flex min-h-11 items-center justify-between gap-3 rounded-[0.7rem] px-3 py-2 text-[0.82rem] font-semibold text-foreground transition-colors duration-200 hover-capable:hover:bg-primary/10 hover-capable:hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";

export function AccountGlance() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const wallet = useWallet();
  const subscription = useActiveSubscription();
  let walletValue = t("pages.profile.settings.loading");
  if (wallet.isError) {
    walletValue = t("pages.profile.settings.unavailable");
  } else if (wallet.isSuccess) {
    walletValue = formatTokenAmount(wallet.data.balance_usdmicro);
  }

  let planValue = t("pages.profile.settings.loading");
  if (subscription.isError) {
    planValue = t("pages.profile.settings.unavailable");
  } else if (subscription.isSuccess) {
    planValue =
      subscription.data.plan.display_name || subscription.data.plan.name;
  }

  return (
    <SettingsAsidePanel
      className="overflow-hidden p-5 sm:p-7"
      aria-labelledby="account-glance-title"
    >
      <div className="flex items-center justify-between">
        <div>
          <SettingsEyebrow>
            {t("pages.profile.settings.overviewKicker")}
          </SettingsEyebrow>
          <h2 id="account-glance-title" className="mt-1 text-xl font-bold">
            {t("pages.profile.settings.overviewTitle")}
          </h2>
        </div>
        <SettingsIconBox>
          <SparkleIcon />
        </SettingsIconBox>
      </div>
      <div className="mt-7 grid gap-3">
        <div className={STAT_CLASS}>
          <div className={cn(STAT_ICON_CLASS, "bg-success/15 text-success")}>
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
        <div className={STAT_CLASS}>
          <div className={cn(STAT_ICON_CLASS, "bg-review/15 text-review")}>
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
          className={QUICK_LINK_CLASS}
          to={APP_ROUTES_KEY.profile.walletTransactions.path}
        >
          {t("pages.profile.settings.walletHistory")}
          <ArrowUpLeft aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className={QUICK_LINK_CLASS}
          to={APP_ROUTES_KEY.profile.payments.path}
        >
          {t("pages.profile.settings.paymentHistory")}
          <ArrowUpLeft aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </SettingsAsidePanel>
  );
}

function SparkleIcon() {
  return (
    <span aria-hidden="true" className="text-xl leading-none">
      ✦
    </span>
  );
}
