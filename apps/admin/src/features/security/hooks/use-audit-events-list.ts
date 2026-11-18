import { useReactQueryApi } from "@/hooks";
import type { AdminSort, AuditRow } from "../model/types";

export type AuditRowItem = AuditRow;

export interface UseAuditEventsListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  userUuid?: string;
  actorUuid?: string;
  action?: string;
  createdFrom?: string;
  createdTo?: string;
}

export function useAuditEventsList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  userUuid,
  actorUuid,
  action,
  createdFrom,
  createdTo,
}: UseAuditEventsListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    user_uuid: userUuid || undefined,
    actor_uuid: actorUuid || undefined,
    action: action || undefined,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/auth/audit-events",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    events: (data?.items ?? []) as unknown as AuditRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
