import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useAiTaskEvents } from "./use-ai-task-events";
import type { AiTaskMessageEvent } from "./types";

import { useReactQueryApi } from "@/hooks/app";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskResponse,
} from "@/services/api";

const getTaskUrl = (task: SchemaAiTaskResponse, messageUuid: string) => {
  if (task.task_type === AiRegistryModelSupportedTypesEnumMap.VIDEO) {
    return `${APP_ROUTES_KEY.generation.video.path}/${task.uuid}#${messageUuid}`;
  }

  return `${APP_ROUTES_KEY.generation.image.path}/${task.uuid}#${messageUuid}`;
};

const PROCESSED_EVENT_TTL_MS = 5 * 60 * 1000;
const processedEventKeys = new Map<string, number>();

const getEventKey = (payload: AiTaskMessageEvent) =>
  `${payload.task_uuid}:${payload.task_message_uuid}:${payload.task_status}`;

const hasProcessedEvent = (payload: AiTaskMessageEvent) => {
  const now = Date.now();

  processedEventKeys.forEach((expiresAt, key) => {
    if (expiresAt <= now) {
      processedEventKeys.delete(key);
    }
  });

  const eventKey = getEventKey(payload);

  if (processedEventKeys.has(eventKey)) {
    return true;
  }

  processedEventKeys.set(eventKey, now + PROCESSED_EVENT_TTL_MS);
  return false;
};

export function AiTaskEventsProvider() {
  const navigate = useNavigate();
  const { t } = useAppTranslate();
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();

  const handleTaskMessage = useCallback(
    async (payload: AiTaskMessageEvent) => {
      if (hasProcessedEvent(payload)) {
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
        "/api/v1/ai-task/list",
        undefined,
      ).queryKey;
      const walletQueryKey = queryOptions(
        "get",
        "/api/v1/wallet/wallet",
        undefined,
      ).queryKey;

      queryClient.removeQueries({
        queryKey: taskResultQueryOptions.queryKey,
      });
      void queryClient.invalidateQueries({ queryKey: aiTasksListQueryKey });
      void queryClient.refetchQueries({ queryKey: walletQueryKey });

      const task = await queryClient.fetchQuery(taskQueryOptions);

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
        "/api/v1/ai-task/list",
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

  return null;
}
