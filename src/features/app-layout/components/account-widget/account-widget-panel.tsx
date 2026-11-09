import { type FC } from "react";
import { useSetAtom } from "jotai";
import { ArrowUpLeft, Coins, Sparkles } from "lucide-react";

import appLayoutAtom from "../../model/app-layout-state";
import ActivityBlock from "./activity-block";
import DaysRing from "./days-ring";
import type { useAccountWidget } from "./use-account-widget";
import {
  AccountBlock,
  AccountLabel,
  AccountUnit,
} from "./account-widget-parts";

import { usePricingFeature } from "@/features/pricing";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const PREFIX = "pages.app.layout.accountWidget";
const PLAN_PREFIX = "pages.app.layout.sidebar.user.plan";

type PanelProps = {
  widget: ReturnType<typeof useAccountWidget>;
  onClose: () => void;
};

const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
        new Date(iso),
      )
    : "";

const AccountWidgetPanel: FC<PanelProps> = ({ widget, onClose }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const setLayout = useSetAtom(appLayoutAtom);
  const { openPricingFeature } = usePricingFeature();
  const { tiers, isFree, tone } = widget;
  const daysLeft = tiers?.daysLeft ?? null;
  const planName = tiers?.currentPlan?.display_name ?? tiers?.currentPlan?.name;

  const ctaLabel = (() => {
    if (!tiers || isFree) return t(`${PLAN_PREFIX}.subscribe`);
    if (tiers.isExpiring) return t(`${PLAN_PREFIX}.renew`);
    if (!tiers.nextPlan) return null;
    const name = tiers.nextPlan.display_name ?? tiers.nextPlan.name;
    return t(`${PLAN_PREFIX}.upgradeTo`, { plan: name });
  })();

  const needsCharge = widget.isZeroBalance || widget.isLowRunway;
  const runwayText = (() => {
    if (widget.isZeroBalance) return t(`${PREFIX}.zeroBalance`);
    if (widget.runwayDays === null) return null;
    if (widget.runwayDays < 1) return t(`${PREFIX}.runwayLessThanDay`);
    const days = widget.runwayDays.toLocaleString("fa-IR");
    const key = widget.isLowRunway ? "runwayLow" : "runway";
    return t(`${PREFIX}.${key}`, { days });
  })();

  const run = (action: () => void) => () => {
    onClose();
    action();
  };

  return (
    <div
      className="group/panel *:animate-rise flex flex-col gap-3.5 *:motion-reduce:animate-none [&>:nth-child(2)]:[animation-delay:70ms] [&>:nth-child(3)]:[animation-delay:140ms] [&>:nth-child(4)]:[animation-delay:210ms]"
      data-tone={tone}
    >
      <AccountBlock className="flex items-center gap-4">
        <DaysRing ratio={tiers?.remainingRatio ?? null} tone={tone} size={76}>
          {isFree || daysLeft === null ? (
            <Sparkles className="size-6" />
          ) : (
            <>
              <b>{daysLeft.toLocaleString("fa-IR")}</b>
              <small>{t(`${PREFIX}.daysShort`)}</small>
            </>
          )}
        </DaysRing>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <AccountLabel>{t(`${PREFIX}.plan`)}</AccountLabel>
          <strong className="truncate text-lg font-extrabold">
            {isFree ? t(`${PREFIX}.freePlan`) : planName}
          </strong>
          {!isFree && daysLeft !== null ? (
            <b className="text-sm font-extrabold text-white">
              {t(`${PREFIX}.daysLeft`, {
                days: daysLeft.toLocaleString("fa-IR"),
              })}
            </b>
          ) : null}
          {!isFree && tiers?.expiresAt ? (
            <span className="text-xs text-white/75">
              {t(`${PREFIX}.expiresOn`, { date: formatDate(tiers.expiresAt) })}
            </span>
          ) : null}
        </div>
      </AccountBlock>

      <AccountBlock className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <AccountLabel>{t(`${PREFIX}.balance`)}</AccountLabel>
          <p className="flex items-baseline gap-1.5 tabular-nums">
            <Coins
              aria-hidden="true"
              className="text-accent-gold size-5 self-center"
            />
            <strong className="text-[1.6rem] font-extrabold tracking-tight">
              {widget.balanceText ?? t(`${PREFIX}.balanceUnavailable`)}
            </strong>
            <AccountUnit>{t(`${PREFIX}.token`)}</AccountUnit>
          </p>
          {runwayText ? (
            <em
              className="text-accent-rose data-low:text-accent-gold text-xs font-bold not-italic"
              data-low={needsCharge || undefined}
            >
              {runwayText}
            </em>
          ) : null}
        </div>
        <Button
          type="button"
          size="lg"
          className="hover-capable:hover:brightness-110 data-primary:from-accent-orange data-primary:to-accent-gold data-primary:text-on-accent flex-none rounded-full bg-white/12 px-4 text-sm font-extrabold text-white shadow-[inset_0_1px_rgb(255_255_255/18%)] data-primary:bg-linear-to-br motion-reduce:transition-none"
          data-primary={needsCharge || undefined}
          onClick={run(() =>
            setLayout((state) => ({ ...state, isWalletChargeOpen: true })),
          )}
        >
          {t(`${PREFIX}.charge`)}
        </Button>
      </AccountBlock>

      {widget.activity ? <ActivityBlock activity={widget.activity} /> : null}

      {ctaLabel ? (
        <Button
          type="button"
          size="lg"
          className="from-accent-violet to-accent-pink hover-capable:hover:brightness-110 group-data-[tone=expiring]/panel:from-accent-orange group-data-[tone=expiring]/panel:to-accent-gold group-data-[tone=expiring]/panel:text-on-accent h-12 w-full justify-between rounded-xl bg-linear-to-br px-4 text-sm font-extrabold text-white shadow-[inset_0_1px_rgb(255_255_255/28%),0_8px_22px_rgb(143_107_242/35%)] motion-reduce:transition-none"
          onClick={run(() => openPricingFeature())}
        >
          <span>{ctaLabel}</span>
          <ArrowUpLeft aria-hidden="true" className="size-4" />
        </Button>
      ) : null}
    </div>
  );
};

export default AccountWidgetPanel;
