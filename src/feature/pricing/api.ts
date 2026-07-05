import { useReactQueryApi } from "@/hooks/app";

export const useSubscriptionPlans = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/subscription/plans", undefined, { enabled });
};

export const useActiveSubscription = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/subscription/active", undefined, { enabled });
};

export const usePurchaseSubscription = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/subscription/purchase");
};
