import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type {
  SchemaSubscriptionPlanListResponse,
  SchemaSubscriptionPlanResponse,
  SchemaUserSubscriptionResponse,
} from "@/shared/api";
import { usePaymentRedirect } from "@/features/payment";
import {
  useActiveSubscription,
  usePurchaseSubscription,
  useSubscriptionPlans,
} from "./pricing-queries";
import { usePricingFeature } from "./use-pricing-feature";
import { pricingFeatureAtom } from "./pricing-state";
import { resolvePlanTiers } from "../model/plan-tiers";

const normalizeList = <T>(value: unknown): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

export const isPurchasablePrice = (plan: SchemaSubscriptionPlanResponse) =>
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

export function usePricing() {
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
  const headerKey: keyof typeof HEADER_KEYS = !hasPaidPlan
    ? "default"
    : tiers.isExpiring
      ? "renew"
      : "upgrade";

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

  return {
    t,
    open,
    handleOpenChange,
    closePricingFeature,
    plansState,
    plans,
    tiers,
    hasPaidPlan,
    isTopTier,
    headerTitle: HEADER_KEYS[headerKey].title,
    headerDescription: HEADER_KEYS[headerKey].description,
    getLevel,
    handlePurchasePlan,
    isPurchasePending: purchaseSubscriptionState.isPending,
    isPurchasingPlan: (planUuid: string) =>
      purchaseSubscriptionState.isPending &&
      purchaseSubscriptionState.variables?.body.plan_uuid === planUuid,
  };
}
