import { keepPreviousData } from "@tanstack/react-query";

import { useReactQueryApi } from "@/shared/hooks/app";
import type {
  SchemaWalletOperationSourceEnum,
  SchemaWalletTransactionTypeEnum,
} from "@/shared/api";

export const useWallet = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/wallet", undefined, { enabled });
};

export const useTopupPolicy = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/wallet/topup-policy", undefined, {
    enabled,
  });
};

/** What a charge saves, asked only for amounts inside the allowed range. */
export const useTopupQuote = (amountUsdmicro: number | null) => {
  const { useQuery } = useReactQueryApi();
  return useQuery(
    "get",
    "/api/v1/wallet/topup-quote",
    { params: { query: { amount_usdmicro: amountUsdmicro ?? 0 } } },
    { enabled: amountUsdmicro !== null, placeholderData: keepPreviousData },
  );
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
