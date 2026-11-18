import { useReactQueryApi } from "@/hooks";
import type { AdminSort, AiTaskTypeEnum, TasksRow } from "../model/types";

export interface UseAiTasksListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  resourceUuid?: string;
  userUuid?: string;
  search?: string;
  taskType?: AiTaskTypeEnum | "ALL";
}

export type AiTasksRowItem = TasksRow;

export function useAiTasksList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  resourceUuid,
  userUuid,
  search,
  taskType,
}: UseAiTasksListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    resource_uuid: resourceUuid || undefined,
    user_uuid: userUuid || undefined,
    search: search || undefined,
    task_type:
      taskType && taskType !== "ALL" ? (taskType as AiTaskTypeEnum) : undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/tasks",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    tasks: (data?.items ?? []) as unknown as AiTasksRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
