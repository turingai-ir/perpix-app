import { type FC } from "react";
import { useSetAtom } from "jotai";
import { ArrowUpLeft, Coins, Sparkles } from "lucide-react";

import appLayoutAtom from "../_state";
import ActivityBlock from "./activity-block";
import DaysRing from "./days-ring";
import type { useAccountWidget } from "./use-account-widget";
import styles from "./account-widget.module.css";

import { usePricingFeature } from "@/feature/pricing";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

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
    <div className={styles.panel} data-tone={tone}>
      <section className={styles.planBlock}>
        <DaysRing ratio={tiers?.remainingRatio ?? null} tone={tone} size={76}>
          {isFree || daysLeft === null ? (
            <Sparkles className={styles.ringIconLg} />
          ) : (
            <>
              <b>{daysLeft.toLocaleString("fa-IR")}</b>
              <small>{t(`${PREFIX}.daysShort`)}</small>
            </>
          )}
        </DaysRing>
        <div className={styles.planText}>
          <small>{t(`${PREFIX}.plan`)}</small>
          <strong>{isFree ? t(`${PREFIX}.freePlan`) : planName}</strong>
          {!isFree && daysLeft !== null ? (
            <b className={styles.daysLine}>
              {t(`${PREFIX}.daysLeft`, {
                days: daysLeft.toLocaleString("fa-IR"),
              })}
            </b>
          ) : null}
          {!isFree && tiers?.expiresAt ? (
            <span>
              {t(`${PREFIX}.expiresOn`, { date: formatDate(tiers.expiresAt) })}
            </span>
          ) : null}
        </div>
      </section>

      <section className={styles.balanceBlock}>
        <div className={styles.balanceText}>
          <small>{t(`${PREFIX}.balance`)}</small>
          <p>
            <Coins aria-hidden="true" />
            <strong>
              {widget.balanceText ?? t(`${PREFIX}.balanceUnavailable`)}
            </strong>
            <span>{t(`${PREFIX}.token`)}</span>
          </p>
          {runwayText ? (
            <em data-low={needsCharge || undefined}>{runwayText}</em>
          ) : null}
        </div>
        <button
          type="button"
          className={styles.chargeButton}
          data-primary={needsCharge || undefined}
          onClick={run(() =>
            setLayout((state) => ({ ...state, isWalletChargeOpen: true })),
          )}
        >
          {t(`${PREFIX}.charge`)}
        </button>
      </section>

      {widget.activity ? <ActivityBlock activity={widget.activity} /> : null}

      {ctaLabel ? (
        <button
          type="button"
          className={styles.cta}
          onClick={run(() => openPricingFeature())}
        >
          <span>{ctaLabel}</span>
          <ArrowUpLeft aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
};

export default AccountWidgetPanel;
