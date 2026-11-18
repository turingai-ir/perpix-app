import { useReactQueryApi } from "@/hooks";
import type { AdminSort, MessageRow } from "../model/types";

export type AiTaskMessageRowItem = MessageRow;

export interface UseAiTaskMessagesParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
}

export function useAiTaskDetail(taskUuid: string) {
  const api = useReactQueryApi();
  const taskQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/tasks/{resource_uuid}",
    {
      params: {
        path: {
          resource_uuid: taskUuid,
        },
      },
    },
    {
      enabled: Boolean(taskUuid),
    },
  );

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    error: taskQuery.error,
    refetch: taskQuery.refetch,
  };
}

export function useAiTaskMessages(
  taskUuid: string,
  {
    page = 1,
    limit = 20,
    sort = "created_at",
    createdFrom,
    createdTo,
  }: UseAiTaskMessagesParams = {},
) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const messagesQuery = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/tasks/{task_uuid}/messages",
    {
      params: {
        path: {
          task_uuid: taskUuid,
        },
        query: {
          offset,
          limit,
          sort,
          created_from: createdFrom || undefined,
          created_to: createdTo || undefined,
        },
      },
    },
    {
      enabled: Boolean(taskUuid),
    },
  );

  return {
    messages: (messagesQuery.data?.items ??
      []) as unknown as AiTaskMessageRowItem[],
    totalCount: messagesQuery.data?.total_count ?? 0,
    hasMore: messagesQuery.data?.has_next ?? false,
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    refetch: messagesQuery.refetch,
  };
}
