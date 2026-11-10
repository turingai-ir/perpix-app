import { useEffect, useEffectEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "react-use";

import { getAiTasksListQueryKey } from "./use-ai-tasks-list";
import {
  type GeneratedMediaField,
  isAiTaskMessageTerminal,
} from "../model/task-message-status";

import { useReactQueryApi } from "@/shared/hooks/app";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";

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

export const useAiTaskResultPolling = (
  taskUuid: string | undefined,
  message: SchemaAiTaskMessageResponse | undefined,
  generatedMediaField: GeneratedMediaField,
) => {
  const { useQuery, queryOptions } = useReactQueryApi();
  const queryClient = useQueryClient();
  const aiTaskQueryKey = taskUuid
    ? queryOptions("get", "/api/v1/ai-task/{task_uuid}", {
        params: { path: { task_uuid: taskUuid } },
      }).queryKey
    : undefined;
  const aiTasksListQueryKey = getAiTasksListQueryKey(queryOptions);
  const walletQueryKey = queryOptions(
    "get",
    "/api/v1/wallet/wallet",
    undefined,
  ).queryKey;

  const refreshAfterTaskResult = useEffectEvent(() => {
    if (aiTaskQueryKey) {
      void queryClient.invalidateQueries({ queryKey: aiTaskQueryKey });
    }

    void queryClient.invalidateQueries({ queryKey: aiTasksListQueryKey });
    void queryClient.refetchQueries({ queryKey: walletQueryKey });
  });

  const shouldPoll =
    !!message?.uuid && !isAiTaskMessageTerminal(message, generatedMediaField);
  const canPollResult = useDelayedPollingStart(shouldPoll, message?.uuid);

  const resultState = useQuery(
    "get",
    "/api/v1/ai-task/result/{task_message_uuid}",
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
          SchemaAiTaskMessageResponse | undefined;

        // Must stay pure: TanStack calls this on every options update.
        return isAiTaskMessageTerminal(resultMessage, generatedMediaField)
          ? false
          : AI_TASK_POLLING_INTERVAL;
      },
    },
  );
  const result = resultState.data as SchemaAiTaskMessageResponse | undefined;
  const terminalResultKey =
    result?.uuid && isAiTaskMessageTerminal(result, generatedMediaField)
      ? `${result.uuid}:${result.task_status}`
      : undefined;

  // Refresh the task, history and wallet exactly once per finished result.
  useEffect(() => {
    if (terminalResultKey) refreshAfterTaskResult();
  }, [terminalResultKey]);

  return resultState;
};
