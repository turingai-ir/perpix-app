import type { DynamicConfigForm } from "@/features/dynamic-config";
import {
  getCanonicalErrorPaths,
  parseGenerationApplicationError,
} from "@/features/generation/model/generation-application-error";

export async function handleGenerationApplicationError({
  dynamicForm,
  error,
  onUnmappedApplicationError,
  validationFieldErrorMessage,
}: {
  dynamicForm: DynamicConfigForm;
  error: unknown;
  onUnmappedApplicationError: (detail: unknown) => Promise<void>;
  validationFieldErrorMessage: string;
}): Promise<boolean> {
  const applicationError = await parseGenerationApplicationError(error);
  if (!applicationError) return false;

  const canonicalErrorPaths = getCanonicalErrorPaths(applicationError.detail);
  if (canonicalErrorPaths.length === 0) {
    await onUnmappedApplicationError(applicationError.detail);
    return true;
  }

  canonicalErrorPaths
    .filter((fieldPath) => fieldPath in dynamicForm.properties)
    .forEach((fieldPath) =>
      dynamicForm.form.setError(fieldPath, {
        type: "server",
        message: validationFieldErrorMessage,
      }),
    );
  return true;
}
