import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SubmitEventHandler,
} from "react";

import { useModel } from "../../_hooks/model";
import { getPromptConfigFieldNames } from "../dynamic-config";

import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";

import type { GenerationPromptBoxProps } from "./types";

const MIN_PROMPT_LENGTH = 3;

export function useGenerationPromptBox({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  onSubmit,
  promptBoxFieldNames,
  promptClearKey,
  supportedOutputs,
  t,
}: GenerationPromptBoxProps & {
  t: (key: string) => string;
}) {
  const model = useModel(supportedOutputs, lastMessageModelUuid);
  const lastPromptClearKeyRef = useRef<string | undefined>(undefined);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const { configDefaults: modelConfigDefaults, configMeta: modelConfigMeta } =
    getModelDynamicConfig(model.modelState.data);

  const dynamicFormConfigDefaults = useMemo(() => {
    const lastMessageConfigDefaults = configDefaultsResolver
      ? configDefaultsResolver(lastMessageConfig)
      : lastMessageConfig
        ? ({ ...lastMessageConfig } as Record<string, unknown>)
        : undefined;

    return {
      ...(modelConfigDefaults ?? {}),
      ...(lastMessageConfigDefaults ?? {}),
    };
  }, [configDefaultsResolver, lastMessageConfig, modelConfigDefaults]);

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: dynamicFormConfigDefaults,
    configMeta: modelConfigMeta,
    configSchema: isJsonConfigSchema(model.modelState.data?.config_schema)
      ? model.modelState.data.config_schema
      : null,
    schemaKey: model.modelState.data?.uuid,
  });
  const watchedPrompt = dynamicForm.watch("prompt");
  const promptBoxConfigFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    includedFields: promptBoxFieldNames,
  });
  const advancedFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    excludedFields: advancedExcludedFieldNames,
  });
  const isPromptFieldVisible =
    Boolean(dynamicForm.properties.prompt) &&
    dynamicForm.isFieldVisible("prompt");
  const isPromptTooShort =
    String(watchedPrompt ?? "").trim().length < MIN_PROMPT_LENGTH;

  const isFormBusy =
    isLoading ||
    !dynamicForm.isReady ||
    model.activeSubscriptionState.isLoading ||
    model.modelsListState.isLoading ||
    model.modelState.isLoading;
  const isSubmitDisabled =
    isFormBusy ||
    isUploadingMedia ||
    (isPromptFieldVisible && isPromptTooShort);

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    const currentPrompt = isPromptFieldVisible
      ? String(dynamicForm.getValues("prompt") ?? "")
      : "";
    const currentPromptTooShort =
      isPromptFieldVisible && currentPrompt.trim().length < MIN_PROMPT_LENGTH;

    if (isFormBusy || isUploadingMedia || currentPromptTooShort) {
      event.preventDefault();
      return;
    }

    const submitForm = dynamicForm.handleSubmit(
      async (data) => {
        await onSubmit(data, model.currentModel ?? "");
      },
      (errors) =>
        showDynamicFormErrorsToast({
          errors,
          properties: dynamicForm.properties,
          title: t("common.error"),
        }),
    );

    await submitForm(event);
  };

  useEffect(() => {
    if (!promptClearKey) return;
    if (lastPromptClearKeyRef.current === promptClearKey) return;

    lastPromptClearKeyRef.current = promptClearKey;
    dynamicForm.setValue("prompt", "", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [dynamicForm, promptClearKey]);

  return {
    advancedFieldNames,
    dynamicForm,
    handleFormSubmit,
    isFormBusy,
    isPromptFieldVisible,
    isSubmitDisabled,
    isUploadingMedia,
    model,
    promptBoxConfigFieldNames,
    setIsUploadingMedia,
  };
}
