import { expect, test } from "@playwright/test";

import {
  getAiTasksListTaskType,
  isTaskInListScope,
  upsertTaskInListPages,
} from "../model/ai-tasks-list-cache";
import {
  GeneratedMediaField,
  isAiTaskMessageReady,
  isAiTaskMessageTerminal,
} from "../model/task-message-status";

import type {
  SchemaAiTaskListResponse,
  SchemaAiTaskMessageResponse,
  SchemaAiTaskResponse,
} from "@/shared/api";

const task = (uuid: string, taskType = "IMAGE") =>
  ({ uuid, task_type: taskType }) as unknown as SchemaAiTaskResponse;

const page = (uuids: string[], hasNext = false) =>
  ({
    items: uuids.map((uuid) => task(uuid)),
    has_next: hasNext,
  }) as unknown as SchemaAiTaskListResponse;

const listKey = (taskType?: string) => [
  "get",
  "/api/v1/ai-task/list",
  taskType ? { params: { query: { task_type: taskType } } } : undefined,
];

test("list task type is read from the query key", () => {
  expect(getAiTasksListTaskType(listKey("VIDEO"))).toBe("VIDEO");
  expect(getAiTasksListTaskType(listKey())).toBeUndefined();
});

test("a task belongs to unfiltered lists and to lists of its own type", () => {
  expect(isTaskInListScope(listKey(), task("a", "IMAGE"))).toBe(true);
  expect(isTaskInListScope(listKey("IMAGE"), task("a", "IMAGE"))).toBe(true);
  expect(isTaskInListScope(listKey("VIDEO"), task("a", "IMAGE"))).toBe(false);
});

test("upsert moves the task to the top and removes older copies", () => {
  const data = {
    pages: [page(["b", "c"]), page(["a", "d"])],
    pageParams: [0, 5],
  };

  const result = upsertTaskInListPages(data, task("a"));

  expect(result?.pages.map((p) => p.items.map((item) => item.uuid))).toEqual([
    ["a", "b", "c"],
    ["d"],
  ]);
  expect(result?.pageParams).toEqual([0, 5]);
});

test("upsert leaves an empty cache untouched", () => {
  const empty = { pages: [], pageParams: [] };

  expect(upsertTaskInListPages(undefined, task("a"))).toBeUndefined();
  expect(upsertTaskInListPages(empty, task("a"))).toBe(empty);
});

const message = (status: string, images?: string[]) =>
  ({
    task_status: status,
    ai_model_config: images ? { images_generated: images } : {},
  }) as unknown as SchemaAiTaskMessageResponse;

test("a message is ready only when SUCCESS has media", () => {
  const field = GeneratedMediaField.IMAGE;

  expect(isAiTaskMessageReady(message("SUCCESS", ["x.png"]), field)).toBe(true);
  expect(isAiTaskMessageReady(message("SUCCESS", []), field)).toBe(false);
  expect(isAiTaskMessageReady(message("PENDING", ["x.png"]), field)).toBe(
    false,
  );
});

test("SUCCESS and FAILED are terminal, even without media", () => {
  const field = GeneratedMediaField.IMAGE;

  expect(isAiTaskMessageTerminal(message("SUCCESS"), field)).toBe(true);
  expect(isAiTaskMessageTerminal(message("FAILED"), field)).toBe(true);
  expect(isAiTaskMessageTerminal(message("PENDING"), field)).toBe(false);
  expect(isAiTaskMessageTerminal(undefined, field)).toBe(false);
});
