import { useReactQueryApi } from "@/hooks";

export function useUserDetail(userUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/users/{resource_uuid}",
    {
      params: {
        path: {
          resource_uuid: userUuid,
        },
      },
    },
    {
      enabled: Boolean(userUuid),
      staleTime: 30_000,
    },
  );

  return query;
}
