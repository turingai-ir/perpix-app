import { useEffect, useMemo, useRef } from "react";

import { useDynamicConfigForm } from "@/features/dynamic-config";
import type { GenerationPromptBoxProps } from "@/features/generation/components/prompt-box/types";
import { useModel } from "@/features/generation/hooks/model";
import { getModelDynamicConfig } from "@/features/generation/model/model-dynamic-config";
import { withInferredMode } from "@/features/generation/model/retry-config";

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
  const lastMessageDefaults = useMemo(() => {
    if (lastMessageModelUuid && lastMessageModelUuid !== model.currentModel) {
      return undefined;
    }
    const defaults = resolveLastMessageDefaults({
      configDefaultsResolver,
      lastMessageConfig,
      lastMessageStatus,
    });
    return defaults
      ? withInferredMode(defaults, modelDynamicConfig.configSchema)
      : undefined;
  }, [
    configDefaultsResolver,
    lastMessageConfig,
    lastMessageModelUuid,
    lastMessageStatus,
    model.currentModel,
    modelDynamicConfig.configSchema,
  ]);
  const configDefaults = useMemo(() => {
    return {
      ...(modelDynamicConfig.configDefaults ?? {}),
      ...(lastMessageDefaults ?? {}),
      ...(initialPrompt ? { prompt: initialPrompt } : {}),
    };
  }, [initialPrompt, lastMessageDefaults, modelDynamicConfig.configDefaults]);
  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults,
    configMeta: modelDynamicConfig.configMeta,
    configSchema: modelDynamicConfig.configSchema,
    schemaKey: `${model.modelState.data?.uuid ?? "loading"}:${modelDynamicConfig.configSchema?.$id ?? ""}`,
    preserveFieldsOnSchemaChange: PRESERVED_MODEL_SWITCH_FIELDS,
  });

  // The chat's history usually loads after the form initialised from a cached
  // schema; apply the last request's settings once, unless the user already
  // edited the composer.
  const appliedLastDefaultsRef = useRef(false);
  useEffect(() => {
    if (appliedLastDefaultsRef.current || !lastMessageDefaults) return;
    if (!dynamicForm.isReady) return;
    if (model.modelState.data?.uuid !== model.currentModel) return;
    appliedLastDefaultsRef.current = true;
    if (dynamicForm.form.formState.isDirty) return;
    const restored = Object.fromEntries(
      Object.entries(lastMessageDefaults).filter(
        ([field]) => dynamicForm.properties[field],
      ),
    );
    dynamicForm.form.reset({ ...dynamicForm.getValues(), ...restored });
  }, [dynamicForm, lastMessageDefaults, model]);

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
