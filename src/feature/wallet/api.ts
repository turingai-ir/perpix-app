import { useReactQueryApi } from "@/hooks/app";
import type {
  SchemaWalletOperationSourceEnum,
  SchemaWalletTransactionTypeEnum,
} from "@/services/api";

export const useWallet = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/wallet/wallet", undefined, { enabled });
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  const mutation = useMutation("post", "/api/v1/wallet/charge");
  return {
    ...mutation,
    charge: (amountUsdmicro: number) =>
      mutation.mutateAsync({ body: { amount_usdmicro: amountUsdmicro } }),
  };
};

type UseWalletTransactionsParams = {
  type?: SchemaWalletTransactionTypeEnum;
  source?: SchemaWalletOperationSourceEnum;
  offset?: number;
  limit?: number;
};

export const useWalletTransactions = ({
  type,
  source,
  offset = 0,
  limit = 100,
}: UseWalletTransactionsParams = {}) => {
  const { useQuery } = useReactQueryApi();

  return useQuery("get", "/api/v1/wallet/transactions", {
    params: { query: { type, source, offset, limit } },
  });
};
