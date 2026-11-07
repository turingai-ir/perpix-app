import { type CSSProperties, type FC } from "react";
import { ArrowUpLeft, Crown, Sparkles } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";
import { usePlanTiers, usePricingFeature } from "@/features/pricing";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import styles from "./plan-card.module.css";

type PlanCardTone = "free" | "active" | "expiring" | "top";

const PREFIX = "pages.app.layout.sidebar.user.plan";

const AppLayoutSidebarPlanCard: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { openPricingFeature } = usePricingFeature();
  const { tiers, isLoading, isError } = usePlanTiers();

  if (isLoading) {
    return <Skeleton className={styles.skeleton} aria-hidden="true" />;
  }
  if (isError || !tiers) return null;

  const { status, currentPlan, nextPlan, daysLeft, remainingRatio } = tiers;
  const isFree = status === "free";
  const planName = currentPlan?.display_name ?? currentPlan?.name;
  const nextPlanName = nextPlan?.display_name ?? nextPlan?.name ?? "";
  const tone: PlanCardTone = resolveTone(status, tiers.isExpiring);

  const ctaLabel = (() => {
    if (isFree) return t(`${PREFIX}.subscribe`);
    if (tiers.isExpiring) return t(`${PREFIX}.renew`);
    if (nextPlan) return t(`${PREFIX}.upgradeTo`, { plan: nextPlanName });
    return null;
  })();

  const daysText = (() => {
    if (daysLeft === null) return null;
    if (daysLeft === 0) return t(`${PREFIX}.endsToday`);
    return t(`${PREFIX}.daysLeft`, { days: daysLeft.toLocaleString("fa-IR") });
  })();
  const ratioPercent = Math.round((remainingRatio ?? 0) * 100);

  return (
    <section
      className={styles.card}
      data-tone={tone}
      aria-label={t(`${PREFIX}.label`)}
    >
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          {isFree ? <Sparkles /> : <Crown />}
        </span>
        <div className={styles.titles}>
          <small>{t(`${PREFIX}.label`)}</small>
          <strong>{isFree ? t(`${PREFIX}.freeTitle`) : planName}</strong>
        </div>
        {daysText ? <span className={styles.days}>{daysText}</span> : null}
      </div>

      {isFree ? <p className={styles.hint}>{t(`${PREFIX}.freeHint`)}</p> : null}

      {!isFree && remainingRatio !== null ? (
        <div
          className={styles.track}
          role="progressbar"
          aria-label={t(`${PREFIX}.progressLabel`)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ratioPercent}
          aria-valuetext={daysText ?? undefined}
        >
          <span
            className={styles.fill}
            style={{ "--ratio": remainingRatio } as CSSProperties}
          />
        </div>
      ) : null}

      {!isFree && !ctaLabel ? (
        <p className={styles.hint}>{t(`${PREFIX}.topHint`)}</p>
      ) : null}

      {ctaLabel ? (
        <button
          type="button"
          className={styles.cta}
          onClick={() => openPricingFeature()}
        >
          <span>{ctaLabel}</span>
          <ArrowUpLeft aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
};

function resolveTone(
  status: "free" | "upgradable" | "top",
  isExpiring: boolean,
): PlanCardTone {
  if (status === "free") return "free";
  if (isExpiring) return "expiring";
  return status === "top" ? "top" : "active";
}

export default AppLayoutSidebarPlanCard;
