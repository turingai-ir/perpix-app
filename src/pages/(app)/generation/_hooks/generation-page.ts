import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
  isAiTaskMessageTerminal,
} from "./model";
import { useScrollToLatestMessage } from "./scroll-to-latest-message";
import type { OptimisticGenerationTurn } from "../_types/conversation";

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
  const submissionLockRef = useRef(false);
  const [optimisticTurn, setOptimisticTurn] =
    useState<OptimisticGenerationTurn>();
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
      // A full task snapshot that is already terminal is authoritative. This
      // prevents an older in-flight polling response from reviving or flipping
      // a result after SSE refreshed the task.
      return currentMessageIsTerminal ? message : resultMessage;
    });
  }, [aiTaskMessages, aiTaskResultState.data, generatedMediaField]);
  const lastDisplayedAssistantMessage = useMemo(
    () =>
      [...displayedMessages]
        .reverse()
        .find((message) => message.role === AiTaskRuleEnumMap.ASSISTANT),
    [displayedMessages],
  );
  const lastTaskMessage = useMemo(
    () =>
      [...displayedMessages]
        .reverse()
        .find(
          (message) =>
            Boolean(message.ai_model_uuid) && Boolean(message.ai_model_config),
        ),
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
  const optimisticTurnForDisplay = useMemo(() => {
    if (!optimisticTurn) return undefined;
    const matchedAssistant =
      optimisticTurn.serverAssistantUuid &&
      displayedMessages.some(
        (message) => message.uuid === optimisticTurn.serverAssistantUuid,
      );
    const taskHasNewAssistant = Boolean(
      optimisticTurn.taskUuid &&
      taskData?.uuid === optimisticTurn.taskUuid &&
      displayedMessages.filter(
        (message) => message.role === AiTaskRuleEnumMap.ASSISTANT,
      ).length > optimisticTurn.baselineAssistantCount,
    );
    return matchedAssistant || taskHasNewAssistant ? undefined : optimisticTurn;
  }, [displayedMessages, optimisticTurn, taskData?.uuid]);
  const hasOptimisticPending = Boolean(
    optimisticTurnForDisplay && optimisticTurnForDisplay.status !== "failed",
  );
  const isBusy =
    isGenerating ||
    isTaskLoading ||
    hasPendingGeneration ||
    hasOptimisticPending;

  useEffect(() => {
    const serverMessage = optimisticTurn?.serverAssistantUuid
      ? displayedMessages.find(
          (message) => message.uuid === optimisticTurn.serverAssistantUuid,
        )
      : undefined;
    if (
      serverMessage &&
      isAiTaskMessageTerminal(serverMessage, generatedMediaField)
    ) {
      submissionLockRef.current = false;
    }
  }, [displayedMessages, generatedMediaField, optimisticTurn]);

  useScrollToLatestMessage({
    isGenerating: isGenerating || hasOptimisticPending,
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
      if (submissionLockRef.current || hasPendingGeneration) return;
      submissionLockRef.current = true;
      const existingMessageIds = new Set(
        displayedMessages.map((message) => message.uuid),
      );
      const clientAttemptId = crypto.randomUUID();
      const snapshot = {
        config: structuredClone(data),
        modelUuid: aiModelUuid,
        prompt: String(data.prompt ?? ""),
        referenceImages: Array.isArray(data.reference_images)
          ? data.reference_images.filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      };
      setOptimisticTurn({
        baselineAssistantCount: displayedMessages.filter(
          (message) => message.role === AiTaskRuleEnumMap.ASSISTANT,
        ).length,
        baselineMessageCount: displayedMessages.length,
        clientAttemptId,
        snapshot,
        status: "submitting",
        taskUuid: chatId,
      });

      try {
        const res = await mutateAsync({
          body: {
            task_type: taskType,
            ai_model_uuid: aiModelUuid,
            ai_model_config: data,
            task_uuid: chatId ?? undefined,
          },
        });
        const responseTask = res as SchemaAiTaskResponse;
        const responseMessages = Array.isArray(responseTask.messages)
          ? responseTask.messages
          : [];
        const serverAssistant = [...responseMessages]
          .reverse()
          .find(
            (message) =>
              message.role === AiTaskRuleEnumMap.ASSISTANT &&
              !existingMessageIds.has(message.uuid),
          );
        setOptimisticTurn((current) =>
          current?.clientAttemptId === clientAttemptId
            ? {
                ...current,
                serverAssistantUuid: serverAssistant?.uuid,
                status: "accepted",
                taskUuid: responseTask.uuid,
              }
            : current,
        );
        navigate(historyPath.replace(":chatId", responseTask.uuid));
      } catch (error) {
        submissionLockRef.current = false;
        if (
          error instanceof Error &&
          error.name === "PaidActionRequirementError"
        ) {
          setOptimisticTurn(undefined);
        } else {
          setOptimisticTurn((current) =>
            current?.clientAttemptId === clientAttemptId
              ? { ...current, errorKind: "network", status: "failed" }
              : current,
          );
        }
        throw error;
      }
    },
    [
      chatId,
      hasPendingGeneration,
      historyPath,
      displayedMessages,
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
    lastTaskMessage,
    optimisticTurn: optimisticTurnForDisplay,
    successfulMessageClearKey,
    shouldShowIntro: !chatId && !optimisticTurnForDisplay,
  };
}
