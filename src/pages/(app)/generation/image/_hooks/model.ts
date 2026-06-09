import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useReactQueryApi } from "@/hook/app";
import type {
  AiRegistryModelSupportedTypesEnumKey,
  SchemaAiRegistryModelSummary,
} from "@/services/api";

export const useModel = () => {
  const { useQuery } = useReactQueryApi();

  const [currentModel, setCurrentModel] = useState<string | undefined>(
    undefined,
  );

  const modelsListState = useQuery("get", "/ai-registry/models");

  const modelState = useQuery(
    "get",
    "/ai-registry/models/{ai_model_uuid}",
    {
      params: {
        path: {
          ai_model_uuid: currentModel ?? "",
        },
      },
    },
    { enabled: !!currentModel },
  );

  useEffect(() => {
    if (modelsListState.data?.length && !currentModel) {
      setCurrentModel(modelsListState.data[0].uuid);
    }
  }, [currentModel, modelsListState.data]);

  return {
    currentModel,
    setCurrentModel,
    modelState,
    modelsListState: {
      ...modelsListState,
      data: modelsListState.data as unknown as Array<SchemaAiRegistryModelSummary>,
    } as const,
  };
};

export const useAiGenerate = (task_id: string | undefined) => {
  const { useMutation, useQuery, queryOptions } = useReactQueryApi();
  const queryClient = useQueryClient();
  const userQueryKey = queryOptions("get", "/user/get-info").queryKey;

  const aiTaskState = useQuery(
    "get",
    "/ai-task/{task_uuid}",
    {
      params: { path: { task_uuid: task_id! } },
    },
    {
      enabled: !!task_id,
    },
  );

  const aiGenerateState = useMutation("post", "/ai-task/generate", {
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: userQueryKey });

      if (task_id) {
        void aiTaskState.refetch();
      }
    },
  });

  return {
    aiGenerateState,
    aiTaskState,
  };
};

const DEFAULT_PAGE_SIZE = 50;

export const useAiTasksList = (
  task_type: AiRegistryModelSupportedTypesEnumKey | undefined,
) => {
  const { useInfiniteQuery } = useReactQueryApi();

  const aiTasksListStatus = useInfiniteQuery(
    "get",
    "/ai-task/list",
    {
      params: {
        query: {
          offset: 0,
          limit: DEFAULT_PAGE_SIZE,
          task_type,
        },
      },
    },
    {
      enabled: !!task_type,
      initialPageParam: 0,
      pageParamName: "offset",
      getNextPageParam: (lastPage, pages) =>
        lastPage.has_next ? pages.length * DEFAULT_PAGE_SIZE : undefined,
    },
  );

  return { aiTasksListStatus };
};
