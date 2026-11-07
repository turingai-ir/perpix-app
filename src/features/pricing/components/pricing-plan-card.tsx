import { type FC, type ReactNode } from "react";
import { CircleCheck, Clock, Gift, Layers, Sparkles } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { type SchemaSubscriptionPlanResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";
import PricingPlanPrice from "./pricing-plan-price";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

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

const CARD_CLASS = [
  "group/plan relative isolate flex w-full flex-col gap-4 overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/4 p-5.5 text-foreground",
  "bg-[radial-gradient(110%_70%_at_100%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_60%)]",
  "shadow-[inset_0_1px_rgb(255_255_255/9%),0_18px_40px_rgb(0_0_0/22%)] transition-[transform,border-color] duration-200 ease-out-quint",
  "hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-primary/45",
  "data-recommended:border-primary/55 data-recommended:bg-foreground/6 data-recommended:bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_srgb,var(--accent-pink)_22%,transparent),transparent_62%)] data-recommended:shadow-[inset_0_1px_rgb(255_255_255/14%),0_0_0_1px_color-mix(in_srgb,var(--primary)_25%,transparent),0_22px_56px_color-mix(in_srgb,var(--accent-violet)_28%,transparent)]",
  "data-current:border-accent-sky data-current:bg-foreground/7 data-current:bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_srgb,var(--accent-sky)_20%,transparent),transparent_62%)] data-current:shadow-[inset_0_1px_rgb(255_255_255/14%),0_0_0_1px_color-mix(in_srgb,var(--accent-sky)_45%,transparent),0_22px_56px_color-mix(in_srgb,var(--accent-blue)_30%,transparent)]",
  "data-locked:opacity-55 data-locked:shadow-none data-locked:hover:translate-y-0",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
].join(" ");

const LIST_ITEM_CLASS =
  "flex items-start gap-2.5 text-sm leading-relaxed [&_svg]:mt-1 [&_svg]:size-4 [&_svg]:flex-none";

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
      className={CARD_CLASS}
      data-recommended={plan.is_recommended || undefined}
      data-current={isCurrent || undefined}
      data-locked={isLocked || undefined}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="m-0 me-auto text-xl font-extrabold tracking-tight">
          {plan.display_name ?? plan.name}
        </h3>
        {plan.is_recommended ? (
          <Badge className="from-accent-violet to-accent-pink h-auto border-0 bg-linear-120 px-2.5 py-1 font-bold text-white">
            <Sparkles aria-hidden="true" />
            {t("features.pricing.recommended")}
          </Badge>
        ) : null}
        {isCurrent ? (
          <Badge className="bg-accent-sky text-on-accent h-auto border-0 px-2.5 py-1 font-bold">
            {t("features.pricing.currentPlan")}
            {daysLeft !== null
              ? ` · ${t("features.pricing.daysLeft", { days: daysLeft.toLocaleString("fa-IR") })}`
              : ""}
          </Badge>
        ) : null}
      </div>

      {level ? (
        <small className="text-muted-foreground -mt-1.5 text-xs font-semibold">
          {t("features.pricing.level", {
            level: level.position.toLocaleString("fa-IR"),
            total: level.total.toLocaleString("fa-IR"),
          })}
        </small>
      ) : null}

      {plan.description ? (
        <p className="text-muted-foreground m-0 text-sm leading-loose">
          {plan.description}
        </p>
      ) : null}

      {hasPrice ? (
        <PricingPlanPrice
          currency={plan.currency}
          basePriceIrr={plan.base_price_irr as number}
          discountedPriceIrr={plan.discounted_price_irr as number}
          durationDays={hasDuration ? plan.duration_days : undefined}
        />
      ) : (
        <p className="text-muted-foreground m-0 text-sm">
          {t("features.pricing.priceUnavailable")}
        </p>
      )}

      {highlights.length > 0 ? (
        <ul className="border-foreground/8 m-0 flex list-none flex-col gap-2 border-y p-0 py-3.5">
          {highlights.map(({ key, Icon, text }) => (
            <li
              key={key}
              className={cn(
                LIST_ITEM_CLASS,
                "text-foreground/90 [&_svg]:text-primary font-semibold",
              )}
            >
              <Icon aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      ) : null}

      {features.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {features.map((feature) => (
            <li
              key={feature}
              className={cn(
                LIST_ITEM_CLASS,
                "text-foreground/80 [&_svg]:text-accent-emerald",
              )}
            >
              <CircleCheck aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-1.5">{children}</div>
    </article>
  );
};

export default PricingPlanCard;
