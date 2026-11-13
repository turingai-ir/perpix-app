import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  type GeneratedMediaField,
  isAiTaskMessageTerminal,
} from "../model/task-message-status";
import {
  buildSubmissionSnapshot,
  countAssistantMessages,
  findNewServerAssistant,
  isDefinitiveGenerateRejection,
  isOptimisticTurnSettled,
} from "../model/conversation-messages";
import type { OptimisticGenerationTurn } from "../model/conversation";
import type { useAiGenerate } from "./use-ai-generate";

import type {
  AiRegistryModelSupportedTypesEnumKey,
  SchemaAiTaskMessageResponse,
  SchemaAiTaskResponse,
} from "@/shared/api";

interface UseGenerationSubmissionInput {
  chatId: string | undefined;
  displayedMessages: readonly SchemaAiTaskMessageResponse[];
  generatedMediaField: GeneratedMediaField;
  hasPendingGeneration: boolean;
  historyPath: string;
  isHistoryUnavailableNow: () => boolean;
  mutateAsync: ReturnType<
    typeof useAiGenerate
  >["aiGenerateState"]["mutateAsync"];
  taskType: AiRegistryModelSupportedTypesEnumKey;
  taskUuid: string | undefined;
}

/** Submits a generation and tracks its optimistic turn until the task has it. */
export function useGenerationSubmission({
  chatId,
  displayedMessages,
  generatedMediaField,
  hasPendingGeneration,
  historyPath,
  isHistoryUnavailableNow,
  mutateAsync,
  taskType,
  taskUuid,
}: UseGenerationSubmissionInput) {
  const location = useLocation();
  const navigate = useNavigate();
  const isSessionActiveRef = useRef(true);
  const submissionLockRef = useRef(false);
  const [optimisticTurn, setOptimisticTurn] =
    useState<OptimisticGenerationTurn>();
  useEffect(() => {
    isSessionActiveRef.current = true;
    return () => {
      isSessionActiveRef.current = false;
    };
  }, []);
  const optimisticTurnForDisplay = useMemo(() => {
    if (!optimisticTurn) return undefined;
    return isOptimisticTurnSettled(optimisticTurn, displayedMessages, taskUuid)
      ? undefined
      : optimisticTurn;
  }, [displayedMessages, optimisticTurn, taskUuid]);

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
      setOptimisticTurn({
        baselineAssistantCount: countAssistantMessages(displayedMessages),
        baselineMessageCount: displayedMessages.length,
        clientAttemptId,
        snapshot: buildSubmissionSnapshot(data, aiModelUuid),
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
        const serverAssistant = findNewServerAssistant(
          responseTask.messages,
          existingMessageIds,
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
        if (isDefinitiveGenerateRejection(error)) {
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

  return { handleForm, optimisticTurn: optimisticTurnForDisplay };
}
