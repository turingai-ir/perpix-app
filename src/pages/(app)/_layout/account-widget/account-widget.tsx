import { useState, type FC } from "react";
import { ChevronDown, Coins, Crown, Sparkles } from "lucide-react";

import DaysRing from "./days-ring";
import AccountWidgetPanel from "./account-widget-panel";
import { useAccountWidget } from "./use-account-widget";
import { AccountLabel, AccountUnit } from "./account-widget-parts";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate, useViewportBreakpoint } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const PREFIX = "pages.app.layout.accountWidget";

/* The header is a size container: it shrinks when the sidebar is open. */
const SLOT_CLASS = "relative z-1 ms-auto flex @max-[819px]:hidden";

const SEGMENT_CLASS =
  "flex flex-col items-start gap-0.5 leading-snug tabular-nums [&_strong]:inline-flex [&_strong]:items-center [&_strong]:gap-1.5 [&_strong]:text-[0.92rem] [&_strong]:font-extrabold [&_strong]:tracking-tight [&_strong]:whitespace-nowrap [&+&]:border-s [&+&]:border-white/12 [&+&]:ps-4";

const TRIGGER_CLASS = [
  "group/trigger inline-flex min-h-12 cursor-pointer items-center gap-3.5 rounded-full border border-white/12 bg-white/6 py-1.5 ps-1.5 pe-5 text-white/95",
  "[--glow:rgb(185_138_244/30%)] data-[tone=expiring]:[--glow:rgb(245_185_74/32%)] data-[tone=free]:[--glow:rgb(141_216_246/22%)]",
  "shadow-[inset_0_1px_rgb(255_255_255/14%),0_8px_24px_rgb(0_0_0/22%),0_0_24px_-6px_var(--glow)] backdrop-blur-lg backdrop-saturate-150",
  "transition-[scale,background-color,border-color,box-shadow] duration-200 ease-out-quint active:scale-[0.96]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet",
  "data-popup-open:border-accent-violet/45 data-popup-open:bg-white/10 hover-capable:hover:border-accent-violet/40 hover-capable:hover:bg-white/10",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
].join(" ");

/**
 * Phones never have room for the widget, so skip mounting it there and avoid
 * its requests. Between md and the 820px header threshold CSS hides it.
 */
const AccountWidget: FC = () => {
  const { md } = useViewportBreakpoint();
  return md ? <AccountWidgetContent /> : null;
};

const AccountWidgetContent: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [open, setOpen] = useState(false);
  const widget = useAccountWidget();

  if (widget.isLoading) {
    return (
      <div className={SLOT_CLASS}>
        <Skeleton className="h-11 w-38 rounded-full" aria-hidden="true" />
      </div>
    );
  }

  const { tiers, isFree, activity } = widget;
  const planName = isFree
    ? t(`${PREFIX}.freePlan`)
    : (tiers?.currentPlan?.display_name ?? tiers?.currentPlan?.name ?? "");
  const balance = widget.balanceText ?? t(`${PREFIX}.balanceUnavailable`);
  const daysLeft = tiers?.daysLeft ?? null;
  const planValue =
    isFree || daysLeft === null
      ? t(`${PREFIX}.freeShort`)
      : t(`${PREFIX}.daysUnit`, { days: daysLeft.toLocaleString("fa-IR") });

  return (
    <div className={SLOT_CLASS}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={TRIGGER_CLASS}
          data-tone={widget.tone}
          data-empty={widget.isZeroBalance || undefined}
          data-low={widget.isLowRunway || undefined}
          aria-label={t(`${PREFIX}.triggerLabel`, { balance, plan: planName })}
        >
          <DaysRing
            ratio={tiers?.remainingRatio ?? null}
            tone={widget.tone}
            size={36}
          >
            {isFree ? (
              <Sparkles className="size-4" />
            ) : (
              <Crown className="size-4" />
            )}
          </DaysRing>
          <span className="flex items-center gap-4">
            <span className={SEGMENT_CLASS} data-segment="plan">
              <AccountLabel>{t(`${PREFIX}.plan`)}</AccountLabel>
              <strong>{planValue}</strong>
            </span>
            <span className={SEGMENT_CLASS} data-segment="balance">
              <AccountLabel>{t(`${PREFIX}.balance`)}</AccountLabel>
              <strong className="group-data-[empty]/trigger:text-accent-rose group-data-[low]/trigger:text-accent-gold">
                <Coins
                  aria-hidden="true"
                  className="text-accent-gold group-data-[empty]/trigger:text-accent-rose group-data-[low]/trigger:text-accent-gold size-4"
                />
                {balance}
                <AccountUnit>{t(`${PREFIX}.token`)}</AccountUnit>
              </strong>
            </span>
            {activity ? (
              <span
                className={`${SEGMENT_CLASS} hidden @[1100px]:flex`}
                data-segment="today"
              >
                <AccountLabel>{t(`${PREFIX}.today`)}</AccountLabel>
                <strong>
                  {t(`${PREFIX}.creations`, {
                    count: activity.todayCount.toLocaleString("fa-IR"),
                  })}
                </strong>
              </span>
            ) : null}
          </span>
          <ChevronDown
            className="ease-out-quint size-4 flex-none text-white/65 transition-[rotate] duration-200 group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={10}
          collisionPadding={12}
          className="w-84 max-w-[calc(100vw-1.5rem)] gap-0 rounded-[1.75rem] border border-white/14 bg-[radial-gradient(120%_70%_at_100%_0%,rgb(143_107_242/28%),transparent_62%),rgb(24_20_38/82%)] p-4 text-white/95 shadow-[inset_0_1px_rgb(255_255_255/14%),0_24px_60px_rgb(0_0_0/45%)] ring-0 backdrop-blur-xl backdrop-saturate-150"
          aria-label={t(`${PREFIX}.label`)}
        >
          <AccountWidgetPanel widget={widget} onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountWidget;
