import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useReactQueryApi } from "@/hook/app";
import { getPaidActionScope, usePaidActionGuard } from "@/pages/_hooks";
import type {
  AiRegistryModelSupportedTypesEnumKey,
  AiRegistryModelSupportedTypesEnumValue,
  SchemaAiTaskMessageResponse,
  SchemaAiRegistryModelSummary,
} from "@/services/api";

export const useModel = (
  supportedOutputs: Array<AiRegistryModelSupportedTypesEnumValue>,
) => {
  const { useQuery } = useReactQueryApi();

  const [currentModel, setCurrentModel] = useState<string | undefined>(
    undefined,
  );

  const modelsListState = useQuery("get", "/ai-registry/models", {
    params: {
      query: {
        supported_outputs: supportedOutputs,
      },
    },
  });

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
  const { guardAsyncAction } = usePaidActionGuard();
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
  const guardedMutateAsync = guardAsyncAction(
    aiGenerateState.mutateAsync,
    (variables) => getPaidActionScope(variables.body.task_type),
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

const VIDEO_POLLING_INTERVAL = 60_000;

const getGeneratedVideos = (message: SchemaAiTaskMessageResponse | undefined) =>
  message?.ai_model_config?.videos_generated as string[] | undefined;

export const isVideoReady = (
  message: SchemaAiTaskMessageResponse | undefined,
) => {
  const videosGenerated = getGeneratedVideos(message);

  return (
    message?.task_status === "SUCCESS" &&
    Array.isArray(videosGenerated) &&
    videosGenerated.length > 0
  );
};

export const isAiTaskMessageTerminal = (
  message: SchemaAiTaskMessageResponse | undefined,
) => message?.task_status === "FAILED" || isVideoReady(message);

export const useAiTaskResultPolling = (
  taskUuid: string | undefined,
  message: SchemaAiTaskMessageResponse | undefined,
) => {
  const { useQuery, queryOptions } = useReactQueryApi();
  const queryClient = useQueryClient();
  const aiTaskQueryKey = taskUuid
    ? queryOptions("get", "/ai-task/{task_uuid}", {
        params: { path: { task_uuid: taskUuid } },
      }).queryKey
    : undefined;

  const shouldPoll =
    !!message?.uuid &&
    !isAiTaskMessageTerminal(message) &&
    !!message.ai_external_provider_task_id;

  return useQuery(
    "get",
    "/ai-task/result/{task_message_uuid}",
    {
      params: {
        path: {
          task_message_uuid: message?.uuid ?? "",
        },
      },
    },
    {
      enabled: shouldPoll,
      refetchInterval: (query) => {
        const resultMessage = query.state.data as
          | SchemaAiTaskMessageResponse
          | undefined;

        if (!resultMessage) {
          return VIDEO_POLLING_INTERVAL;
        }

        if (resultMessage.task_status === "FAILED") {
          if (aiTaskQueryKey) {
            void queryClient.invalidateQueries({ queryKey: aiTaskQueryKey });
          }

          return false;
        }

        if (isVideoReady(resultMessage)) {
          if (aiTaskQueryKey) {
            void queryClient.invalidateQueries({ queryKey: aiTaskQueryKey });
          }

          return false;
        }

        return VIDEO_POLLING_INTERVAL;
      },
    },
  );
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
