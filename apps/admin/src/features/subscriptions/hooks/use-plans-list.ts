import { useReactQueryApi } from "@/hooks";
import type { PlansFilterParams } from "../model/types";

export function usePlansList(params: PlansFilterParams = {}) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/subscription/plans",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 50,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          resource_uuid: params.resource_uuid || undefined,
          search: params.search || undefined,
          is_active: params.is_active ?? undefined,
          is_default: params.is_default ?? undefined,
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

export type PlansListResponse = NonNullable<
  ReturnType<typeof usePlansList>["data"]
>;
export type PlansRowItem = NonNullable<PlansListResponse["items"]>[number];
