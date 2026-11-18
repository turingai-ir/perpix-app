import { useReactQueryApi } from "@/hooks";
import type { UsersFilterParams } from "../model/types";

export function useUsersList(params: UsersFilterParams) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/users",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          search: params.search || undefined,
          is_active: params.is_active ?? undefined,
          is_verified: params.is_verified ?? undefined,
          role: params.role ?? undefined,
          plan_uuid: params.plan_uuid || undefined,
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

export type UsersListResponse = NonNullable<
  ReturnType<typeof useUsersList>["data"]
>;
export type UsersRowItem = NonNullable<UsersListResponse["items"]>[number];
