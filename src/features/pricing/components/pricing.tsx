import type { FC } from "react";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import LoadingSection from "@/shared/components/loading-section";
import ErrorSection from "@/shared/components/error-section";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { usePricing, isPurchasablePrice } from "../hooks/use-pricing";
import PricingPlanCard from "./pricing-plan-card";
import PricingPlanAction from "./pricing-plan-action";
import { getPlanAccess } from "../model/plan-tiers";

export const PricingFeature: FC = () => {
  const {
    t,
    open,
    handleOpenChange,
    closePricingFeature,
    plansState,
    plans,
    tiers,
    hasPaidPlan,
    isTopTier,
    headerTitle,
    headerDescription,
    getLevel,
    handlePurchasePlan,
    isPurchasePending,
    isPurchasingPlan,
  } = usePricing();

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="flex !h-dvh w-full flex-col overflow-hidden"
      >
        <SheetHeader className="p-4 sm:p-6">
          <SheetTitle className="text-center text-2xl sm:text-4xl">
            {t(headerTitle)}
          </SheetTitle>
          <SheetDescription className="text-center text-base sm:text-lg">
            {t(headerDescription)}
          </SheetDescription>
        </SheetHeader>

        {open && plansState.isLoading ? <LoadingSection /> : null}

        {open && plansState.isError ? (
          <ErrorSection onRetry={() => plansState.refetch()} />
        ) : null}

        {open && plansState.isSuccess && plans.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto px-6 py-8 text-center">
            {isTopTier && tiers.currentPlan ? (
              <div className="w-full max-w-sm">
                <PricingPlanCard
                  plan={tiers.currentPlan}
                  isCurrent
                  hasPrice={isPurchasablePrice(tiers.currentPlan)}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={closePricingFeature}
                  >
                    {t("features.pricing.close")}
                  </Button>
                </PricingPlanCard>
              </div>
            ) : null}
            <div role="status" className="max-w-md space-y-2">
              <h3 className="text-lg font-medium">
                {t(
                  isTopTier
                    ? "features.pricing.topTierTitle"
                    : "features.pricing.emptyTitle",
                )}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t(
                  isTopTier
                    ? "features.pricing.topTierDescription"
                    : "features.pricing.emptyDescription",
                )}
              </p>
            </div>
            {isTopTier ? null : (
              <Button
                type="button"
                variant="outline"
                onClick={closePricingFeature}
              >
                {t("features.pricing.close")}
              </Button>
            )}
          </div>
        ) : null}

        {open && plansState.isSuccess && plans.length > 0 ? (
          <ScrollArea
            className="h-0 min-h-0 flex-1 overflow-hidden"
            viewportClassName="h-full touch-pan-y overscroll-contain"
          >
            <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-5 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] lg:gap-6">
              {plans.map((plan) => (
                <PricingPlanCard
                  key={plan.uuid}
                  plan={plan}
                  isCurrent={
                    plan.uuid === tiers.currentPlan?.uuid && hasPaidPlan
                  }
                  hasPrice={isPurchasablePrice(plan)}
                  isLocked={getPlanAccess(plan, tiers) === "lower"}
                  daysLeft={
                    plan.uuid === tiers.currentPlan?.uuid && hasPaidPlan
                      ? tiers.daysLeft
                      : null
                  }
                  level={getLevel(plan.uuid)}
                >
                  <PricingPlanAction
                    kind={getPlanAccess(plan, tiers)}
                    isRecommended={plan.is_recommended}
                    needsConfirm={hasPaidPlan}
                    isPending={isPurchasingPlan(plan.uuid)}
                    isDisabled={isPurchasePending || !isPurchasablePrice(plan)}
                    onPurchase={() => handlePurchasePlan(plan.uuid)}
                  />
                </PricingPlanCard>
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default PricingFeature;
