import { useReactQueryApi } from "@/hooks/app";

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
    purchase: (planUuid: string) =>
      mutation.mutateAsync({ body: { plan_uuid: planUuid } }),
  };
};
