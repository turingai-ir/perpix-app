import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SubmitEventHandler,
} from "react";

import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { getPromptConfigFieldNames } from "@/pages/(app)/generation/_components/dynamic-config";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import { useModel } from "@/pages/(app)/generation/_hooks/model";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";

const MIN_PROMPT_LENGTH = 3;

function getLastMessageConfigDefaults({
  configDefaultsResolver,
  lastMessageConfig,
  lastMessageStatus,
}: Pick<
  UseGenerationPromptBoxInput,
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

  const configDefaultsWithoutPrompt = { ...configDefaults };
  delete configDefaultsWithoutPrompt.prompt;
  return configDefaultsWithoutPrompt;
}

type UseGenerationPromptBoxInput = Pick<
  GenerationPromptBoxProps,
  | "advancedExcludedFieldNames"
  | "configDefaultsResolver"
  | "isLoading"
  | "lastMessageConfig"
  | "lastMessageModelUuid"
  | "lastMessageStatus"
  | "onSubmit"
  | "promptBoxFieldNames"
  | "successfulMessageClearKey"
  | "supportedOutputs"
> & {
  validationErrorTitle: string;
};

export function useGenerationPromptBox({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  lastMessageStatus,
  onSubmit,
  promptBoxFieldNames,
  successfulMessageClearKey,
  supportedOutputs,
  validationErrorTitle,
}: UseGenerationPromptBoxInput) {
  const model = useModel(supportedOutputs, lastMessageModelUuid);
  const lastSuccessfulMessageClearKeyRef = useRef<string | undefined>(
    undefined,
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const { configDefaults: modelConfigDefaults, configMeta: modelConfigMeta } =
    getModelDynamicConfig(model.modelState.data);

  const dynamicFormConfigDefaults = useMemo(() => {
    const lastMessageConfigDefaults = getLastMessageConfigDefaults({
      configDefaultsResolver,
      lastMessageConfig,
      lastMessageStatus,
    });

    return {
      ...(modelConfigDefaults ?? {}),
      ...(lastMessageConfigDefaults ?? {}),
    };
  }, [
    configDefaultsResolver,
    lastMessageConfig,
    lastMessageStatus,
    modelConfigDefaults,
  ]);

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
    !model.isCurrentModelAllowed ||
    (isPromptFieldVisible && isPromptTooShort);

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    const currentPrompt = isPromptFieldVisible
      ? String(dynamicForm.getValues("prompt") ?? "")
      : "";
    const currentPromptTooShort =
      isPromptFieldVisible && currentPrompt.trim().length < MIN_PROMPT_LENGTH;

    if (
      isFormBusy ||
      isUploadingMedia ||
      !model.isCurrentModelAllowed ||
      currentPromptTooShort
    ) {
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
          title: validationErrorTitle,
        }),
    );

    await submitForm(event);
  };

  useEffect(() => {
    if (!successfulMessageClearKey) return;
    if (
      lastSuccessfulMessageClearKeyRef.current === successfulMessageClearKey
    ) {
      return;
    }

    lastSuccessfulMessageClearKeyRef.current = successfulMessageClearKey;
    dynamicForm.setValue("prompt", "", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [dynamicForm, successfulMessageClearKey]);

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
