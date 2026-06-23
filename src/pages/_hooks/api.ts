import { useReactQueryApi } from "@/hook/app";

export const useStart = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/start");
};

export const useLogin = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/login");
};

export const useResetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/reset-password");
};

export const useSetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/set-password");
};

export const useResendOtp = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/resend-otp");
};

export const useUser = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/get-info");
};

export const useEditUserInfo = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("patch", "/user/edit-info");
};

export const useSubscriptionPlans = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/subscription/plans", undefined, { enabled });
};

export const useActiveSubscription = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/subscription/active");
};

export const usePurchaseSubscription = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/subscription/purchase");
};

export const useWallet = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/wallet/wallet");
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/wallet/charge");
};

export const usePaymentStatus = (paymentUuid?: string) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/payment/{payment_uuid}",
    {
      params: { path: { payment_uuid: paymentUuid ?? "" } },
    },
    { enabled: !!paymentUuid },
  );
};

export const usePayments = (enabled = true) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/payment",
    { params: { query: { limit: 100 } } },
    { enabled },
  );
};
