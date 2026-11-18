import { useReactQueryApi } from "@/hooks";
import type { AdminReportBucket } from "../model/types";

export interface UseAiGatewayReportsParams {
  createdFrom?: string;
  createdTo?: string;
  userUuid?: string;
  limit?: number;
}

export function useAiGatewayReports({
  createdFrom,
  createdTo,
  userUuid,
  limit = 30,
}: UseAiGatewayReportsParams = {}) {
  const api = useReactQueryApi();

  const queryParams = {
    limit,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    user_uuid: userUuid || undefined,
  };

  const dailyQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/reports/daily",
    {
      params: {
        query: queryParams,
      },
    },
  );

  const modelsQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/reports/models",
    {
      params: {
        query: queryParams,
      },
    },
  );

  const providersQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/reports/providers",
    {
      params: {
        query: queryParams,
      },
    },
  );

  const statusesQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/reports/statuses",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    dailyReport: (dailyQuery.data?.items ?? []) as AdminReportBucket[],
    modelsReport: (modelsQuery.data?.items ?? []) as AdminReportBucket[],
    providersReport: (providersQuery.data?.items ?? []) as AdminReportBucket[],
    statusesReport: (statusesQuery.data?.items ?? []) as AdminReportBucket[],
    isLoading:
      dailyQuery.isLoading ||
      modelsQuery.isLoading ||
      providersQuery.isLoading ||
      statusesQuery.isLoading,
    refetchAll: () => {
      void dailyQuery.refetch();
      void modelsQuery.refetch();
      void providersQuery.refetch();
      void statusesQuery.refetch();
    },
  };
}
