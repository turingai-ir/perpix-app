import { useReactQueryApi } from "@/hooks";

/**
 * Full provider record. The list rows only carry a summary (no base URL, rate
 * limit or cost), so anything that edits a provider must read it from here.
 * Always refetched on mount so a form never opens on a stale copy.
 */
export function useAiProviderDetail(providerUuid: string) {
  const api = useReactQueryApi();
  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-registry/providers/{ai_provider_uuid}",
    {
      params: {
        path: {
          ai_provider_uuid: providerUuid,
        },
      },
    },
    {
      enabled: Boolean(providerUuid),
      refetchOnMount: "always",
    },
  );

  return {
    provider: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
