import { useReactQueryApi } from "@/hooks";
import type {
  AdminSort,
  SecurityStatusEnum,
  SessionsRow,
} from "../model/types";

export type SessionsRowItem = SessionsRow;

export interface UseSessionsListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  userUuid?: string;
  resourceUuid?: string;
  status?: SecurityStatusEnum | "all";
  createdFrom?: string;
  createdTo?: string;
}

export function useSessionsList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  userUuid,
  resourceUuid,
  status = "all",
  createdFrom,
  createdTo,
}: UseSessionsListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    user_uuid: userUuid || undefined,
    resource_uuid: resourceUuid || undefined,
    status: status === "all" ? undefined : status,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/auth/sessions",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    sessions: (data?.items ?? []) as unknown as SessionsRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
