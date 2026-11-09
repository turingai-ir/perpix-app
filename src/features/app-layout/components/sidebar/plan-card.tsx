import { type CSSProperties, type FC } from "react";
import { ArrowUpLeft, Crown, Sparkles } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";
import { usePlanTiers, usePricingFeature } from "@/features/pricing";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";

type PlanCardTone = "free" | "active" | "expiring" | "top";

const PREFIX = "pages.app.layout.sidebar.user.plan";

const AppLayoutSidebarPlanCard: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { openPricingFeature } = usePricingFeature();
  const { tiers, isLoading, isError } = usePlanTiers();

  if (isLoading) {
    return (
      <Skeleton className="h-[7.6rem] w-full rounded-2xl" aria-hidden="true" />
    );
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
      data-tone={tone}
      className="group/plan bg-card/60 text-foreground relative isolate flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--plan-accent)_28%,transparent)] bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_srgb,var(--plan-accent)_20%,transparent),transparent_62%)] p-3.5 shadow-[inset_0_1px_oklch(1_0_0/12%),0_14px_34px_oklch(0_0_0/18%)] backdrop-blur-lg backdrop-saturate-[1.2] [--plan-accent-2:var(--primary)] [--plan-accent:var(--image-accent)] data-[tone=expiring]:[--plan-accent:var(--chart-5)] data-[tone=top]:[--plan-accent:var(--video-accent)]"
      aria-label={t(`${PREFIX}.label`)}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="grid size-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-[var(--plan-accent-2)] to-[var(--plan-accent)] text-white shadow-[0_6px_16px_color-mix(in_srgb,var(--plan-accent)_38%,transparent)] [&_svg]:size-[1.1rem]"
          aria-hidden="true"
        >
          {isFree ? <Sparkles /> : <Crown />}
        </span>
        <div className="flex min-w-0 flex-1 flex-col leading-snug">
          <small className="text-muted-foreground text-[0.7rem]">
            {t(`${PREFIX}.label`)}
          </small>
          <strong className="truncate text-[0.92rem] font-bold">
            {isFree ? t(`${PREFIX}.freeTitle`) : planName}
          </strong>
        </div>
        {daysText ? (
          <span className="flex-none rounded-full bg-[color-mix(in_srgb,var(--plan-accent)_14%,transparent)] px-2 py-0.5 text-[0.7rem] font-bold text-[var(--plan-accent)]">
            {daysText}
          </span>
        ) : null}
      </div>

      {isFree ? (
        <p className="text-muted-foreground m-0 text-xs leading-[1.7]">
          {t(`${PREFIX}.freeHint`)}
        </p>
      ) : null}

      {!isFree && remainingRatio !== null ? (
        <div
          className="bg-foreground/10 h-1.5 overflow-hidden rounded-full"
          role="progressbar"
          aria-label={t(`${PREFIX}.progressLabel`)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ratioPercent}
          aria-valuetext={daysText ?? undefined}
        >
          <span
            className="ease-out-quint block size-full origin-right scale-x-[var(--ratio,0)] rounded-[inherit] bg-gradient-to-r from-[var(--plan-accent-2)] to-[var(--plan-accent)] transition-transform duration-[600ms] motion-reduce:transition-none ltr:origin-left"
            style={{ "--ratio": remainingRatio } as CSSProperties}
          />
        </div>
      ) : null}

      {!isFree && !ctaLabel ? (
        <p className="text-muted-foreground m-0 text-xs leading-[1.7]">
          {t(`${PREFIX}.topHint`)}
        </p>
      ) : null}

      {ctaLabel ? (
        <Button
          type="button"
          onClick={() => openPricingFeature()}
          className="ease-out-quint hover-capable:hover:-translate-y-px hover-capable:hover:brightness-110 hover-capable:[&:hover_svg]:-translate-x-0.5 hover-capable:[&:hover_svg]:-translate-y-0.5 h-11 w-full justify-between rounded-xl border-0 bg-gradient-to-r from-[var(--plan-accent-2)] to-[var(--plan-accent)] px-4 text-[0.82rem] font-bold text-white shadow-[inset_0_1px_oklch(1_0_0/28%),0_8px_22px_color-mix(in_srgb,var(--plan-accent)_32%,transparent)] transition-[transform,filter] duration-200 group-data-[tone=expiring]/plan:text-neutral-900 group-data-[tone=top]/plan:text-neutral-900 hover:bg-transparent active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 [&_svg]:size-4 [&_svg]:transition-transform"
        >
          <span>{ctaLabel}</span>
          <ArrowUpLeft aria-hidden="true" />
        </Button>
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
