import { useState, type FC } from "react";
import { ChevronDown, Coins, Crown, Sparkles } from "lucide-react";

import DaysRing from "./days-ring";
import AccountWidgetPanel from "./account-widget-panel";
import { useAccountWidget } from "./use-account-widget";
import styles from "./account-widget.module.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate, useViewportBreakpoint } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const PREFIX = "pages.app.layout.accountWidget";

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
      <div className={styles.slot}>
        <Skeleton className={styles.skeleton} aria-hidden="true" />
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
    <div className={styles.slot}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={styles.trigger}
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
              <Sparkles className={styles.ringIcon} />
            ) : (
              <Crown className={styles.ringIcon} />
            )}
          </DaysRing>
          <span className={styles.segments}>
            <span className={styles.segment} data-segment="plan">
              <small>{t(`${PREFIX}.plan`)}</small>
              <strong>{planValue}</strong>
            </span>
            <span className={styles.segment} data-segment="balance">
              <small>{t(`${PREFIX}.balance`)}</small>
              <strong>
                <Coins aria-hidden="true" />
                {balance}
                <em>{t(`${PREFIX}.token`)}</em>
              </strong>
            </span>
            {activity ? (
              <span className={styles.segment} data-segment="today">
                <small>{t(`${PREFIX}.today`)}</small>
                <strong>
                  {t(`${PREFIX}.creations`, {
                    count: activity.todayCount.toLocaleString("fa-IR"),
                  })}
                </strong>
              </span>
            ) : null}
          </span>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={10}
          collisionPadding={12}
          className={styles.popup}
          aria-label={t(`${PREFIX}.label`)}
        >
          <AccountWidgetPanel widget={widget} onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountWidget;
