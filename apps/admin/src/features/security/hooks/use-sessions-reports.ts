import { useReactQueryApi } from "@/hooks";
import type { AdminReportBucket, SecurityStatusEnum } from "../model/types";

export interface UseSessionsReportsParams {
  createdFrom?: string;
  createdTo?: string;
  userUuid?: string;
  status?: SecurityStatusEnum | "all";
  limit?: number;
}

export function useSessionsReports({
  createdFrom,
  createdTo,
  userUuid,
  status = "all",
  limit = 30,
}: UseSessionsReportsParams = {}) {
  const api = useReactQueryApi();

  const queryParams = {
    limit,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    user_uuid: userUuid || undefined,
    status: status === "all" ? undefined : status,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/auth/reports/sessions",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    reports: (data?.items ?? []) as AdminReportBucket[],
    isLoading,
    error,
    refetch,
  };
}
