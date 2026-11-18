import type { InfiniteData } from "@tanstack/react-query";

import type {
  AiRegistryModelSupportedTypesEnumKey,
  SchemaAiTaskListResponse,
  SchemaAiTaskResponse,
} from "@/shared/api";

type AiTasksListQueryInit =
  | {
      params?: {
        query?: {
          task_type?: AiRegistryModelSupportedTypesEnumKey | null;
        };
      };
    }
  | undefined;

/** Reads the `task_type` filter from an `/api/v1/ai-task` query key. */
export const getAiTasksListTaskType = (queryKey: readonly unknown[]) =>
  (queryKey[2] as AiTasksListQueryInit)?.params?.query?.task_type;

/** A list without a task-type filter, or with the task's type, shows the task. */
export const isTaskInListScope = (
  queryKey: readonly unknown[],
  task: SchemaAiTaskResponse,
) => {
  const listTaskType = getAiTasksListTaskType(queryKey);

  return !listTaskType || listTaskType === task.task_type;
};

/** Moves the task to the top of the first page and removes older copies. */
export const upsertTaskInListPages = (
  currentData: InfiniteData<SchemaAiTaskListResponse> | undefined,
  task: SchemaAiTaskResponse,
) => {
  if (!currentData?.pages?.length) {
    return currentData;
  }

  const pagesWithoutTask = currentData.pages.map((page) => ({
    ...page,
    items: page.items.filter((item) => item.uuid !== task.uuid),
  }));
  const [firstPage, ...remainingPages] = pagesWithoutTask;

  return {
    ...currentData,
    pages: [
      {
        ...firstPage,
        items: [task, ...firstPage.items],
      },
      ...remainingPages,
    ],
  };
};
