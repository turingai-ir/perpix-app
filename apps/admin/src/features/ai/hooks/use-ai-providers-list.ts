import { useReactQueryApi } from "@/hooks";
import type { AdminSort, ProvidersRow } from "../model/types";

export interface UseAiProvidersListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  resourceUuid?: string;
  search?: string;
}

export type AiProvidersRowItem = ProvidersRow;

export function useAiProvidersList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  resourceUuid,
  search,
}: UseAiProvidersListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    resource_uuid: resourceUuid || undefined,
    search: search || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/ai-registry/providers",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    providers: (data?.items ?? []) as unknown as AiProvidersRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
