import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
  isAiTaskMessageTerminal,
} from "./model";
import { useScrollToLatestMessage } from "./scroll-to-latest-message";

import { useReactQueryApi } from "@/hooks/app";
import { buildRetryConfig } from "@/pages/(app)/generation/_utils/retry-config";

import {
  AiTaskRuleEnumMap,
  type AiRegistryModelSupportedTypesEnumKey,
  type SchemaAiTaskMessageResponse,
  type SchemaAiTaskResponse,
} from "@/services/api";

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
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const chatId = params?.chatId ?? undefined;
  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const { mutateAsync } = aiGenerateState;
  const queriedTaskData = aiTaskState.data as SchemaAiTaskResponse | undefined;
  const taskData =
    chatId && queriedTaskData?.uuid === chatId ? queriedTaskData : undefined;
  const aiTaskMessages = useMemo(() => taskData?.messages ?? [], [taskData]);
  const lastAssistantMessage = useMemo(
    () =>
      [...aiTaskMessages]
        .reverse()
        .find((message) => message.role === AiTaskRuleEnumMap.ASSISTANT),
    [aiTaskMessages],
  );
  const aiTaskResultState = useAiTaskResultPolling(
    taskData?.uuid,
    lastAssistantMessage,
    generatedMediaField,
  );
  const displayedMessages = useMemo(() => {
    const resultMessage = aiTaskResultState.data as
      SchemaAiTaskMessageResponse | undefined;

    if (!resultMessage?.uuid) {
      return aiTaskMessages;
    }

    return aiTaskMessages.map((message) => {
      if (message.uuid !== resultMessage.uuid) {
        return message;
      }

      const currentMessageIsTerminal = isAiTaskMessageTerminal(
        message,
        generatedMediaField,
      );
      const resultMessageIsTerminal = isAiTaskMessageTerminal(
        resultMessage,
        generatedMediaField,
      );

      return currentMessageIsTerminal && !resultMessageIsTerminal
        ? message
        : resultMessage;
    });
  }, [aiTaskMessages, aiTaskResultState.data, generatedMediaField]);
  const lastDisplayedAssistantMessage = useMemo(
    () =>
      [...displayedMessages]
        .reverse()
        .find((message) => message.role === AiTaskRuleEnumMap.ASSISTANT),
    [displayedMessages],
  );
  const lastTaskMessage = useMemo(() => {
    const configuredMessages = [...displayedMessages]
      .reverse()
      .filter(
        (message) =>
          Boolean(message.ai_model_uuid) && Boolean(message.ai_model_config),
      );

    return (
      configuredMessages.find(
        (message) => message.role === AiTaskRuleEnumMap.ASSISTANT,
      ) ?? configuredMessages[0]
    );
  }, [displayedMessages]);
  const successfulMessageClearKey =
    taskData && lastDisplayedAssistantMessage?.task_status === "SUCCESS"
      ? `${taskData.uuid}:${lastDisplayedAssistantMessage.uuid}`
      : undefined;
  const isTaskLoading = aiTaskState.isLoading;
  const isGenerating = aiGenerateState.isPending;
  const hasPendingGeneration = displayedMessages.some(
    (message) =>
      message.role === AiTaskRuleEnumMap.ASSISTANT &&
      !isAiTaskMessageTerminal(message, generatedMediaField),
  );
  const isBusy = isGenerating || isTaskLoading || hasPendingGeneration;

  useScrollToLatestMessage({
    isGenerating,
    isTaskLoading,
    lastMessageUuid: lastDisplayedAssistantMessage?.uuid,
    messageCount: displayedMessages.length,
  });

  useEffect(() => {
    if (!location.hash || isTaskLoading || !displayedMessages.length) {
      return;
    }

    const messageUuid = decodeURIComponent(location.hash.slice(1));
    const messageElement = document.getElementById(messageUuid);

    messageElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [displayedMessages.length, isTaskLoading, location.hash]);

  const handleForm = useCallback(
    async (data: Readonly<Record<string, unknown>>, aiModelUuid: string) => {
      if (hasPendingGeneration) return;

      const res = await mutateAsync({
        body: {
          task_type: taskType,
          ai_model_uuid: aiModelUuid,
          ai_model_config: data,
          task_uuid: chatId ?? undefined,
        },
      });

      navigate(historyPath.replace(":chatId", res.uuid));
    },
    [
      chatId,
      hasPendingGeneration,
      historyPath,
      mutateAsync,
      navigate,
      taskType,
    ],
  );
  const handleRetry = useCallback(
    async (message: SchemaAiTaskMessageResponse) => {
      const aiModelUuid = message.ai_model_uuid;
      if (!aiModelUuid) return;

      const model = await queryClient.query(
        queryOptions("get", "/api/v1/ai-registry/models/{ai_model_uuid}", {
          params: { path: { ai_model_uuid: aiModelUuid } },
        }),
      );

      return handleForm(
        buildRetryConfig(message.ai_model_config, model),
        aiModelUuid,
      );
    },
    [handleForm, queryClient, queryOptions],
  );

  return {
    displayedMessages,
    handleForm,
    handleRetry,
    isBusy,
    isTaskLoading,
    lastAssistantMessage: lastDisplayedAssistantMessage,
    lastTaskMessage,
    successfulMessageClearKey,
    shouldShowIntro: !chatId,
  };
}
