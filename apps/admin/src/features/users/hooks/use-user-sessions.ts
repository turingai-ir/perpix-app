import { useReactQueryApi } from "@/hooks";

export interface UseUserSessionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

export function useUserSessions(
  userUuid: string,
  options: UseUserSessionsOptions = {},
) {
  const { offset = 0, limit = 50, enabled = true } = options;
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/auth/users/{user_uuid}/sessions",
    {
      params: {
        path: {
          user_uuid: userUuid,
        },
        query: {
          offset,
          limit,
        },
      },
    },
    {
      enabled: Boolean(userUuid) && enabled,
      staleTime: 15_000,
    },
  );

  return query;
}
