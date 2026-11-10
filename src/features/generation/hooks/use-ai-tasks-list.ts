import { useReactQueryApi } from "@/shared/hooks/app";
import type { AiRegistryModelSupportedTypesEnumKey } from "@/shared/api";

export const AI_TASKS_PAGE_SIZE = 5;

export const getAiTasksListQueryKey = (
  queryOptions: ReturnType<typeof useReactQueryApi>["queryOptions"],
) => queryOptions("get", "/api/v1/ai-task/list", undefined).queryKey;

export const useAiTasksList = (
  task_type: AiRegistryModelSupportedTypesEnumKey | undefined,
) => {
  const { useInfiniteQuery } = useReactQueryApi();

  const aiTasksListStatus = useInfiniteQuery(
    "get",
    "/api/v1/ai-task/list",
    {
      params: {
        query: {
          offset: 0,
          limit: AI_TASKS_PAGE_SIZE,
          task_type,
        },
      },
    },
    {
      enabled: !!task_type,
      initialPageParam: 0,
      pageParamName: "offset",
      getNextPageParam: (lastPage, _pages, lastPageParam) =>
        lastPage.has_next
          ? Number(lastPageParam ?? 0) + AI_TASKS_PAGE_SIZE
          : undefined,
    },
  );

  return { aiTasksListStatus };
};
