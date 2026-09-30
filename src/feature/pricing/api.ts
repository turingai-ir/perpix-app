import { useReactQueryApi } from "@/hooks/app";
import {
  clearCheckoutIntentUuid,
  getCheckoutIntentUuid,
} from "@/feature/payment";

export const useSubscriptionPlans = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/user/subscription/plans", undefined, {
    enabled,
  });
};

export const useActiveSubscription = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/user/subscription/active", undefined, {
    enabled,
  });
};

export const usePurchaseSubscription = () => {
  const { useMutation } = useReactQueryApi();
  const mutation = useMutation("post", "/api/v1/user/subscription/purchase");
  return {
    ...mutation,
    purchase: async (planUuid: string) => {
      const key = `subscription-purchase:${planUuid}`;
      const result = await mutation.mutateAsync({
        body: {
          intent_uuid: getCheckoutIntentUuid(key),
          plan_uuid: planUuid,
        },
      });
      clearCheckoutIntentUuid(key);
      return result;
    },
  };
};
