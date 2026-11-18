import { expect, test } from "@playwright/test";

import {
  buildSubmissionSnapshot,
  countAssistantMessages,
  findLastAssistantMessage,
  findLastConfiguredMessage,
  findNewServerAssistant,
  getDefinitiveHistoryError,
  hasPendingAssistantMessage,
  isDefinitiveGenerateRejection,
  isOptimisticTurnSettled,
  mergePolledResult,
  producedNothing,
} from "../model/conversation-messages";
import { GeneratedMediaField } from "../model/task-message-status";
import type { OptimisticGenerationTurn } from "../model/conversation";

import { FetchHttpError } from "@/shared/utils/custom-fetch/fetch-errors";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";

const IMAGE = GeneratedMediaField.IMAGE;

const msg = (
  uuid: string,
  role: string,
  status: string | null = null,
  extra: Record<string, unknown> = {},
) =>
  ({
    uuid,
    role,
    task_status: status,
    ai_model_uuid: null,
    ai_model_config: {},
    ...extra,
  }) as unknown as SchemaAiTaskMessageResponse;

const httpError = (status: number) =>
  new FetchHttpError(new Response(null, { status }), new Request("http://x"));

test("last assistant message and assistant count", () => {
  const messages = [
    msg("u1", "USER"),
    msg("a1", "ASSISTANT"),
    msg("u2", "USER"),
  ];

  expect(findLastAssistantMessage(messages)?.uuid).toBe("a1");
  expect(countAssistantMessages(messages)).toBe(1);
  expect(findLastAssistantMessage([])).toBeUndefined();
});

test("polled result replaces only a non-terminal message", () => {
  const pending = [msg("u", "USER"), msg("a", "ASSISTANT", "PENDING")];
  const done = msg("a", "ASSISTANT", "SUCCESS");

  expect(mergePolledResult(pending, done, IMAGE)[1]).toBe(done);
  expect(mergePolledResult(pending, undefined, IMAGE)).toBe(pending);

  const failed = [msg("a", "ASSISTANT", "FAILED")];
  expect(mergePolledResult(failed, done, IMAGE)[0]).toBe(failed[0]);
});

test("last configured message prefers the assistant", () => {
  const configured = { ai_model_uuid: "m", ai_model_config: { prompt: "x" } };
  const messages = [
    msg("a1", "ASSISTANT", "SUCCESS", configured),
    msg("u2", "USER", null, configured),
  ];

  expect(findLastConfiguredMessage(messages)?.uuid).toBe("a1");
  expect(
    findLastConfiguredMessage([msg("u", "USER", null, configured)])?.uuid,
  ).toBe("u");
  expect(
    findLastConfiguredMessage([
      msg("a", "ASSISTANT", null, {
        ai_model_uuid: "m",
        ai_model_config: null,
      }),
    ]),
  ).toBeUndefined();
});

test("SUCCESS without media and FAILED produced nothing", () => {
  expect(producedNothing(msg("a", "ASSISTANT", "SUCCESS"), IMAGE)).toBe(true);
  expect(producedNothing(msg("a", "ASSISTANT", "FAILED"), IMAGE)).toBe(true);
  expect(producedNothing(msg("a", "ASSISTANT", "PENDING"), IMAGE)).toBe(false);
  const withImage = msg("a", "ASSISTANT", "SUCCESS", {
    ai_model_config: { images_generated: ["x.png"] },
  });
  expect(producedNothing(withImage, IMAGE)).toBe(false);
});

test("pending generation means a non-terminal assistant", () => {
  expect(
    hasPendingAssistantMessage([msg("a", "ASSISTANT", "IN_PROGRESS")], IMAGE),
  ).toBe(true);
  expect(hasPendingAssistantMessage([msg("u", "USER", null)], IMAGE)).toBe(
    false,
  );
});

const turn = (extra: Partial<OptimisticGenerationTurn>) =>
  ({
    baselineAssistantCount: 1,
    baselineMessageCount: 2,
    clientAttemptId: "c",
    snapshot: { config: {}, modelUuid: "m", prompt: "", referenceImages: [] },
    status: "accepted",
    ...extra,
  }) as OptimisticGenerationTurn;

test("an optimistic turn settles when its assistant appears", () => {
  const messages = [msg("a1", "ASSISTANT"), msg("a2", "ASSISTANT")];

  expect(
    isOptimisticTurnSettled(turn({ serverAssistantUuid: "a2" }), messages, "t"),
  ).toBe(true);
  expect(isOptimisticTurnSettled(turn({ taskUuid: "t" }), messages, "t")).toBe(
    true,
  );
  expect(isOptimisticTurnSettled(turn({ taskUuid: "t" }), messages, "x")).toBe(
    false,
  );
  expect(
    isOptimisticTurnSettled(
      turn({ taskUuid: "t", baselineAssistantCount: 2 }),
      messages,
      "t",
    ),
  ).toBe(false);
});

test("new server assistant ignores known messages", () => {
  const response = [msg("a1", "ASSISTANT"), msg("a2", "ASSISTANT")];

  expect(findNewServerAssistant(response, new Set(["a1"]))?.uuid).toBe("a2");
  expect(findNewServerAssistant(response, new Set(["a1", "a2"]))).toBe(
    undefined,
  );
  expect(findNewServerAssistant(undefined, new Set())).toBeUndefined();
});

test("submission snapshot copies config and keeps string references", () => {
  const data = { prompt: 3, reference_images: ["a", 1, "b"] };
  const snapshot = buildSubmissionSnapshot(data, "m");

  expect(snapshot).toEqual({
    config: data,
    modelUuid: "m",
    prompt: "3",
    referenceImages: ["a", "b"],
  });
  expect(snapshot.config).not.toBe(data);
  expect(buildSubmissionSnapshot({}, "m").referenceImages).toEqual([]);
});

test("only 4xx and paid-action errors are definitive rejections", () => {
  const paid = new Error("x");
  paid.name = "PaidActionRequirementError";

  expect(isDefinitiveGenerateRejection(httpError(400))).toBe(true);
  expect(isDefinitiveGenerateRejection(paid)).toBe(true);
  expect(isDefinitiveGenerateRejection(httpError(502))).toBe(false);
  expect(isDefinitiveGenerateRejection(new TypeError("network"))).toBe(false);
});

test("history errors map 403 and 404 only", () => {
  expect(getDefinitiveHistoryError(httpError(403))).toBe("forbidden");
  expect(getDefinitiveHistoryError(httpError(404))).toBe("notFound");
  expect(getDefinitiveHistoryError(httpError(500))).toBeUndefined();
  expect(getDefinitiveHistoryError(new Error("x"))).toBeUndefined();
});
