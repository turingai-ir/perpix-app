import { startTransition, useState } from "react";
import { useLocation } from "react-router";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/shared/api";
import { appEventBus } from "@/shared/lib/event-bus";
import { GeneratedMediaField, useGenerationPage } from "../../hooks";
import { getGenerationDraftPrompt } from "../../hooks/generation-draft";
import type { GenerationComposerIntent } from "../../model/conversation";
import type { GenerationFocusPhase } from "../../components/generation-focus-state";
import type { ImageComparisonItem } from "../components/image-comparison.types";

function getFocusPhase(
  optimisticStatus: string | undefined,
  taskStatus: string | null | undefined,
): GenerationFocusPhase {
  if (optimisticStatus === "submitting") return "submitting";
  if (taskStatus === "IN_PROGRESS") return "processing";
  return "queued";
}

export function useImageStudio() {
  const location = useLocation();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const initialPrompt = getGenerationDraftPrompt(location.state);
  const [composerIntent, setComposerIntent] =
    useState<GenerationComposerIntent>();
  const [comparisonItems, setComparisonItems] = useState<ImageComparisonItem[]>(
    [],
  );

  const generationPage = useGenerationPage({
    generatedMediaField: GeneratedMediaField.IMAGE,
    historyPath: APP_ROUTES_KEY.generation.image.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.IMAGE,
  });

  const lastTaskStatus =
    generationPage.lastAssistantMessage?.task_status ??
    generationPage.lastTaskMessage?.task_status;
  const focusPhase = getFocusPhase(
    generationPage.optimisticTurn?.status,
    lastTaskStatus,
  );

  const handleToggleComparison = (item: ImageComparisonItem) => {
    startTransition(() => {
      setComparisonItems((current) => {
        if (current.some(({ fileId }) => fileId === item.fileId)) {
          return current.filter(({ fileId }) => fileId !== item.fileId);
        }
        if (current.length >= 4) return current;
        return [...current, item];
      });
    });
  };

  const handleRemoveComparison = (fileId: string) => {
    setComparisonItems((current) =>
      current.filter((item) => item.fileId !== fileId),
    );
  };

  const handleClearComparison = () => {
    setComparisonItems([]);
  };

  const handleUseAsReference = (fileId: string) => {
    startTransition(() => {
      setComposerIntent({
        id: crypto.randomUUID(),
        config: { reference_images: [fileId] },
        mergeReferences: true,
        requiredFields: ["reference_images"],
      });
    });
    appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", { force: true });
  };

  const handleEditRequest = (message: SchemaAiTaskMessageResponse) => {
    const { config, modelUuid } = generationPage.resolveMessageRequest(message);
    if (!modelUuid) return;
    startTransition(() => {
      setComposerIntent({
        id: crypto.randomUUID(),
        config,
        modelUuid,
        replace: true,
      });
    });
    appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", { force: true });
  };

  return {
    t,
    initialPrompt,
    composerIntent,
    setComposerIntent,
    comparisonItems,
    handleToggleComparison,
    handleRemoveComparison,
    handleClearComparison,
    handleUseAsReference,
    handleEditRequest,
    focusPhase,
    lastTaskStatus,
    ...generationPage,
  };
}
