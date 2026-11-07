import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
  isAiTaskMessageTerminal,
} from "./model";
import { useScrollToLatestMessage } from "./scroll-to-latest-message";
import type {
  GenerationHistoryErrorKind,
  OptimisticGenerationTurn,
} from "../model/conversation";

import { useReactQueryApi } from "@/shared/hooks/app";
import { buildRetryConfig } from "@/features/generation/model/retry-config";
import { FetchHttpError } from "@/shared/utils/custom-fetch/fetch-errors";

import {
  AiTaskRuleEnumMap,
  type AiRegistryModelSupportedTypesEnumKey,
  type SchemaAiTaskMessageResponse,
  type SchemaAiTaskResponse,
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
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const chatId = params?.chatId ?? undefined;
  const isSessionActiveRef = useRef(true);
  const submissionLockRef = useRef(false);
  const [optimisticTurn, setOptimisticTurn] =
    useState<OptimisticGenerationTurn>();
  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const { mutateAsync } = aiGenerateState;
  useEffect(() => {
    isSessionActiveRef.current = true;
    return () => {
      isSessionActiveRef.current = false;
    };
  }, []);
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
  const isHistoryUnavailableNow = useCallback(() => {
    if (!chatId) return false;
    const options = queryOptions("get", "/api/v1/ai-task/{task_uuid}", {
      params: { path: { task_uuid: chatId } },
    });
    const current = queryClient.getQueryState<SchemaAiTaskResponse>(
      options.queryKey,
    );
    return current?.status !== "success" || current.data?.uuid !== chatId;
  }, [chatId, queryClient, queryOptions]);
  let historyError: GenerationHistoryErrorKind | undefined;
  if (
    chatId &&
    (aiTaskState.isError || (aiTaskState.isSuccess && !taskData))
  ) {
    historyError = "temporary";
    const status =
      aiTaskState.error instanceof FetchHttpError
        ? aiTaskState.error.response.status
        : undefined;
    if (status === 403) historyError = "forbidden";
    if (status === 404) historyError = "notFound";
  }
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
    if (
      historyError ||
      !location.hash ||
      isTaskLoading ||
      !displayedMessages.length
    ) {
      return;
    }

    let messageUuid: string;
    try {
      messageUuid = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const messageElement = document.getElementById(messageUuid);

    messageElement?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }, [displayedMessages.length, historyError, isTaskLoading, location.hash]);

  const handleForm = useCallback(
    async (
      data: Readonly<Record<string, unknown>>,
      aiModelUuid: string,
    ): Promise<void | false> => {
      if (
        submissionLockRef.current ||
        hasPendingGeneration ||
        isHistoryUnavailableNow()
      ) {
        return false;
      }
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
        // Navigation may update the URL before React disposes the old session.
        if (
          !isSessionActiveRef.current ||
          window.location.pathname !== location.pathname
        ) {
          return;
        }
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
      isHistoryUnavailableNow,
      historyPath,
      location.pathname,
      displayedMessages,
      mutateAsync,
      navigate,
      taskType,
    ],
  );
  const handleRetry = useCallback(
    async (message: SchemaAiTaskMessageResponse) => {
      if (isHistoryUnavailableNow()) return;
      const aiModelUuid = message.ai_model_uuid;
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
        await handleForm(
          buildRetryConfig(message.ai_model_config, model),
          aiModelUuid,
        );
      } catch {
        // handleForm already displays the request failure in the conversation.
      }
    },
    [handleForm, isHistoryUnavailableNow, queryClient, queryOptions],
  );

  return {
    displayedMessages,
    handleForm,
    handleRetry,
    historyError,
    isRetryingHistory: aiTaskState.isFetching,
    retryHistory: () => {
      void aiTaskState.refetch();
    },
    isBusy,
    isTaskLoading,
    lastAssistantMessage: lastDisplayedAssistantMessage,
    lastTaskMessage,
    optimisticTurn: optimisticTurnForDisplay,
    successfulMessageClearKey,
    shouldShowIntro: !chatId && !optimisticTurnForDisplay,
  };
}
