import { useReactQueryApi } from "@/hooks";
import type { SubscriptionsFilterParams } from "../model/types";

export function useSubscriptionsList(params: SubscriptionsFilterParams) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/subscriptions",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          expires_from: params.expires_from || undefined,
          expires_to: params.expires_to || undefined,
          resource_uuid: params.resource_uuid || undefined,
          user_uuid: params.user_uuid || undefined,
          search: params.search || undefined,
          plan_uuid: params.plan_uuid || undefined,
          status: params.status || undefined,
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

export type SubscriptionsListResponse = NonNullable<
  ReturnType<typeof useSubscriptionsList>["data"]
>;
export type SubscriptionsRowItem = NonNullable<
  SubscriptionsListResponse["items"]
>[number];
