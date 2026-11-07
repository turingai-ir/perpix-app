import { useMemo } from "react";

import { useActiveSubscription, useSubscriptionPlans } from "./api";
import type {
  SchemaSubscriptionPlanResponse,
  SchemaUserSubscriptionResponse,
} from "@/shared/api";
import { resolvePlanTiers, type PlanTiers } from "./plan-tiers";

interface PlanTiersState {
  tiers: PlanTiers | null;
  isLoading: boolean;
  isError: boolean;
}

export const usePlanTiers = (enabled = true): PlanTiersState => {
  const plansState = useSubscriptionPlans(enabled);
  const activeState = useActiveSubscription(enabled);

  // Query data is typed as a deep mapped type; narrow it to the schema types.
  const items = plansState.data?.items as
    | readonly SchemaSubscriptionPlanResponse[]
    | undefined;
  const subscription = activeState.data as
    | SchemaUserSubscriptionResponse
    | undefined;
  const isReady = plansState.isSuccess && activeState.isSuccess;

  const tiers = useMemo(
    () => (isReady ? resolvePlanTiers(items ?? [], subscription) : null),
    [isReady, items, subscription],
  );

  return {
    tiers,
    isLoading: enabled && (plansState.isLoading || activeState.isLoading),
    isError: plansState.isError || activeState.isError,
  };
};
