import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAiGenerate } from "./use-ai-generate";
import { useAiTaskResultPolling } from "./use-ai-task-result-polling";
import type { GeneratedMediaField } from "../model/task-message-status";
import {
  findLastAssistantMessage,
  getDefinitiveHistoryError,
  mergePolledResult,
} from "../model/conversation-messages";
import type { GenerationHistoryErrorKind } from "../model/conversation";

import { useReactQueryApi } from "@/shared/hooks/app";
import type {
  SchemaAiTaskMessageResponse,
  SchemaAiTaskResponse,
} from "@/shared/api";

/** Loads the conversation of `chatId` and merges in the polled result. */
export function useConversationTask(
  chatId: string | undefined,
  generatedMediaField: GeneratedMediaField,
) {
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const queriedTaskData = aiTaskState.data as SchemaAiTaskResponse | undefined;
  const taskData =
    chatId && queriedTaskData?.uuid === chatId ? queriedTaskData : undefined;
  const aiTaskMessages = useMemo(() => taskData?.messages ?? [], [taskData]);
  const lastAssistantMessage = useMemo(
    () => findLastAssistantMessage(aiTaskMessages),
    [aiTaskMessages],
  );
  const aiTaskResultState = useAiTaskResultPolling(
    taskData?.uuid,
    lastAssistantMessage,
    generatedMediaField,
  );
  const displayedMessages = useMemo(
    () =>
      mergePolledResult(
        aiTaskMessages,
        aiTaskResultState.data as SchemaAiTaskMessageResponse | undefined,
        generatedMediaField,
      ),
    [aiTaskMessages, aiTaskResultState.data, generatedMediaField],
  );
  const lastDisplayedAssistantMessage = useMemo(
    () => findLastAssistantMessage(displayedMessages),
    [displayedMessages],
  );
  const isHistoryUnavailableNow = useCallback(() => {
    if (!chatId) return false;
    const options = queryOptions("get", "/api/v1/ai-task/{task_uuid}", {
      params: { path: { task_uuid: chatId } },
    });
    const current = queryClient.getQueryState<SchemaAiTaskResponse>(
      options.queryKey,
    );
    // A failed background refetch keeps the loaded conversation usable;
    // only a missing task or a definitive 403/404 makes it unavailable.
    return (
      current?.data?.uuid !== chatId ||
      getDefinitiveHistoryError(current.error) !== undefined
    );
  }, [chatId, queryClient, queryOptions]);
  let historyError: GenerationHistoryErrorKind | undefined =
    getDefinitiveHistoryError(aiTaskState.error);
  if (
    chatId &&
    !historyError &&
    !taskData &&
    (aiTaskState.isError || aiTaskState.isSuccess)
  ) {
    historyError = "temporary";
  }

  return {
    aiGenerateState,
    aiTaskState,
    displayedMessages,
    historyError,
    isHistoryUnavailableNow,
    lastDisplayedAssistantMessage,
    taskData,
  };
}
