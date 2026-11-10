import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/shared/api";
import { GeneratedMediaField, useGenerationPage } from "../../hooks";
import type { GenerationFocusPhase } from "../../components/generation-focus-state";

function getFocusPhase(
  optimisticStatus: string | undefined,
  taskStatus: string | null | undefined,
): GenerationFocusPhase {
  if (optimisticStatus === "submitting") return "submitting";
  if (taskStatus === "IN_PROGRESS") return "processing";
  return "queued";
}

export function useVideoStudio() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const generationPage = useGenerationPage({
    generatedMediaField: GeneratedMediaField.VIDEO,
    historyPath: APP_ROUTES_KEY.generation.video.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.VIDEO,
  });

  const lastTaskStatus =
    generationPage.lastAssistantMessage?.task_status ??
    generationPage.lastTaskMessage?.task_status;
  const focusPhase = getFocusPhase(
    generationPage.optimisticTurn?.status,
    lastTaskStatus,
  );

  return {
    t,
    focusPhase,
    lastTaskStatus,
    ...generationPage,
  };
}
