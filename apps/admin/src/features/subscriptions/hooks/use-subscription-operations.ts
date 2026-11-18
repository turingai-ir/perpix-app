import { useReactQueryApi } from "@/hooks";
import type { OperationsFilterParams } from "../model/types";

export function useSubscriptionOperations(params: OperationsFilterParams = {}) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/subscription/operations",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          actor_uuid: params.actor_uuid || undefined,
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

export type SubscriptionOperationsResponse = NonNullable<
  ReturnType<typeof useSubscriptionOperations>["data"]
>;
export type SubscriptionOperationRowItem = NonNullable<
  SubscriptionOperationsResponse["items"]
>[number];
