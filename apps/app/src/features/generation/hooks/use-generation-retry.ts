import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { buildRetryConfig, type resolveRequest } from "../model/retry-config";

import { useReactQueryApi } from "@/shared/hooks/app";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";

interface UseGenerationRetryInput {
  handleForm: (
    data: Readonly<Record<string, unknown>>,
    aiModelUuid: string,
  ) => Promise<void | false>;
  isHistoryUnavailableNow: () => boolean;
  resolveMessageRequest: (
    message: SchemaAiTaskMessageResponse,
  ) => ReturnType<typeof resolveRequest>;
}

/** Re-submits the request behind a message with its model's current schema. */
export function useGenerationRetry({
  handleForm,
  isHistoryUnavailableNow,
  resolveMessageRequest,
}: UseGenerationRetryInput) {
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();

  return useCallback(
    async (message: SchemaAiTaskMessageResponse) => {
      if (isHistoryUnavailableNow()) return;
      const { config, modelUuid: aiModelUuid } = resolveMessageRequest(message);
      if (!aiModelUuid) return;

      let model: unknown;
      try {
        model = await queryClient.fetchQuery(
          queryOptions("get", "/api/v1/ai-registry/models/{ai_model_uuid}", {
            params: { path: { ai_model_uuid: aiModelUuid } },
          }),
        );
      } catch (error) {
        if (isHistoryUnavailableNow()) return;
        throw error;
      }

      try {
        await handleForm(buildRetryConfig(config, model), aiModelUuid);
      } catch {
        // handleForm already displays the request failure in the conversation.
      }
    },
    [
      handleForm,
      isHistoryUnavailableNow,
      queryClient,
      queryOptions,
      resolveMessageRequest,
    ],
  );
}
