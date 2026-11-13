import {
  type GeneratedMediaField,
  isAiTaskMessageReady,
  isAiTaskMessageTerminal,
} from "./task-message-status";
import type {
  GenerationHistoryErrorKind,
  GenerationSubmissionSnapshot,
  OptimisticGenerationTurn,
} from "./conversation";

import { FetchHttpError } from "@/shared/utils/custom-fetch/fetch-errors";
import type {
  SchemaAiTaskMessageResponse,
  SchemaJsonObjectInput,
} from "@/shared/api";

type Message = SchemaAiTaskMessageResponse;

const isAssistant = (message: Message) => message.role === "ASSISTANT";

export const findLastAssistantMessage = (messages: readonly Message[]) =>
  [...messages].reverse().find(isAssistant);

export const countAssistantMessages = (messages: readonly Message[]) =>
  messages.filter(isAssistant).length;

/**
 * Replaces the polled message with the polling result. A full task snapshot
 * that is already terminal is authoritative. This prevents an older in-flight
 * polling response from reviving or flipping a result after SSE refreshed the
 * task.
 */
export const mergePolledResult = (
  messages: readonly Message[],
  resultMessage: Message | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  if (!resultMessage?.uuid) {
    return messages;
  }

  return messages.map((message) => {
    if (message.uuid !== resultMessage.uuid) {
      return message;
    }

    return isAiTaskMessageTerminal(message, generatedMediaField)
      ? message
      : resultMessage;
  });
};

/** The latest configured assistant message, or else the latest configured one. */
export const findLastConfiguredMessage = (messages: readonly Message[]) => {
  const configuredMessages = [...messages]
    .reverse()
    .filter(
      (message) =>
        Boolean(message.ai_model_uuid) && Boolean(message.ai_model_config),
    );

  return configuredMessages.find(isAssistant) ?? configuredMessages[0];
};

/** A SUCCESS without output failed for the user just like FAILED. */
export const producedNothing = (
  message: Message | undefined,
  generatedMediaField: GeneratedMediaField,
) =>
  isAiTaskMessageTerminal(message, generatedMediaField) &&
  !isAiTaskMessageReady(message, generatedMediaField);

export const hasPendingAssistantMessage = (
  messages: readonly Message[],
  generatedMediaField: GeneratedMediaField,
) =>
  messages.some(
    (message) =>
      isAssistant(message) &&
      !isAiTaskMessageTerminal(message, generatedMediaField),
  );

/** The optimistic turn is shown until the task contains its assistant reply. */
export const isOptimisticTurnSettled = (
  turn: OptimisticGenerationTurn,
  messages: readonly Message[],
  taskUuid: string | undefined,
) => {
  const matchedAssistant =
    turn.serverAssistantUuid &&
    messages.some((message) => message.uuid === turn.serverAssistantUuid);
  const taskHasNewAssistant = Boolean(
    turn.taskUuid &&
    taskUuid === turn.taskUuid &&
    countAssistantMessages(messages) > turn.baselineAssistantCount,
  );

  return Boolean(matchedAssistant || taskHasNewAssistant);
};

export const findNewServerAssistant = (
  responseMessages: unknown,
  existingMessageIds: ReadonlySet<string>,
) => {
  const messages = Array.isArray(responseMessages)
    ? (responseMessages as Message[])
    : [];

  return [...messages]
    .reverse()
    .find(
      (message) =>
        isAssistant(message) && !existingMessageIds.has(message.uuid),
    );
};

/** Converts form data to the API's JSON type; non-JSON values (undefined) are dropped. */
export const toJsonObject = (
  data: Readonly<Record<string, unknown>>,
): SchemaJsonObjectInput => JSON.parse(JSON.stringify(data));

export const buildSubmissionSnapshot = (
  data: Readonly<Record<string, unknown>>,
  modelUuid: string,
): GenerationSubmissionSnapshot => ({
  config: structuredClone(data),
  modelUuid,
  prompt: String(data.prompt ?? ""),
  referenceImages: Array.isArray(data.reference_images)
    ? data.reference_images.filter(
        (value): value is string => typeof value === "string",
      )
    : [],
});

/**
 * A 4xx is a definitive rejection: nothing was created, so the turn is
 * removed and the composer explains it. Only network/5xx are ambiguous.
 */
export const isDefinitiveGenerateRejection = (error: unknown) => {
  const wasRejected =
    error instanceof FetchHttpError &&
    error.response.status >= 400 &&
    error.response.status < 500;

  return (
    wasRejected ||
    (error instanceof Error && error.name === "PaidActionRequirementError")
  );
};

export const getDefinitiveHistoryError = (
  error: unknown,
): GenerationHistoryErrorKind | undefined => {
  if (!(error instanceof FetchHttpError)) return undefined;
  if (error.response.status === 403) return "forbidden";
  if (error.response.status === 404) return "notFound";
  return undefined;
};
