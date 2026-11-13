import { expect, test } from "@playwright/test";

import type { SchemaAiTaskMessageResponse } from "@/shared/api";

import { getFailureHintKey } from "../model/failure-hint";
import { getGenerationErrorMessageKey } from "../model/generation-error-codes";
import { isRetryableFailure } from "../model/task-message-status";

test("capacity and transient conflict codes map to their own messages", () => {
  expect(getGenerationErrorMessageKey(1813)).toBe(
    "common.generationCapacityExceeded",
  );
  expect(getGenerationErrorMessageKey(1812)).toBe("common.generationBusy");
  expect(getGenerationErrorMessageKey(1815)).toBe("common.generationBusy");
});

test("other or missing codes fall back to the generic rejection", () => {
  expect(getGenerationErrorMessageKey(1802)).toBeUndefined();
  expect(getGenerationErrorMessageKey(undefined)).toBeUndefined();
});

const failed = (
  error: SchemaAiTaskMessageResponse["error"],
): Pick<SchemaAiTaskMessageResponse, "error"> =>
  ({ error }) as SchemaAiTaskMessageResponse;

test("a failure is retryable unless the backend says it is not", () => {
  const error = {
    action: "MODIFY_INPUT",
    message: "x",
    reason: "r",
    retryable: false,
  };
  expect(isRetryableFailure(failed({ ...error, retryable: false }))).toBe(
    false,
  );
  expect(isRetryableFailure(failed({ ...error, retryable: true }))).toBe(true);
  expect(isRetryableFailure(failed(null))).toBe(true);
});

test("failure hints follow the backend action and target", () => {
  const base = { message: "x", reason: "r", retryable: false };
  const hint = (action: string, target?: string) =>
    getFailureHintKey({ ...base, action, target });
  expect(hint("MODIFY_INPUT", "prompt")).toBe(
    "common.generationHint.modifyPrompt",
  );
  expect(hint("MODIFY_INPUT", "reference_image")).toBe(
    "common.generationHint.modifyReferenceImage",
  );
  expect(hint("MODIFY_INPUT")).toBe("common.generationHint.modifyInput");
  expect(hint("RETRY_LATER")).toBe("common.generationHint.retryLater");
  expect(hint("CONTACT_SUPPORT")).toBe("common.generationHint.contactSupport");
  expect(hint("RETRY_NOW")).toBeUndefined();
  expect(getFailureHintKey(null)).toBeUndefined();
});
