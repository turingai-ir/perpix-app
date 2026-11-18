import { useReactQueryApi } from "@/hooks";

export function useAiModelDetail(modelUuid: string) {
  const api = useReactQueryApi();
  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-registry/models/{ai_model_uuid}",
    {
      params: {
        path: {
          ai_model_uuid: modelUuid,
        },
      },
    },
    {
      enabled: Boolean(modelUuid),
      // Forms edit from this record, so never show a stale copy.
      refetchOnMount: "always",
    },
  );

  return {
    model: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
