import { useState } from "react";
import {
  type InfiniteData,
  type Query,
  type QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "react-use";

import { useReactQueryApi } from "@/hook/app";
import { useActiveSubscription } from "@/feature/pricing";
import {
  PaidActionScope,
  usePaidActionGuard,
} from "@/feature/pricing/paid-action-guard";
import { isModelAllowed } from "@/pages/(app)/generation/_utils/model-access";
import type {
  AiRegistryModelSupportedTypesEnumKey,
  AiRegistryModelSupportedTypesEnumValue,
  SchemaAiTaskListResponse,
  SchemaAiTaskMessageResponse,
  SchemaAiTaskResponse,
  SchemaAiRegistryModelSummary,
} from "@/services/api";

const DEFAULT_PAGE_SIZE = 50;

const getAiTasksListQueryKey = (
  queryOptions: ReturnType<typeof useReactQueryApi>["queryOptions"],
) => queryOptions("get", "/ai-task/list").queryKey;

const getAiTasksListTaskType = (query: Query) => {
  const init = query.queryKey[2] as
    | {
        params?: {
          query?: {
            task_type?: AiRegistryModelSupportedTypesEnumKey | null;
          };
        };
      }
    | undefined;

  return init?.params?.query?.task_type;
};

const upsertAiTaskInListCache = (
  queryClient: QueryClient,
  aiTasksListQueryKey: readonly unknown[],
  task: SchemaAiTaskResponse,
) => {
  queryClient.setQueriesData<InfiniteData<SchemaAiTaskListResponse>>(
    {
      queryKey: aiTasksListQueryKey,
      predicate: (query) => {
        const listTaskType = getAiTasksListTaskType(query);

        return !listTaskType || listTaskType === task.task_type;
      },
    },
    (currentData) => {
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
    },
  );
};

export const useModel = (
  supportedOutputs: Array<AiRegistryModelSupportedTypesEnumValue>,
  initialModelUuid?: string | null,
) => {
  const { useQuery } = useReactQueryApi();
  const activeSubscriptionState = useActiveSubscription();

  const [selectedModel, setCurrentModel] = useState<string>();
  const currentSelectedModel = selectedModel ?? initialModelUuid ?? undefined;
  const allowedModelNames = activeSubscriptionState.data?.plan
    .allowed_models as readonly string[] | undefined;

  const modelsListState = useQuery("get", "/ai-registry/models", {
    params: {
      query: {
        supported_outputs: supportedOutputs,
      },
    },
  });

  const models = modelsListState.data as
    | Array<SchemaAiRegistryModelSummary>
    | undefined;
  const selectedModelSummary = models?.find(
    (model) => model.uuid === currentSelectedModel,
  );
  const currentModelSummary = selectedModelSummary ?? models?.[0];
  const currentModel = currentModelSummary?.uuid;
  const isCurrentModelAllowed = currentModelSummary
    ? isModelAllowed(currentModelSummary, allowedModelNames)
    : true;

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

  return {
    activeSubscriptionState,
    allowedModelNames,
    currentModel,
    isCurrentModelAllowed,
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
  const aiTasksListQueryKey = getAiTasksListQueryKey(queryOptions);

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
    onSuccess(task) {
      void queryClient.invalidateQueries({ queryKey: userQueryKey });
      upsertAiTaskInListCache(
        queryClient,
        aiTasksListQueryKey,
        task as SchemaAiTaskResponse,
      );
      void queryClient.invalidateQueries({
        queryKey: aiTasksListQueryKey,
        refetchType: "none",
      });

      if (task_id) {
        void aiTaskState.refetch();
      }
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

const AI_TASK_POLLING_INTERVAL = 10_000;
const AI_TASK_RESULT_INITIAL_DELAY = 5_000;

const useDelayedPollingStart = (shouldPoll: boolean, resetKey?: string) => {
  const [delayedPollingKey, setDelayedPollingKey] = useState<string>();

  useDebounce(
    () => {
      setDelayedPollingKey(shouldPoll ? resetKey : undefined);
    },
    AI_TASK_RESULT_INITIAL_DELAY,
    [resetKey, shouldPoll],
  );

  return shouldPoll && !!resetKey && delayedPollingKey === resetKey;
};

export enum GeneratedMediaField {
  IMAGE = "images_generated",
  VIDEO = "videos_generated",
}

const getGeneratedMedia = (
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => message?.ai_model_config?.[generatedMediaField] as string[] | undefined;

export const isAiTaskMessageReady = (
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  const generatedMedia = getGeneratedMedia(message, generatedMediaField);

  return (
    message?.task_status === "SUCCESS" &&
    Array.isArray(generatedMedia) &&
    generatedMedia.length > 0
  );
};

export const isAiTaskMessageTerminal = (
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) =>
  message?.task_status === "FAILED" ||
  isAiTaskMessageReady(message, generatedMediaField);

export const useAiTaskResultPolling = (
  taskUuid: string | undefined,
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  const { useQuery, queryOptions } = useReactQueryApi();
  const queryClient = useQueryClient();
  const aiTaskQueryKey = taskUuid
    ? queryOptions("get", "/ai-task/{task_uuid}", {
        params: { path: { task_uuid: taskUuid } },
      }).queryKey
    : undefined;
  const aiTasksListQueryKey = getAiTasksListQueryKey(queryOptions);
  const walletQueryKey = queryOptions("get", "/wallet/wallet").queryKey;

  const refreshAfterTaskResult = () => {
    if (aiTaskQueryKey) {
      void queryClient.invalidateQueries({ queryKey: aiTaskQueryKey });
    }

    void queryClient.invalidateQueries({ queryKey: aiTasksListQueryKey });
    void queryClient.refetchQueries({ queryKey: walletQueryKey });
  };

  const shouldPoll =
    !!message?.uuid &&
    !isAiTaskMessageTerminal(message, generatedMediaField) &&
    !!message.ai_external_provider_task_id;
  const canPollResult = useDelayedPollingStart(shouldPoll, message?.uuid);

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
      enabled: canPollResult,
      refetchInterval: (query) => {
        const resultMessage = query.state.data as
          | SchemaAiTaskMessageResponse
          | undefined;

        if (!resultMessage) {
          return AI_TASK_POLLING_INTERVAL;
        }

        if (resultMessage.task_status === "FAILED") {
          refreshAfterTaskResult();

          return false;
        }

        if (isAiTaskMessageReady(resultMessage, generatedMediaField)) {
          refreshAfterTaskResult();

          return false;
        }

        return AI_TASK_POLLING_INTERVAL;
      },
    },
  );
};

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
      getNextPageParam: (lastPage, _pages, lastPageParam) =>
        lastPage.has_next
          ? Number(lastPageParam ?? 0) + DEFAULT_PAGE_SIZE
          : undefined,
    },
  );

  return { aiTasksListStatus };
};
