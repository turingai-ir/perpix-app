import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useActiveSubscription } from "./api";

import { appEventBus } from "@/lib/event-bus";
import { APP_KEYS } from "@/utils";

export enum PaidActionScope {
  AI_IMAGE_MODELS = "ai:image_models",
  AI_VIDEO_MODELS = "ai:video_models",
}

export type PaidActionTaskType = "IMAGE" | "VIDEO";

const TASK_TYPE_SCOPE: Record<PaidActionTaskType, PaidActionScope> = {
  IMAGE: PaidActionScope.AI_IMAGE_MODELS,
  VIDEO: PaidActionScope.AI_VIDEO_MODELS,
};

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

export const getPaidActionScope = (taskType: string) =>
  TASK_TYPE_SCOPE[taskType as PaidActionTaskType];

export const usePaidActionGuard = () => {
  const navigate = useNavigate();
  const activeSubscriptionState = useActiveSubscription();

  const showRequiredPlans = useCallback(
    (requiredScope: PaidActionScope) => {
      appEventBus.emit("SUBSCRIPTION_UPGRADE_REQUIRED", {
        requiredScopes: [requiredScope],
      });
      navigate(APP_KEYS.URL_HASH.pricing);
    },
    [navigate],
  );

  const canRunPaidAction = useCallback(
    (requiredScope: PaidActionScope, scopes?: unknown) =>
      normalizeScopes(
        scopes ?? activeSubscriptionState.data?.plan.scopes,
      ).includes(requiredScope),
    [activeSubscriptionState.data?.plan.scopes],
  );

  const guardAsyncAction = useCallback(
    <TAction extends AsyncAction>(
      action: TAction,
      getRequiredScope: (
        ...args: Parameters<TAction>
      ) => PaidActionScope | undefined,
    ): TAction =>
      (async (...args: Parameters<TAction>) => {
        const requiredScope = getRequiredScope(...args);

        if (!requiredScope) {
          return action(...args);
        }

        const activeSubscription = activeSubscriptionState.data
          ? activeSubscriptionState
          : await activeSubscriptionState.refetch();

        if (
          !canRunPaidAction(requiredScope, activeSubscription.data?.plan.scopes)
        ) {
          showRequiredPlans(requiredScope);
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
