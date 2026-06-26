import { useReactQueryApi } from "@/hook/app";

export const useWallet = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/wallet/wallet");
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/wallet/charge");
};
