export type GenerationHistoryErrorKind = "notFound" | "forbidden" | "temporary";

/** Inputs of a failed generation, restored into the composer once per key. */
export interface FailedGenerationRequest {
  config: Readonly<Record<string, unknown>>;
  key: string;
  modelUuid: string;
}

export interface GenerationSubmissionSnapshot {
  config: Readonly<Record<string, unknown>>;
  modelUuid: string;
  prompt: string;
  referenceImages: readonly string[];
}

export interface OptimisticGenerationTurn {
  baselineMessageCount: number;
  baselineAssistantCount: number;
  clientAttemptId: string;
  errorKind?: "application" | "network";
  serverAssistantUuid?: string;
  taskUuid?: string;
  snapshot: GenerationSubmissionSnapshot;
  status: "submitting" | "accepted" | "failed";
}

export interface GenerationComposerIntent {
  config: Readonly<Record<string, unknown>>;
  id: string;
  mergeReferences?: boolean;
  modelUuid?: string;
  /** Replace the whole draft instead of only setting the given fields. */
  replace?: boolean;
  requiredFields?: readonly string[];
}
