import { useMemo } from "react";

import { useDynamicConfigForm } from "@/features/dynamic-config";
import type { GenerationPromptBoxProps } from "@/features/generation/components/prompt-box/types";
import { useModel } from "@/features/generation/hooks/model";
import { getModelDynamicConfig } from "@/features/generation/model/model-dynamic-config";

const PRESERVED_MODEL_SWITCH_FIELDS = ["prompt", "reference_images"] as const;

type Input = Pick<
  GenerationPromptBoxProps,
  | "configDefaultsResolver"
  | "initialPrompt"
  | "lastMessageConfig"
  | "lastMessageModelUuid"
  | "lastMessageStatus"
  | "supportedOutputs"
>;

export function useGenerationDynamicForm({
  configDefaultsResolver,
  initialPrompt,
  lastMessageConfig,
  lastMessageModelUuid,
  lastMessageStatus,
  supportedOutputs,
}: Input) {
  const model = useModel(supportedOutputs, lastMessageModelUuid);
  const modelDynamicConfig = useMemo(
    () => getModelDynamicConfig(model.modelState.data),
    [model.modelState.data],
  );
  const configDefaults = useMemo(() => {
    const lastMessageDefaults =
      !lastMessageModelUuid || lastMessageModelUuid === model.currentModel
        ? resolveLastMessageDefaults({
            configDefaultsResolver,
            lastMessageConfig,
            lastMessageStatus,
          })
        : undefined;

    return {
      ...(modelDynamicConfig.configDefaults ?? {}),
      ...(lastMessageDefaults ?? {}),
      ...(initialPrompt ? { prompt: initialPrompt } : {}),
    };
  }, [
    configDefaultsResolver,
    initialPrompt,
    lastMessageConfig,
    lastMessageStatus,
    lastMessageModelUuid,
    model.currentModel,
    modelDynamicConfig.configDefaults,
  ]);
  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults,
    configMeta: modelDynamicConfig.configMeta,
    configSchema: modelDynamicConfig.configSchema,
    schemaKey: `${model.modelState.data?.uuid ?? "loading"}:${modelDynamicConfig.configSchema?.$id ?? ""}`,
    preserveFieldsOnSchemaChange: PRESERVED_MODEL_SWITCH_FIELDS,
  });

  return { dynamicForm, model };
}

function resolveLastMessageDefaults({
  configDefaultsResolver,
  lastMessageConfig,
  lastMessageStatus,
}: Pick<
  Input,
  "configDefaultsResolver" | "lastMessageConfig" | "lastMessageStatus"
>): Record<string, unknown> | undefined {
  const configDefaults = configDefaultsResolver
    ? configDefaultsResolver(lastMessageConfig)
    : lastMessageConfig
      ? ({ ...lastMessageConfig } as Record<string, unknown>)
      : undefined;

  if (!configDefaults || lastMessageStatus !== "SUCCESS") {
    return configDefaults;
  }

  const defaultsWithoutPrompt = { ...configDefaults };
  delete defaultsWithoutPrompt.prompt;
  return defaultsWithoutPrompt;
}
