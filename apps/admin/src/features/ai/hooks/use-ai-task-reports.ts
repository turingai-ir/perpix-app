import { useReactQueryApi } from "@/hooks";
import type { AdminReportBucket } from "../model/types";

export interface UseAiTaskReportsParams {
  createdFrom?: string;
  createdTo?: string;
  userUuid?: string;
  limit?: number;
}

export function useAiTaskReports({
  createdFrom,
  createdTo,
  userUuid,
  limit = 30,
}: UseAiTaskReportsParams = {}) {
  const api = useReactQueryApi();

  const dailyQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/reports/daily",
    {
      params: {
        query: {
          limit,
          created_from: createdFrom || undefined,
          created_to: createdTo || undefined,
          user_uuid: userUuid || undefined,
        },
      },
    },
  );

  const typesQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/reports/types",
    {
      params: {
        query: {
          limit,
          created_from: createdFrom || undefined,
          created_to: createdTo || undefined,
          user_uuid: userUuid || undefined,
        },
      },
    },
  );

  return {
    dailyReport: (dailyQuery.data?.items ?? []) as AdminReportBucket[],
    typesReport: (typesQuery.data?.items ?? []) as AdminReportBucket[],
    isLoading: dailyQuery.isLoading || typesQuery.isLoading,
    refetchAll: () => {
      void dailyQuery.refetch();
      void typesQuery.refetch();
    },
  };
}
