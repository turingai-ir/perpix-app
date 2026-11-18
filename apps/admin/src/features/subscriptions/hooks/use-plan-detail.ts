import { useReactQueryApi } from "@/hooks";

export function usePlanDetail(planUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/subscription/plans/{plan_uuid}",
    {
      params: {
        path: {
          plan_uuid: planUuid,
        },
      },
    },
    {
      enabled: Boolean(planUuid),
      staleTime: 30_000,
    },
  );

  return query;
}
