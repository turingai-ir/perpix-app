import { useReactQueryApi } from "@/hooks";
import type { components } from "@/services/api/api";

export type ReportBucket = components["schemas"]["AdminReportBucket"];

export interface UseFileReportsParams {
  createdFrom?: string;
  createdTo?: string;
  userUuid?: string;
  limit?: number;
}

export function useFileReports({
  createdFrom,
  createdTo,
  userUuid,
  limit = 30,
}: UseFileReportsParams = {}) {
  const api = useReactQueryApi();

  const queryParams = {
    limit,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    user_uuid: userUuid || undefined,
  };

  const contentTypesQuery = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/reports/content-types",
    {
      params: {
        query: queryParams,
      },
    },
  );

  const dailyQuery = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/reports/daily",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    contentTypesReport: (contentTypesQuery.data?.items ?? []) as ReportBucket[],
    dailyReport: (dailyQuery.data?.items ?? []) as ReportBucket[],
    isLoading: contentTypesQuery.isLoading || dailyQuery.isLoading,
    refetchAll: () => {
      void contentTypesQuery.refetch();
      void dailyQuery.refetch();
    },
  };
}
