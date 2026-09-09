import { useMemo } from "react";

import {
  FILE_MANAGER_ALLOWED_CONTENT_TYPES,
  useFilesPreviews,
  useInfiniteUserFiles,
} from "@/feature/file-manager";
import { useReactQueryApi } from "@/hooks/app";
import type {
  SchemaAiRegistryModelSummary,
  SchemaAiTaskResponse,
  SchemaFileManagerUserFilesResponse,
} from "@/services/api";

export function useDashboardContent(allowedModelNames: readonly string[]) {
  const { useQuery } = useReactQueryApi();
  const tasksState = useQuery("get", "/api/v1/ai-task/list", {
    params: { query: { offset: 0, limit: 6 } },
  });
  const modelsState = useQuery("get", "/api/v1/ai-registry/models", undefined);
  const filesState = useInfiniteUserFiles({
    contentTypes: FILE_MANAGER_ALLOWED_CONTENT_TYPES,
    limit: 6,
  }).getUserFilesState;
  const firstFilesPage = filesState.data?.pages[0] as unknown as
    | SchemaFileManagerUserFilesResponse
    | undefined;
  const files = firstFilesPage?.files ?? [];
  const fileUuids = files.flatMap((file) => (file.uuid ? [file.uuid] : []));
  const previewsState = useFilesPreviews(
    fileUuids,
    !filesState.isError,
  ).getFilesPreviewsState;
  const tasksResponse = tasksState.data as unknown as
    | { items: readonly SchemaAiTaskResponse[] }
    | undefined;
  const tasks = Array.from(tasksResponse?.items ?? []);
  const models = Array.from(
    (modelsState.data as unknown as readonly SchemaAiRegistryModelSummary[]) ??
      [],
  );
  const featuredModels = useMemo(() => {
    const usage = new Map<string, number>();
    tasks.forEach((task) =>
      task.messages.forEach((message) => {
        if (message.ai_model_uuid) {
          usage.set(
            message.ai_model_uuid,
            (usage.get(message.ai_model_uuid) ?? 0) + 1,
          );
        }
      }),
    );
    const accessibleModels = allowedModelNames.length
      ? models.filter((model) => allowedModelNames.includes(model.name))
      : models;
    return [...accessibleModels]
      .sort(
        (first, second) =>
          (usage.get(second.uuid) ?? 0) - (usage.get(first.uuid) ?? 0),
      )
      .slice(0, 4);
  }, [allowedModelNames, models, tasks]);

  return {
    featuredModels,
    files,
    filesState,
    modelsState,
    previewsState,
    tasks,
    tasksState,
  };
}
