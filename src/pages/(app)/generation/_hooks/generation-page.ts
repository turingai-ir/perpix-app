import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
  isAiTaskMessageTerminal,
} from "./model";
import { useScrollToLatestMessage } from "./scroll-to-latest-message";

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
      | SchemaAiTaskMessageResponse
      | undefined;

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
    async (data: any, ai_model_uuid: string) => {
      if (hasPendingGeneration) return;

      const res = await mutateAsync({
        body: {
          task_type: taskType,
          ai_model_uuid,
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
    (message: SchemaAiTaskMessageResponse) => {
      if (!message.ai_model_uuid) return;

      return handleForm(message.ai_model_config, message.ai_model_uuid);
    },
    [handleForm],
  );

  return {
    displayedMessages,
    handleForm,
    handleRetry,
    isBusy,
    isTaskLoading,
    lastAssistantMessage: lastDisplayedAssistantMessage,
    successfulMessageClearKey,
    shouldShowIntro: !chatId,
  };
}
