import { useReactQueryApi } from "@/hooks";
import type { TransactionsFilterParams } from "../model/types";

export function useTransactionsList(params: TransactionsFilterParams) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/wallet-transactions",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          amount_min_usdmicro: params.amount_min_usdmicro ?? undefined,
          amount_max_usdmicro: params.amount_max_usdmicro ?? undefined,
          resource_uuid: params.resource_uuid || undefined,
          user_uuid: params.user_uuid || undefined,
          wallet_uuid: params.wallet_uuid || undefined,
          search: params.search || undefined,
          type: params.type || undefined,
          source: params.source || undefined,
          direction: params.direction || undefined,
        },
      },
    },
    {
      placeholderData: (prev) => prev,
      staleTime: 30_000,
    },
  );

  return query;
}

export type TransactionsListResponse = NonNullable<
  ReturnType<typeof useTransactionsList>["data"]
>;
export type TransactionsRowItem = NonNullable<
  TransactionsListResponse["items"]
>[number];
