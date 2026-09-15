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
  requiredFields?: readonly string[];
}
