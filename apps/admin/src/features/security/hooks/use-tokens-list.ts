import { useReactQueryApi } from "@/hooks";
import type { AdminSort, SecurityStatusEnum, TokensRow } from "../model/types";

export type TokensRowItem = TokensRow;

export interface UseTokensListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  userUuid?: string;
  resourceUuid?: string;
  search?: string;
  status?: SecurityStatusEnum | "all";
  createdFrom?: string;
  createdTo?: string;
}

export function useTokensList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  userUuid,
  resourceUuid,
  search,
  status = "all",
  createdFrom,
  createdTo,
}: UseTokensListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    user_uuid: userUuid || undefined,
    resource_uuid: resourceUuid || undefined,
    search: search || undefined,
    status: status === "all" ? undefined : status,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/auth/api-tokens",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    tokens: (data?.items ?? []) as unknown as TokensRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
