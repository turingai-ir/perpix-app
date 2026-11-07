import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useAppTranslate } from "@/shared/hooks";
import LoadingSection from "@/shared/components/loading-section";
import ErrorSection from "@/shared/components/error-section";
import {
  type SchemaSubscriptionPlanListResponse,
  type SchemaSubscriptionPlanResponse,
  type SchemaUserSubscriptionResponse,
} from "@/shared/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { APP_I18_KEYS } from "@/shared/i18n";
import {
  useActiveSubscription,
  usePurchaseSubscription,
  useSubscriptionPlans,
} from "../hooks/pricing-queries";
import { usePaymentRedirect } from "@/features/payment";
import { usePricingFeature } from "../hooks/use-pricing-feature";
import { pricingFeatureAtom } from "../hooks/pricing-state";
import PricingPlanCard from "./pricing-plan-card";
import PricingPlanAction from "./pricing-plan-action";
import { getPlanAccess, resolvePlanTiers } from "../model/plan-tiers";

const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

const isPurchasablePrice = (plan: SchemaSubscriptionPlanResponse) =>
  typeof plan.base_price_irr === "number" &&
  Number.isSafeInteger(plan.base_price_irr) &&
  typeof plan.discounted_price_irr === "number" &&
  Number.isSafeInteger(plan.discounted_price_irr);

const HEADER_KEYS = {
  default: {
    title: "features.pricing.title",
    description: "features.pricing.description",
  },
  upgrade: {
    title: "features.pricing.upgradeTitle",
    description: "features.pricing.upgradeDescription",
  },
  renew: {
    title: "features.pricing.renewTitle",
    description: "features.pricing.renewDescription",
  },
} as const;

const getHeaderKey = (
  hasPaidPlan: boolean,
  isExpiring: boolean,
): keyof typeof HEADER_KEYS => {
  if (!hasPaidPlan) return "default";
  return isExpiring ? "renew" : "upgrade";
};

function PricingFeature() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { open, requiredModelNames, requiredScopes } =
    useAtomValue(pricingFeatureAtom);
  const { openPricingFeature, closePricingFeature } = usePricingFeature();

  const plansState = useSubscriptionPlans(open);
  const activeSubscriptionState = useActiveSubscription(open);
  const purchaseSubscriptionState = usePurchaseSubscription();
  const { openPaymentUrl } = usePaymentRedirect();

  const planItems = useMemo(
    () =>
      normalizeList<SchemaSubscriptionPlanListResponse["items"][number]>(
        plansState.data?.items,
      ),
    [plansState.data?.items],
  );

  const tiers = useMemo(
    () =>
      resolvePlanTiers(
        planItems as readonly SchemaSubscriptionPlanResponse[],
        activeSubscriptionState.data as
          SchemaUserSubscriptionResponse | undefined,
      ),
    [activeSubscriptionState.data, planItems],
  );

  const hasRequirements =
    requiredScopes.length > 0 || requiredModelNames.length > 0;

  const plans = useMemo(() => {
    // A paid action needs specific scopes/models: only offer purchasable plans.
    // Otherwise show the whole ladder, with unavailable plans locked.
    const candidates = hasRequirements
      ? [
          ...(tiers.canRenew && tiers.currentPlan ? [tiers.currentPlan] : []),
          ...tiers.upgrades,
        ]
      : tiers.ladder;
    return candidates.filter(
      (plan) =>
        requiredScopes.every((scope) => plan.scopes.includes(scope)) &&
        (!requiredModelNames.length ||
          requiredModelNames.some((modelName) =>
            plan.allowed_models.includes(modelName),
          )),
    );
  }, [hasRequirements, requiredModelNames, requiredScopes, tiers]);

  const hasPaidPlan = tiers.status !== "free";
  const isTopTier = hasPaidPlan && tiers.status === "top" && !hasRequirements;
  const headerKey = getHeaderKey(hasPaidPlan, tiers.isExpiring);
  const getLevel = (uuid: string) => {
    const index = tiers.ladder.findIndex((item) => item.uuid === uuid);
    return index < 0
      ? undefined
      : { position: index + 1, total: tiers.ladder.length };
  };

  const handlePurchasePlan = useCallback(
    async (planId: string) => {
      const res = await purchaseSubscriptionState.purchase(planId);
      if (res.payment_url) {
        openPaymentUrl(res);
      } else {
        window.location.assign(`/payment/verify/${res.execution_uuid}`);
      }
    },
    [purchaseSubscriptionState, openPaymentUrl],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openPricingFeature({ requiredModelNames, requiredScopes });
        return;
      }

      closePricingFeature();
    },
    [
      closePricingFeature,
      openPricingFeature,
      requiredModelNames,
      requiredScopes,
    ],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="flex !h-dvh w-full flex-col overflow-hidden"
      >
        <SheetHeader className="p-4 sm:p-6">
          <SheetTitle className="text-center text-2xl sm:text-4xl">
            {t(HEADER_KEYS[headerKey].title)}
          </SheetTitle>
          <SheetDescription className="text-center text-base sm:text-lg">
            {t(HEADER_KEYS[headerKey].description)}
          </SheetDescription>
        </SheetHeader>

        {open && plansState.isLoading && <LoadingSection />}
        {open && plansState.isError && (
          <ErrorSection onRetry={() => plansState.refetch()} />
        )}

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
                    isPending={
                      purchaseSubscriptionState.isPending &&
                      purchaseSubscriptionState.variables?.body.plan_uuid ===
                        plan.uuid
                    }
                    isDisabled={
                      purchaseSubscriptionState.isPending ||
                      !isPurchasablePrice(plan)
                    }
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
}

export default PricingFeature;
