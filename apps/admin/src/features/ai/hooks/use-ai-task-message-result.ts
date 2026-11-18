import { useReactQueryApi } from "@/hooks";

export function useAiTaskMessageResult(
  userUuid?: string,
  taskMessageUuid?: string,
) {
  const api = useReactQueryApi();
  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/users/{user_uuid}/messages/{task_message_uuid}",
    {
      params: {
        path: {
          user_uuid: userUuid || "",
          task_message_uuid: taskMessageUuid || "",
        },
      },
    },
    {
      enabled: Boolean(userUuid && taskMessageUuid),
    },
  );

  return {
    result: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
