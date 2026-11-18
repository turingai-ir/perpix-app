import { useReactQueryApi } from "@/hooks";

export function useAiGatewayRequestDetail(generationUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/generations/{generation_uuid}",
    {
      params: {
        path: {
          generation_uuid: generationUuid,
        },
      },
    },
    {
      enabled: Boolean(generationUuid),
    },
  );

  return {
    generation: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
