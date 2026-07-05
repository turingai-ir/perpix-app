import { useReactQueryApi } from "@/hooks/app";

export const useWallet = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/wallet/wallet");
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/wallet/charge");
};

type UseWalletTransactionsParams = {
  offset?: number;
  limit?: number;
};

export const useWalletTransactions = ({
  offset = 0,
  limit = 100,
}: UseWalletTransactionsParams = {}) => {
  const { useQuery } = useReactQueryApi();

  return useQuery("get", "/wallet/transactions", {
    params: { query: { offset, limit } },
  });
};
