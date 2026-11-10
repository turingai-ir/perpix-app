import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { keepPreviousData } from "@tanstack/react-query";

import {
  selectedImageModelAtom,
  selectedVideoModelAtom,
} from "./selected-model-atom";

import { useReactQueryApi } from "@/shared/hooks/app";
import { useActiveSubscription } from "@/features/pricing";
import {
  getDefaultAccessibleModel,
  isModelAllowed,
} from "@/features/generation/model/model-access";
import type {
  AiRegistryModelSupportedTypesEnumValue,
  SchemaAiRegistryModelSummary,
} from "@/shared/api";

export const useModel = (
  supportedOutputs: Array<AiRegistryModelSupportedTypesEnumValue>,
  initialModelUuid?: string | null,
) => {
  const { useQuery } = useReactQueryApi();
  const activeSubscriptionState = useActiveSubscription();

  const targetAtom = supportedOutputs.includes("VIDEO")
    ? selectedVideoModelAtom
    : selectedImageModelAtom;
  const [selectedModel, setSelectedModel] = useAtom(targetAtom);
  const [explicitModel, setExplicitModel] = useState<string>();
  const previousInitialModelRef = useRef(initialModelUuid);
  useEffect(() => {
    if (previousInitialModelRef.current === initialModelUuid) return;
    previousInitialModelRef.current = initialModelUuid;
    setExplicitModel(undefined);
  }, [initialModelUuid]);
  const currentSelectedModel =
    explicitModel ?? initialModelUuid ?? selectedModel ?? undefined;
  const allowedModelNames = activeSubscriptionState.data?.plan
    .allowed_models as readonly string[] | undefined;

  const modelsListState = useQuery("get", "/api/v1/ai-registry/models", {
    params: {
      query: {
        supported_outputs: supportedOutputs,
      },
    },
  });

  const models = modelsListState.data as
    Array<SchemaAiRegistryModelSummary> | undefined;
  const selectedModelSummary = models?.find(
    (model) => model.uuid === currentSelectedModel,
  );
  const currentModelSummary =
    selectedModelSummary ??
    getDefaultAccessibleModel(models, allowedModelNames);
  const currentModel = currentModelSummary?.uuid;
  const isCurrentModelAllowed = currentModelSummary
    ? isModelAllowed(currentModelSummary, allowedModelNames)
    : true;

  const modelState = useQuery(
    "get",
    "/api/v1/ai-registry/models/{ai_model_uuid}",
    {
      params: {
        path: {
          ai_model_uuid: currentModel ?? "",
        },
      },
    },
    { enabled: !!currentModel, placeholderData: keepPreviousData },
  );
  const setCurrentModel = (modelUuid: string) => {
    setExplicitModel(modelUuid);
    setSelectedModel(modelUuid);
  };
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
