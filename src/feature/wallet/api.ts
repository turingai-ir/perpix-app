import { useReactQueryApi } from "@/hooks/app";
import {
  clearCheckoutIntentUuid,
  getCheckoutIntentUuid,
} from "@/feature/payment";

export const useWallet = (enabled = true) => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/wallet/wallet", undefined, { enabled });
};

export const useChargeWallet = () => {
  const { useMutation } = useReactQueryApi();
  const mutation = useMutation("post", "/api/v1/wallet/charge");
  return {
    ...mutation,
    charge: async (amountUsdmicro: number) => {
      const key = `wallet-charge:${amountUsdmicro}`;
      const result = await mutation.mutateAsync({
        body: {
          intent_uuid: getCheckoutIntentUuid(key),
          amount_usdmicro: amountUsdmicro,
        },
      });
      clearCheckoutIntentUuid(key);
      return result;
    },
  };
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
