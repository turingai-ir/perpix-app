import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
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
  const navigate = useNavigate();
  const chatId = params?.chatId ?? undefined;
  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const { mutateAsync } = aiGenerateState;
  const queriedTaskData = aiTaskState.data as SchemaAiTaskResponse | undefined;
  const taskData =
    chatId && queriedTaskData?.uuid === chatId ? queriedTaskData : undefined;
  const aiTaskMessages = useMemo(() => taskData?.messages ?? [], [taskData]);
  const assistantMessage = useMemo(
    () =>
      [...aiTaskMessages]
        .reverse()
        .find((message) => message.role === AiTaskRuleEnumMap.ASSISTANT),
    [aiTaskMessages],
  );
  const aiTaskResultState = useAiTaskResultPolling(
    taskData?.uuid,
    assistantMessage,
    generatedMediaField,
  );
  const displayedMessages = useMemo(() => {
    const resultMessage = aiTaskResultState.data as
      | SchemaAiTaskMessageResponse
      | undefined;

    if (!resultMessage?.uuid) {
      return aiTaskMessages;
    }

    return aiTaskMessages.map((message) =>
      message.uuid === resultMessage.uuid ? resultMessage : message,
    );
  }, [aiTaskMessages, aiTaskResultState.data]);
  const messageListClearKey =
    taskData && aiTaskMessages.length > 0
      ? `${taskData.uuid}:${aiTaskMessages
          .map((message) => message.uuid)
          .join(":")}`
      : undefined;
  const lastMessage = displayedMessages[displayedMessages.length - 1];
  const isTaskLoading = aiTaskState.isLoading;
  const isGenerating = aiGenerateState.isPending;
  const isBusy = isGenerating || isTaskLoading;

  useScrollToLatestMessage({
    isGenerating,
    isTaskLoading,
    lastMessageUuid: lastMessage?.uuid,
    messageCount: displayedMessages.length,
  });

  const handleForm = useCallback(
    async (data: any, ai_model_uuid: string) => {
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
    [chatId, historyPath, mutateAsync, navigate, taskType],
  );

  return {
    displayedMessages,
    handleForm,
    isBusy,
    isTaskLoading,
    lastMessage,
    messageListClearKey,
    shouldShowIntro: !chatId,
  };
}
