import { type FC, type ReactNode } from "react";
import {
  CircleCheck,
  Clock,
  Gift,
  Layers,
  Sparkles,
} from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { type SchemaSubscriptionPlanResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";
import PricingPlanPrice from "./pricing-plan-price";
import styles from "./pricing-plan-card.module.css";

type PricingPlanCardProps = {
  plan: SchemaSubscriptionPlanResponse;
  isCurrent: boolean;
  hasPrice: boolean;
  /** Position on the price ladder (1-based) and ladder size. */
  level?: { position: number; total: number };
  daysLeft?: number | null;
  isLocked?: boolean;
  children: ReactNode;
};

const getFeatures = (plan: SchemaSubscriptionPlanResponse): string[] => {
  const features: unknown = plan.meta?.features;
  return Array.isArray(features)
    ? features.filter((item): item is string => typeof item === "string")
    : [];
};

const PricingPlanCard: FC<PricingPlanCardProps> = ({
  plan,
  isCurrent,
  hasPrice,
  level,
  daysLeft = null,
  isLocked = false,
  children,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const features = getFeatures(plan);
  const gift = plan.balance_gift_amount_usdmicro;
  const modelsCount = plan.allowed_models?.length ?? 0;
  const hasDuration = Number.isFinite(plan.duration_days);
  const highlights = [
    hasDuration
      ? {
          key: "duration",
          Icon: Clock,
          text: t("features.pricing.durationDays", {
            days: plan.duration_days.toLocaleString("fa-IR"),
          }),
        }
      : null,
    gift
      ? {
          key: "gift",
          Icon: Gift,
          text: t("features.pricing.giftBalance", {
            amount: formatTokenAmount(gift),
          }),
        }
      : null,
    modelsCount > 0
      ? {
          key: "models",
          Icon: Layers,
          text: t("features.pricing.modelsCount", {
            count: modelsCount.toLocaleString("fa-IR"),
          }),
        }
      : null,
  ].filter((item) => item !== null);

  return (
    <article
      className={styles.card}
      data-recommended={plan.is_recommended || undefined}
      data-current={isCurrent || undefined}
      data-locked={isLocked || undefined}
    >
      <div className={styles.header}>
        <h3>{plan.display_name ?? plan.name}</h3>
        {plan.is_recommended ? (
          <span className={styles.badge}>
            <Sparkles aria-hidden="true" />
            {t("features.pricing.recommended")}
          </span>
        ) : null}
        {isCurrent ? (
          <span className={styles.badgeCurrent}>
            {t("features.pricing.currentPlan")}
            {daysLeft !== null
              ? ` · ${t("features.pricing.daysLeft", { days: daysLeft.toLocaleString("fa-IR") })}`
              : ""}
          </span>
        ) : null}
      </div>

      {level ? (
        <small className={styles.level}>
          {t("features.pricing.level", {
            level: level.position.toLocaleString("fa-IR"),
            total: level.total.toLocaleString("fa-IR"),
          })}
        </small>
      ) : null}

      {plan.description ? (
        <p className={styles.description}>{plan.description}</p>
      ) : null}

      {hasPrice ? (
        <PricingPlanPrice
          currency={plan.currency}
          basePriceIrr={plan.base_price_irr as number}
          discountedPriceIrr={plan.discounted_price_irr as number}
          durationDays={hasDuration ? plan.duration_days : undefined}
        />
      ) : (
        <p className={styles.unavailable}>
          {t("features.pricing.priceUnavailable")}
        </p>
      )}

      {highlights.length > 0 ? (
        <ul className={styles.highlights}>
          {highlights.map(({ key, Icon, text }) => (
            <li key={key}>
              <Icon aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      ) : null}

      {features.length > 0 ? (
        <ul className={styles.features}>
          {features.map((feature) => (
            <li key={feature}>
              <CircleCheck aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.action}>{children}</div>
    </article>
  );
};

export default PricingPlanCard;
