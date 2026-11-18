import { useReactQueryApi } from "@/hooks";

export interface AiRegistryReportBucket {
  readonly key: string;
  readonly count: number;
}

/** Active / inactive model counts. */
export function useAiRegistryReports() {
  const api = useReactQueryApi();
  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-registry/reports/statuses",
    { params: { query: {} } },
    { staleTime: 60_000 },
  );

  return {
    statuses: Array.from(
      (query.data?.items ?? []) as unknown as AiRegistryReportBucket[],
    ),
    isLoading: query.isLoading,
  };
}
