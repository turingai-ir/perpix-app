import { useReactQueryApi } from "@/hooks";

export interface UseWalletTransactionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

export function useWalletTransactions(
  walletUuid: string,
  userUuid?: string,
  options: UseWalletTransactionsOptions = {},
) {
  const { offset = 0, limit = 50, enabled = true } = options;
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/wallets/{wallet_uuid}/transactions",
    {
      params: {
        path: {
          wallet_uuid: walletUuid,
        },
        query: {
          user_uuid: userUuid ?? "",
          offset,
          limit,
        },
      },
    },
    {
      enabled: Boolean(walletUuid) && Boolean(userUuid) && enabled,
      staleTime: 15_000,
    },
  );

  return query;
}

export type WalletTransactionsResponse = NonNullable<
  ReturnType<typeof useWalletTransactions>["data"]
>;
export type WalletTransactionRowItem = NonNullable<
  WalletTransactionsResponse["transactions"]
>[number];
