import { useReactQueryApi } from "@/hooks";

export function useSubscriptionDetail(subscriptionUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/subscriptions/{resource_uuid}",
    {
      params: {
        path: {
          resource_uuid: subscriptionUuid,
        },
      },
    },
    {
      enabled: Boolean(subscriptionUuid),
      staleTime: 30_000,
    },
  );

  return query;
}
