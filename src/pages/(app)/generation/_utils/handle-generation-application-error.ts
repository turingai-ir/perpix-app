import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import {
  getCanonicalErrorPaths,
  parseGenerationApplicationError,
} from "@/pages/(app)/generation/_utils/generation-application-error";

export async function handleGenerationApplicationError({
  dynamicForm,
  error,
  onUnmappedApplicationError,
  validationFieldErrorMessage,
}: {
  dynamicForm: DynamicConfigForm;
  error: unknown;
  onUnmappedApplicationError: () => Promise<void>;
  validationFieldErrorMessage: string;
}): Promise<boolean> {
  const applicationError = await parseGenerationApplicationError(error);
  if (!applicationError) return false;

  const canonicalErrorPaths = getCanonicalErrorPaths(applicationError.detail);
  if (canonicalErrorPaths.length === 0) {
    await onUnmappedApplicationError();
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
