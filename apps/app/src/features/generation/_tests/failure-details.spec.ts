import { expect, test } from "@playwright/test";

import {
  generationFailureReasonEnumValues,
  type SchemaAiTaskMessageResponse,
  type SchemaGenerationFailureReasonEnum,
} from "@/shared/api/api";
import locale from "@/shared/i18n/locales/fa.json" with { type: "json" };

import {
  getFailureTitleKey,
  isFailureFree,
  isUnderReview,
} from "../model/failure-details";

type Message = Pick<
  SchemaAiTaskMessageResponse,
  "error" | "task_status" | "under_review"
>;

const error = (
  reason: SchemaGenerationFailureReasonEnum,
): Message["error"] => ({
  action: "RETRY_NOW",
  message: "x",
  reason,
  retryable: true,
});

const message = (overrides: Partial<Message>): Message => ({
  error: null,
  task_status: "FAILED",
  under_review: false,
  ...overrides,
});

const translated = (key: string) =>
  key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      locale,
    );

test("every reason the API publishes has a title, and the title is translated", () => {
  expect(generationFailureReasonEnumValues.length).toBeGreaterThan(0);
  for (const reason of generationFailureReasonEnumValues) {
    const key = getFailureTitleKey(message({ error: error(reason) }));
    expect(key, reason).toBeDefined();
    expect(typeof translated(key as string), `${reason} → ${key}`).toBe(
      "string",
    );
  }
});

test("a missing or unknown reason keeps the generic title", () => {
  expect(getFailureTitleKey(message({}))).toBeUndefined();
  const unknown = error("INTERNAL");
  expect(
    getFailureTitleKey(
      message({
        error: unknown && {
          ...unknown,
          reason: "NEW" as SchemaGenerationFailureReasonEnum,
        },
      }),
    ),
  ).toBeUndefined();
});

test("only a failed answer with a backend reason is promised to be free", () => {
  expect(isFailureFree(message({ error: error("INTERNAL") }))).toBe(true);
  // Older failures have no structured reason; nothing is known about their cost.
  expect(isFailureFree(message({}))).toBe(false);
  // A SUCCESS without media is shown as a failure but was settled.
  expect(
    isFailureFree(
      message({ error: error("INTERNAL"), task_status: "SUCCESS" }),
    ),
  ).toBe(false);
});

test("a review shows only while the answer has not finished", () => {
  const review = (task_status: Message["task_status"], under_review = true) =>
    isUnderReview(message({ task_status, under_review }));
  expect(review("IN_PROGRESS")).toBe(true);
  expect(review("PENDING")).toBe(true);
  expect(review("FAILED")).toBe(false);
  expect(review("IN_PROGRESS", false)).toBe(false);
  expect(isUnderReview(undefined)).toBe(false);
});
