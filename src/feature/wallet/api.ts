import { useReactQueryApi } from "@/hooks/app";

export const useWallet = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/wallet/wallet", undefined);
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/wallet/charge");
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

  return useQuery("get", "/api/v1/wallet/transactions", {
    params: { query: { offset, limit } },
  });
};
