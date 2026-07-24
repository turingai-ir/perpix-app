import { useMemo } from "react";

import { useDynamicConfigForm } from "@/hooks/use-dynamic-config-form";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import { useModel } from "@/pages/(app)/generation/_hooks/model";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";

type Input = Pick<
  GenerationPromptBoxProps,
  | "configDefaultsResolver"
  | "lastMessageConfig"
  | "lastMessageModelUuid"
  | "lastMessageStatus"
  | "supportedOutputs"
>;

export function useGenerationDynamicForm({
  configDefaultsResolver,
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
    const lastMessageDefaults = resolveLastMessageDefaults({
      configDefaultsResolver,
      lastMessageConfig,
      lastMessageStatus,
    });

    return {
      ...(modelDynamicConfig.configDefaults ?? {}),
      ...(lastMessageDefaults ?? {}),
    };
  }, [
    configDefaultsResolver,
    lastMessageConfig,
    lastMessageStatus,
    modelDynamicConfig.configDefaults,
  ]);
  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults,
    configMeta: modelDynamicConfig.configMeta,
    configSchema: modelDynamicConfig.configSchema,
    schemaKey: `${model.currentModel}:${modelDynamicConfig.configSchema?.$id ?? ""}`,
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
