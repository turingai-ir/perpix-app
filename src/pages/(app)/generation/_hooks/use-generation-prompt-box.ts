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
import {
  GENERATION_ERROR_CODES,
  getCanonicalErrorPaths,
  parseGenerationApplicationError,
} from "@/pages/(app)/generation/_utils/generation-application-error";
import {
  getGenerationConfigMeta,
  getModelDynamicConfig,
} from "@/pages/(app)/generation/_utils/model-dynamic-config";

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
  validationFieldErrorMessage: string;
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
  validationFieldErrorMessage,
}: UseGenerationPromptBoxInput) {
  const model = useModel(supportedOutputs, lastMessageModelUuid);
  const lastSuccessfulMessageClearKeyRef = useRef<string | undefined>(
    undefined,
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isProviderUnavailable, setIsProviderUnavailable] = useState(false);
  const { configDefaults: modelConfigDefaults, configMeta: modelConfigMeta } =
    getModelDynamicConfig(model.modelState.data);
  const generationConfig = model.generationConfigState.data;
  const generationConfigMeta = getGenerationConfigMeta(
    generationConfig?.ui_schema,
  );

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
    configMeta: generationConfigMeta ?? modelConfigMeta,
    configSchema: isJsonConfigSchema(generationConfig?.config_schema)
      ? generationConfig.config_schema
      : null,
    schemaKey: `${model.currentModel}:${generationConfig?.resolved_provider.uuid ?? ""}`,
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
    model.modelState.isLoading ||
    model.generationConfigState.isLoading;
  const isFormReadOnly = isFormBusy || isProviderUnavailable;
  const isSubmitDisabled =
    isFormReadOnly ||
    isUploadingMedia ||
    !model.isCurrentModelAllowed ||
    (isPromptFieldVisible && isPromptTooShort);
  const handleGenerationError = async (error: unknown) => {
    const applicationError = await parseGenerationApplicationError(error);
    if (!applicationError) throw error;
    if (
      applicationError.statusCode ===
      GENERATION_ERROR_CODES.providerNotAvailableForModel
    ) {
      await model.generationConfigState.refetch();
      return;
    }
    if (
      applicationError.statusCode === GENERATION_ERROR_CODES.noActiveProvider
    ) {
      setIsProviderUnavailable(true);
      return;
    }
    if (
      applicationError.statusCode !== GENERATION_ERROR_CODES.invalidModelConfig
    ) {
      throw error;
    }
    getCanonicalErrorPaths(applicationError.detail)
      .filter((fieldPath) => fieldPath in dynamicForm.properties)
      .forEach((fieldPath) => {
        dynamicForm.form.setError(fieldPath, {
          type: "server",
          message: validationFieldErrorMessage,
        });
      });
  };

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
        try {
          await onSubmit(data, model.currentModel ?? "");
        } catch (error) {
          await handleGenerationError(error);
        }
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
    isFormBusy: isFormReadOnly,
    isPromptFieldVisible,
    isSubmitDisabled,
    isUploadingMedia,
    model,
    promptBoxConfigFieldNames,
    setIsUploadingMedia,
  };
}
