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
  FailedGenerationRequest,
  GenerationHistoryErrorKind,
  OptimisticGenerationTurn,
} from "../model/conversation";

import { useReactQueryApi } from "@/shared/hooks/app";
import {
  buildRetryConfig,
  resolveRequest,
} from "@/features/generation/model/retry-config";
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
    const configuredMessages = [...displayedMessages]
      .reverse()
      .filter(
        (message) =>
          Boolean(message.ai_model_uuid) && Boolean(message.ai_model_config),
      );
    const message =
      configuredMessages.find(
        (candidate) => candidate.role === AiTaskRuleEnumMap.ASSISTANT,
      ) ?? configuredMessages[0];

    return message
      ? { ...message, ai_model_config: getRequestConfig(message) }
      : undefined;
  }, [displayedMessages, getRequestConfig]);
  const failedRequest = useMemo<FailedGenerationRequest | undefined>(() => {
    const message = lastDisplayedAssistantMessage;
    if (message?.task_status !== "FAILED" || !message.ai_model_uuid) {
      return undefined;
    }
    return {
      config: getRequestConfig(message),
      key: message.uuid,
      modelUuid: message.ai_model_uuid,
    };
  }, [getRequestConfig, lastDisplayedAssistantMessage]);
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
    // The generate response may not include the new assistant yet; once the
    // task shows it and nothing is pending, the turn is finished.
    const acceptedWithoutAssistant =
      optimisticTurn?.status === "accepted" &&
      !optimisticTurn.serverAssistantUuid;
    if (
      acceptedWithoutAssistant &&
      !optimisticTurnForDisplay &&
      !hasPendingGeneration
    ) {
      submissionLockRef.current = false;
    }
  }, [
    displayedMessages,
    generatedMediaField,
    hasPendingGeneration,
    optimisticTurn,
    optimisticTurnForDisplay,
  ]);

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
        // Follow-ups in the same chat must not push duplicate history entries.
        if (responseTask.uuid !== chatId) {
          navigate(historyPath.replace(":chatId", responseTask.uuid));
        }
      } catch (error) {
        submissionLockRef.current = false;
        // A 4xx is a definitive rejection: nothing was created, so the turn is
        // removed and the composer explains it. Only network/5xx are ambiguous.
        const wasRejected =
          error instanceof FetchHttpError &&
          error.response.status >= 400 &&
          error.response.status < 500;
        if (
          wasRejected ||
          (error instanceof Error &&
            error.name === "PaidActionRequirementError")
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
    optimisticTurn: optimisticTurnForDisplay,
    successfulMessageClearKey,
    shouldShowIntro: !chatId && !optimisticTurnForDisplay,
  };
}

function getDefinitiveHistoryError(
  error: unknown,
): GenerationHistoryErrorKind | undefined {
  if (!(error instanceof FetchHttpError)) return undefined;
  if (error.response.status === 403) return "forbidden";
  if (error.response.status === 404) return "notFound";
  return undefined;
}
