import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";
import {
  activateSubscription,
  deactivateSubscription,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../services/subscription-service";
import type {
  ActivateUserSubscriptionRequest,
  DeactivateUserSubscriptionRequest,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "../model/types";

export function useSubscriptionActions() {
  const queryClient = useQueryClient();
  const { t } = useAppTranslate();

  const activateMutation = useMutation({
    mutationFn: (params: ActivateUserSubscriptionRequest) =>
      activateSubscription(params),
    onSuccess: () => {
      toast.success(
        t("features.subscriptions.actions.activateSuccess", {
          defaultValue: "اشتراک کاربر با موفقیت فعال شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.subscriptions.actions.activateError", {
            defaultValue: "فعال‌سازی اشتراک با خطا مواجه شد.",
          }),
      );
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (params: DeactivateUserSubscriptionRequest) =>
      deactivateSubscription(params),
    onSuccess: () => {
      toast.success(
        t("features.subscriptions.actions.deactivateSuccess", {
          defaultValue: "اشتراک کاربر با موفقیت غیرفعال شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.subscriptions.actions.deactivateError", {
            defaultValue: "غیرفعال‌سازی اشتراک با خطا مواجه شد.",
          }),
      );
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: (body: CreateSubscriptionPlanRequest) =>
      createSubscriptionPlan(body),
    onSuccess: () => {
      toast.success(
        t("features.subscriptions.actions.createPlanSuccess", {
          defaultValue: "پلن جدید با موفقیت ایجاد شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.subscriptions.actions.createPlanError", {
            defaultValue: "ایجاد پلن با خطا مواجه شد.",
          }),
      );
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({
      planUuid,
      body,
    }: {
      planUuid: string;
      body: UpdateSubscriptionPlanRequest;
    }) => updateSubscriptionPlan(planUuid, body),
    onSuccess: () => {
      toast.success(
        t("features.subscriptions.actions.updatePlanSuccess", {
          defaultValue: "پلن با موفقیت ویرایش شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.subscriptions.actions.updatePlanError", {
            defaultValue: "ویرایش پلن با خطا مواجه شد.",
          }),
      );
    },
  });

  return {
    activateSubscription: (params: ActivateUserSubscriptionRequest) =>
      activateMutation.mutateAsync(params),
    deactivateSubscription: (params: DeactivateUserSubscriptionRequest) =>
      deactivateMutation.mutateAsync(params),
    createPlan: (body: CreateSubscriptionPlanRequest) =>
      createPlanMutation.mutateAsync(body),
    updatePlan: (params: {
      planUuid: string;
      body: UpdateSubscriptionPlanRequest;
    }) => updatePlanMutation.mutateAsync(params),
    isActivating: activateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    isCreatingPlan: createPlanMutation.isPending,
    isUpdatingPlan: updatePlanMutation.isPending,
  };
}
