import type { SchemaAiTaskMessageResponse } from "@/shared/api";

export enum GeneratedMediaField {
  IMAGE = "images_generated",
  VIDEO = "videos_generated",
}

const getGeneratedMedia = (
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  const value = message?.ai_model_config?.[generatedMediaField];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : undefined;
};

export const isAiTaskMessageReady = (
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  const generatedMedia = getGeneratedMedia(message, generatedMediaField);

  return (
    message?.task_status === "SUCCESS" &&
    Array.isArray(generatedMedia) &&
    generatedMedia.length > 0
  );
};

/** The backend marks failures that resubmitting the same input cannot fix. */
export const isRetryableFailure = (
  message: SchemaAiTaskMessageResponse | undefined,
) => message?.error?.retryable !== false;

/**
 * The backend writes SUCCESS together with the generated media in one
 * update, so SUCCESS is final even when the provider returned no output.
 */
export const isAiTaskMessageTerminal = (
  message: SchemaAiTaskMessageResponse | undefined,
  // Kept for call-site symmetry with isAiTaskMessageReady.
  _generatedMediaField: GeneratedMediaField,
) => message?.task_status === "FAILED" || message?.task_status === "SUCCESS";
