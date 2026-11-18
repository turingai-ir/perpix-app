import {
  GenerationFailureActionEnumMap as Action,
  type SchemaAiTaskMessageError,
} from "@/shared/api/api";

/**
 * Tells the user what to do next, from the backend's prescribed `action`
 * and the `target` it blames. RETRY_NOW needs no hint: the retry button is.
 */
export function getFailureHintKey(
  error: SchemaAiTaskMessageError | null | undefined,
): string | undefined {
  if (!error) return undefined;
  if (error.action === Action.MODIFY_INPUT) {
    if (error.target === "prompt") return "common.generationHint.modifyPrompt";
    if (error.target === "reference_image") {
      return "common.generationHint.modifyReferenceImage";
    }
    return "common.generationHint.modifyInput";
  }
  if (error.action === Action.RETRY_LATER)
    return "common.generationHint.retryLater";
  if (error.action === Action.CONTACT_SUPPORT) {
    return "common.generationHint.contactSupport";
  }
  return undefined;
}
