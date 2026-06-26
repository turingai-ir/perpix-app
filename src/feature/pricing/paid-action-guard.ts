import { useCallback } from "react";

import { useActiveSubscription } from "./api";
import { usePricingFeature } from ".";

export enum PaidActionScope {
  USER_READ = "user:read",
  USER_EDIT = "user:edit",
  SUBSCRIPTION_READ = "subscription:read",
  WALLET_READ = "wallet:read",
  WALLET_WRITE = "wallet:write",
  PAYMENT_READ = "payment:read",
  PAYMENT_WRITE = "payment:write",
  AI_REGISTRY_READ = "ai_registry:read",
  AI_REGISTRY_WRITE = "ai_registry:write",
  AI_TASK_READ = "ai_task:read",
  AI_TASK_WRITE = "ai_task:write",
  FILE_MANAGER_READ = "file_manager:read",
  FILE_MANAGER_WRITE = "file_manager:write",
  ADMIN_MANAGE = "admin:manage",
}

type AsyncAction = (...args: any[]) => Promise<unknown>;

const normalizeScopes = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((scope): scope is string => typeof scope === "string")
    : [];

export class PaidActionRequirementError extends Error {
  constructor() {
    super("The active subscription does not include the required scope.");
    this.name = "PaidActionRequirementError";
  }
}

type PaidActionRequirement =
  | PaidActionScope
  | {
      scopes?: readonly PaidActionScope[];
    }
  | undefined;

const normalizeRequiredScopes = (requirement: PaidActionRequirement) => {
  if (!requirement) return [];
  if (typeof requirement === "string") return [requirement];

  return [...(requirement.scopes ?? [])];
};

export const usePaidActionGuard = () => {
  const activeSubscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();

  const showRequiredPlans = useCallback(
    (requiredScopes: readonly PaidActionScope[]) => {
      openPricingFeature({
        requiredScopes: [...requiredScopes],
      });
    },
    [openPricingFeature],
  );

  const canRunPaidAction = useCallback(
    (requiredScopes: readonly PaidActionScope[], scopes?: unknown) => {
      const userScopes = normalizeScopes(
        scopes ?? activeSubscriptionState.data?.plan.scopes,
      );

      return requiredScopes.every((scope) => userScopes.includes(scope));
    },
    [activeSubscriptionState.data?.plan.scopes],
  );

  const guardAsyncAction = useCallback(
    <TAction extends AsyncAction>(
      action: TAction,
      getRequiredScope: (...args: Parameters<TAction>) => PaidActionRequirement,
    ): TAction =>
      (async (...args: Parameters<TAction>) => {
        const requiredScopes = normalizeRequiredScopes(
          getRequiredScope(...args),
        );

        if (!requiredScopes.length) {
          return action(...args);
        }

        const activeSubscription = activeSubscriptionState.data
          ? activeSubscriptionState
          : await activeSubscriptionState.refetch();

        if (
          !canRunPaidAction(
            requiredScopes,
            activeSubscription.data?.plan.scopes,
          )
        ) {
          showRequiredPlans(requiredScopes);
          throw new PaidActionRequirementError();
        }

        return action(...args);
      }) as TAction,
    [activeSubscriptionState, canRunPaidAction, showRequiredPlans],
  );

  return {
    canRunPaidAction,
    guardAsyncAction,
  };
};
