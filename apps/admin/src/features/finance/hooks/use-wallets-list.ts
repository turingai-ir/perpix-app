import { useReactQueryApi } from "@/hooks";
import type { WalletsFilterParams } from "../model/types";

export function useWalletsList(params: WalletsFilterParams) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/wallets",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          resource_uuid: params.resource_uuid || undefined,
          user_uuid: params.user_uuid || undefined,
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

export type WalletsListResponse = NonNullable<
  ReturnType<typeof useWalletsList>["data"]
>;
export type WalletsRowItem = NonNullable<WalletsListResponse["items"]>[number];
