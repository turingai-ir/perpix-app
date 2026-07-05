import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useAiTaskEvents } from "./use-ai-task-events";
import type { AiTaskMessageEvent } from "./types";

import { useReactQueryApi } from "@/hook/app";
import { APP_ROUTES_KEY } from "@/router/routes";
import {
  AiRegistryModelSupportedTypesEnumMap,
  apiClient,
  type SchemaAiTaskResponse,
} from "@/services/api";
import { APP_KEYS } from "@/utils";
import { cookies } from "@/utils/cookies";

const getTaskUrl = (task: SchemaAiTaskResponse, messageUuid: string) => {
  if (task.task_type === AiRegistryModelSupportedTypesEnumMap.VIDEO) {
    return `${APP_ROUTES_KEY.generation.video.path}/${task.uuid}#${messageUuid}`;
  }

  return `${APP_ROUTES_KEY.generation.image.path}/${task.uuid}#${messageUuid}`;
};

export function AiTaskEventsProvider() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const accessToken = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN) as
    | string
    | undefined;

  const handleTaskMessage = useCallback(
    async (payload: AiTaskMessageEvent) => {
      const taskQueryOptions = queryOptions("get", "/ai-task/{task_uuid}", {
        params: { path: { task_uuid: payload.task_uuid } },
      });
      const aiTasksListQueryKey = queryOptions("get", "/ai-task/list").queryKey;
      const walletQueryKey = queryOptions("get", "/wallet/wallet").queryKey;

      void queryClient.invalidateQueries({
        queryKey: taskQueryOptions.queryKey,
      });
      void queryClient.invalidateQueries({ queryKey: aiTasksListQueryKey });
      void queryClient.refetchQueries({ queryKey: walletQueryKey });

      const { data: task } = await apiClient.GET("/ai-task/{task_uuid}", {
        params: { path: { task_uuid: payload.task_uuid } },
      });

      if (!task) return;

      queryClient.setQueryData(taskQueryOptions.queryKey, task);

      const taskUrl = getTaskUrl(
        task as SchemaAiTaskResponse,
        payload.task_message_uuid,
      );
      const isSuccess = payload.task_status === "SUCCESS";

      toast[isSuccess ? "success" : "error"](
        isSuccess ? "تسک آماده شد" : "تسک ناموفق بود",
        {
          description: isSuccess
            ? "نتیجه‌ی تولید آماده‌ی مشاهده است."
            : "برای دیدن جزئیات و تلاش دوباره وارد تسک شو.",
          action: {
            label: "مشاهده",
            onClick: () => navigate(taskUrl),
          },
        },
      );
    },
    [navigate, queryClient, queryOptions],
  );

  useAiTaskEvents({
    accessToken,
    onTaskMessage: handleTaskMessage,
  });

  return null;
}
