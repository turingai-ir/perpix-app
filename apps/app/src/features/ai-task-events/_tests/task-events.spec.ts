import { expect, test } from "@playwright/test";

import { createProcessedEventTracker, getTaskUrl } from "../model/task-events";
import type { AiTaskMessageEvent } from "../model/types";

import type { SchemaAiTaskResponse } from "@/shared/api";

const event = (status = "SUCCESS") =>
  ({
    task_uuid: "t",
    task_message_uuid: "m",
    task_status: status,
  }) as unknown as AiTaskMessageEvent;

test("task url points to the video or image studio with the message hash", () => {
  const video = { uuid: "t", task_type: "VIDEO" } as SchemaAiTaskResponse;
  const image = { uuid: "t", task_type: "IMAGE" } as SchemaAiTaskResponse;

  expect(getTaskUrl(video, "m")).toMatch(/video\/t#m$/);
  expect(getTaskUrl(image, "m")).toMatch(/image\/t#m$/);
});

test("an event is processed once per status until it expires", () => {
  let now = 0;
  const tracker = createProcessedEventTracker(100, () => now);

  expect(tracker.hasProcessed(event())).toBe(false);
  expect(tracker.hasProcessed(event())).toBe(true);
  expect(tracker.hasProcessed(event("FAILED"))).toBe(false);

  now = 100;
  expect(tracker.hasProcessed(event())).toBe(false);
});

test("a forgotten event can be processed again", () => {
  const tracker = createProcessedEventTracker();

  tracker.hasProcessed(event());
  tracker.forget(event());

  expect(tracker.hasProcessed(event())).toBe(false);
});
