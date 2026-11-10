import { type InfiniteData, useQueryClient } from "@tanstack/react-query";

import { getAiTasksListQueryKey } from "./use-ai-tasks-list";
import {
  isTaskInListScope,
  upsertTaskInListPages,
} from "../model/ai-tasks-list-cache";

import { useReactQueryApi } from "@/shared/hooks/app";
import { PaidActionScope, usePaidActionGuard } from "@/features/pricing";
import type {
  SchemaAiTaskListResponse,
  SchemaAiTaskResponse,
} from "@/shared/api";

export const useAiGenerate = (task_id: string | undefined) => {
  const { useMutation, useQuery, queryOptions } = useReactQueryApi();
  const queryClient = useQueryClient();
  const { guardAsyncAction } = usePaidActionGuard();
  const userQueryKey = queryOptions(
    "get",
    "/api/v1/user/get-info",
    undefined,
  ).queryKey;
  const aiTasksListQueryKey = getAiTasksListQueryKey(queryOptions);

  const aiTaskState = useQuery(
    "get",
    "/api/v1/ai-task/{task_uuid}",
    {
      params: { path: { task_uuid: task_id! } },
    },
    {
      enabled: !!task_id,
    },
  );

  const aiGenerateState = useMutation("post", "/api/v1/ai-task/generate", {
    onSuccess(taskData) {
      const task = taskData as SchemaAiTaskResponse;
      void queryClient.invalidateQueries({ queryKey: userQueryKey });
      if (task?.uuid) {
        const singleTaskQueryKey = queryOptions(
          "get",
          "/api/v1/ai-task/{task_uuid}",
          {
            params: { path: { task_uuid: task.uuid } },
          },
        ).queryKey;
        queryClient.setQueryData(singleTaskQueryKey, task);
      }
      queryClient.setQueriesData<InfiniteData<SchemaAiTaskListResponse>>(
        {
          queryKey: aiTasksListQueryKey,
          predicate: (query) => isTaskInListScope(query.queryKey, task),
        },
        (currentData) => upsertTaskInListPages(currentData, task),
      );
      void queryClient.invalidateQueries({
        queryKey: aiTasksListQueryKey,
        refetchType: "none",
      });
    },
  });
  const guardedMutateAsync = guardAsyncAction(
    aiGenerateState.mutateAsync,
    () => PaidActionScope.AI_TASK_WRITE,
  );

  return {
    aiGenerateState: {
      ...aiGenerateState,
      mutate: aiGenerateState.mutate,
      mutateAsync: guardedMutateAsync,
    },
    aiTaskState,
  };
};
