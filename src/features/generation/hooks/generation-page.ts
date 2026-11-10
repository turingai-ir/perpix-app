import { useCallback, useMemo } from "react";
import { useParams } from "react-router";

import { useConversationTask } from "./use-conversation-task";
import { useGenerationRetry } from "./use-generation-retry";
import { useGenerationSubmission } from "./use-generation-submission";
import { useMessageHashScroll } from "./use-message-hash-scroll";
import { useScrollToLatestMessage } from "./scroll-to-latest-message";
import {
  type GeneratedMediaField,
  isAiTaskMessageReady,
} from "../model/task-message-status";
import {
  findLastConfiguredMessage,
  hasPendingAssistantMessage,
  producedNothing,
} from "../model/conversation-messages";
import type { FailedGenerationRequest } from "../model/conversation";
import { resolveRequest } from "../model/retry-config";

import type {
  AiRegistryModelSupportedTypesEnumKey,
  SchemaAiTaskMessageResponse,
} from "@/shared/api";

interface UseGenerationPageInput {
  generatedMediaField: GeneratedMediaField;
  historyPath: string;
  taskType: AiRegistryModelSupportedTypesEnumKey;
}

export function useGenerationPage({
  generatedMediaField,
  historyPath,
  taskType,
}: UseGenerationPageInput) {
  const params = useParams();
  const chatId = params?.chatId ?? undefined;
  const {
    aiGenerateState,
    aiTaskState,
    displayedMessages,
    historyError,
    isHistoryUnavailableNow,
    lastDisplayedAssistantMessage,
    taskData,
  } = useConversationTask(chatId, generatedMediaField);
  const resolveMessageRequest = useCallback(
    (message: SchemaAiTaskMessageResponse) =>
      resolveRequest(displayedMessages, message),
    [displayedMessages],
  );
  const getRequestConfig = useCallback(
    (message: SchemaAiTaskMessageResponse) =>
      resolveMessageRequest(message).config,
    [resolveMessageRequest],
  );
  const lastTaskMessage = useMemo(() => {
    const message = findLastConfiguredMessage(displayedMessages);

    return message
      ? { ...message, ai_model_config: getRequestConfig(message) }
      : undefined;
  }, [displayedMessages, getRequestConfig]);
  const failedRequest = useMemo<FailedGenerationRequest | undefined>(() => {
    const message = lastDisplayedAssistantMessage;
    if (
      !message ||
      !producedNothing(message, generatedMediaField) ||
      !message.ai_model_uuid
    ) {
      return undefined;
    }
    return {
      config: getRequestConfig(message),
      key: message.uuid,
      modelUuid: message.ai_model_uuid,
    };
  }, [generatedMediaField, getRequestConfig, lastDisplayedAssistantMessage]);
  const successfulMessageClearKey =
    taskData &&
    lastDisplayedAssistantMessage &&
    isAiTaskMessageReady(lastDisplayedAssistantMessage, generatedMediaField)
      ? `${taskData.uuid}:${lastDisplayedAssistantMessage.uuid}`
      : undefined;
  const isTaskLoading = aiTaskState.isLoading;
  const isGenerating = aiGenerateState.isPending;
  const hasPendingGeneration = hasPendingAssistantMessage(
    displayedMessages,
    generatedMediaField,
  );
  const { handleForm, optimisticTurn } = useGenerationSubmission({
    chatId,
    displayedMessages,
    generatedMediaField,
    hasPendingGeneration,
    historyPath,
    isHistoryUnavailableNow,
    mutateAsync: aiGenerateState.mutateAsync,
    taskType,
    taskUuid: taskData?.uuid,
  });
  const handleRetry = useGenerationRetry({
    handleForm,
    isHistoryUnavailableNow,
    resolveMessageRequest,
  });
  const hasOptimisticPending = Boolean(
    optimisticTurn && optimisticTurn.status !== "failed",
  );
  const isBusy =
    isGenerating ||
    isTaskLoading ||
    hasPendingGeneration ||
    hasOptimisticPending;

  useScrollToLatestMessage({
    isGenerating: isGenerating || hasOptimisticPending,
    isTaskLoading,
    lastMessageUuid: lastDisplayedAssistantMessage?.uuid,
    messageCount: displayedMessages.length,
  });
  useMessageHashScroll({
    isDisabled: Boolean(historyError),
    isTaskLoading,
    messageCount: displayedMessages.length,
  });

  return {
    displayedMessages,
    failedRequest,
    handleForm,
    handleRetry,
    historyError,
    isRetryingHistory: aiTaskState.isFetching,
    resolveMessageRequest,
    retryHistory: () => {
      void aiTaskState.refetch();
    },
    isBusy,
    isTaskLoading,
    lastAssistantMessage: lastDisplayedAssistantMessage,
    lastTaskMessage,
    optimisticTurn,
    successfulMessageClearKey,
    shouldShowIntro: !chatId && !optimisticTurn,
  };
}
