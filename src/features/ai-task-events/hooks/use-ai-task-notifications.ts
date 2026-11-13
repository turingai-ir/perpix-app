import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useAiTaskEvents } from "./use-ai-task-events";
import type { AiTaskMessageEvent } from "../model/types";
import { createProcessedEventTracker, getTaskUrl } from "../model/task-events";

import { useReactQueryApi } from "@/shared/hooks/app";
import { useAppTranslate } from "@/shared/hooks";
import type { SchemaAiTaskResponse } from "@/shared/api";

// Module scope: shared by every mount, like the stream connection itself.
const processedEvents = createProcessedEventTracker();

/** Refreshes caches and shows a toast for each finished AI task message. */
export function useAiTaskNotifications() {
  const navigate = useNavigate();
  const { t } = useAppTranslate();
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();

  const handleTaskMessage = useCallback(
    async (payload: AiTaskMessageEvent) => {
      if (processedEvents.hasProcessed(payload)) {
        return;
      }

      const taskQueryOptions = queryOptions(
        "get",
        "/api/v1/ai-task/{task_uuid}",
        {
          params: { path: { task_uuid: payload.task_uuid } },
        },
      );
      const taskResultQueryOptions = queryOptions(
        "get",
        "/api/v1/ai-task/result/{task_message_uuid}",
        {
          params: {
            path: { task_message_uuid: payload.task_message_uuid },
          },
        },
      );
      const aiTasksListQueryKey = queryOptions(
        "get",
        "/api/v1/ai-task",
        undefined,
      ).queryKey;
      const walletQueryKey = queryOptions(
        "get",
        "/api/v1/wallet",
        undefined,
      ).queryKey;

      queryClient.removeQueries({
        queryKey: taskResultQueryOptions.queryKey,
      });
      void queryClient.invalidateQueries({ queryKey: aiTasksListQueryKey });
      void queryClient.refetchQueries({ queryKey: walletQueryKey });

      let task: unknown;
      try {
        task = await queryClient.query(taskQueryOptions);
      } catch {
        // Not processed after all: let a re-delivered event try again, and
        // make an open conversation refetch once the network is back.
        processedEvents.forget(payload);
        void queryClient.invalidateQueries({
          queryKey: taskQueryOptions.queryKey,
        });
        return;
      }

      if (!task) return;

      const taskUrl = getTaskUrl(
        task as SchemaAiTaskResponse,
        payload.task_message_uuid,
      );
      const isSuccess = payload.task_status === "SUCCESS";

      toast[isSuccess ? "success" : "error"](
        isSuccess
          ? t("common.taskNotification.success")
          : t("common.taskNotification.failed"),
        {
          description: isSuccess
            ? t("common.taskNotification.successDescription")
            : t("common.taskNotification.failedDescription"),
          action: {
            label: t("common.taskNotification.view"),
            onClick: () => navigate(taskUrl),
          },
        },
      );
    },
    [navigate, queryClient, queryOptions, t],
  );

  // Events are not replayed, so a reconnect re-reads the task list snapshot.
  const handleConnected = useCallback(
    (isReconnect: boolean) => {
      if (!isReconnect) return;
      const listKey = queryOptions(
        "get",
        "/api/v1/ai-task",
        undefined,
      ).queryKey;
      void queryClient.invalidateQueries({ queryKey: listKey });
    },
    [queryClient, queryOptions],
  );

  useAiTaskEvents({
    onTaskMessage: handleTaskMessage,
    onConnected: handleConnected,
  });
}
