import {
  GenerationFailureReasonEnumMap,
  type SchemaAiTaskMessageResponse,
  type SchemaGenerationFailureReasonEnum,
} from "@/shared/api/api";

const R = GenerationFailureReasonEnumMap;

/**
 * One title per category the API publishes. Keyed by the generated type, so
 * a reason the backend adds without a translation here fails `tsc`.
 */
const FAILURE_TITLE_KEYS: Record<SchemaGenerationFailureReasonEnum, string> = {
  [R.CONTENT_POLICY]: "common.generationFailure.reason.CONTENT_POLICY",
  [R.INVALID_INPUT]: "common.generationFailure.reason.INVALID_INPUT",
  [R.RATE_LIMITED]: "common.generationFailure.reason.RATE_LIMITED",
  [R.PROVIDER_UNAVAILABLE]:
    "common.generationFailure.reason.PROVIDER_UNAVAILABLE",
  [R.PROVIDER_TIMEOUT]: "common.generationFailure.reason.PROVIDER_TIMEOUT",
  [R.PLATFORM_CONFIGURATION]:
    "common.generationFailure.reason.PLATFORM_CONFIGURATION",
  [R.PROVIDER_FAILED]: "common.generationFailure.reason.PROVIDER_FAILED",
  [R.INTERNAL]: "common.generationFailure.reason.INTERNAL",
  [R.OPERATOR]: "common.generationFailure.reason.OPERATOR",
};

type Message = Pick<
  SchemaAiTaskMessageResponse,
  "error" | "task_status" | "under_review"
>;

/** A title naming why it failed; undefined keeps the generic one. */
export function getFailureTitleKey(message: Message): string | undefined {
  const reason = message.error?.reason;
  // An older backend or a cached answer may carry a reason this app lacks.
  return reason
    ? (FAILURE_TITLE_KEYS[reason] as string | undefined)
    : undefined;
}

/**
 * The backend releases the reservation of every failed generation, so a
 * FAILED answer with a backend reason cost nothing. Older failures carry no
 * reason and a SUCCESS without media was charged, so neither claims it.
 */
export const isFailureFree = (message: Message): boolean =>
  message.task_status === "FAILED" && !!message.error?.reason;

/** Stopped for a support review: not generating, and not failed yet. */
export const isUnderReview = (message: Message | undefined): boolean =>
  !!message?.under_review &&
  (message.task_status === "PENDING" || message.task_status === "IN_PROGRESS");
