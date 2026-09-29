import type { SubmitEventHandler } from "react";

import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { handleGenerationApplicationError } from "@/pages/(app)/generation/_utils/handle-generation-application-error";

const MIN_PROMPT_LENGTH = 3;

export function isGenerationPromptInvalid({
  dynamicForm,
  isPromptFieldVisible,
  multiPrompt,
  prompt,
}: {
  dynamicForm: DynamicConfigForm;
  isPromptFieldVisible: boolean;
  multiPrompt: unknown;
  prompt: unknown;
}) {
  if (!isPromptFieldVisible) return false;

  const promptMeta = dynamicForm.getFieldMeta("prompt");
  const supportsMultiPrompt =
    Boolean(dynamicForm.getFieldMeta("multi_prompt")) &&
    dynamicForm.getValues("mode") === "text_to_video";
  const promptMinLength = supportsMultiPrompt
    ? Math.max(promptMeta?.property.minLength ?? 0, MIN_PROMPT_LENGTH)
    : (promptMeta?.property.minLength ?? MIN_PROMPT_LENGTH);
  const hasValidMultiPrompt =
    supportsMultiPrompt &&
    Array.isArray(multiPrompt) &&
    multiPrompt.some(
      (shot) =>
        typeof shot === "object" &&
        shot !== null &&
        "prompt" in shot &&
        String(shot.prompt).trim().length >= promptMinLength,
    );
  const needsPrompt = Boolean(promptMeta?.required) || supportsMultiPrompt;

  return (
    needsPrompt &&
    String(prompt ?? "").trim().length < promptMinLength &&
    !hasValidMultiPrompt
  );
}

type Input = Pick<GenerationPromptBoxProps, "isLoading" | "onSubmit"> & {
  dynamicForm: DynamicConfigForm;
  isUploadingMedia: boolean;
  model: ReturnType<typeof useModel>;
  validationErrorTitle: string;
  validationFieldErrorMessage: string;
};

export function useGenerationFormSubmit({
  dynamicForm,
  isLoading,
  isUploadingMedia,
  model,
  onSubmit,
  validationErrorTitle,
  validationFieldErrorMessage,
}: Input) {
  const isPromptFieldVisible =
    Boolean(dynamicForm.properties.prompt) &&
    dynamicForm.isFieldVisible("prompt");
  const isFormBusy =
    Boolean(isLoading) ||
    !dynamicForm.isReady ||
    model.activeSubscriptionState.isLoading ||
    model.modelsListState.isLoading ||
    model.modelState.isLoading ||
    model.modelState.isPlaceholderData ||
    model.modelState.data?.uuid !== model.currentModel;
  const isSubmitDisabled =
    isFormBusy ||
    isUploadingMedia ||
    !model.isCurrentModelAllowed ||
    model.modelState.isError ||
    model.modelsListState.isError ||
    model.activeSubscriptionState.isError;

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    const isPromptInvalid = isGenerationPromptInvalid({
      dynamicForm,
      isPromptFieldVisible,
      multiPrompt: dynamicForm.getValues("multi_prompt"),
      prompt: dynamicForm.getValues("prompt"),
    });

    if (isSubmitDisabled || isPromptInvalid) {
      event.preventDefault();
      return;
    }

    await dynamicForm.handleSubmit(
      async (data) => {
        try {
          await onSubmit(data, model.currentModel ?? "");
        } catch (error) {
          const wasHandled = await handleGenerationApplicationError({
            dynamicForm,
            error,
            onUnmappedApplicationError: async () => {
              await model.modelState.refetch();
            },
            validationFieldErrorMessage,
          });
          if (!wasHandled) throw error;
        }
      },
      (errors) =>
        showDynamicFormErrorsToast({
          errors,
          properties: dynamicForm.properties,
          title: validationErrorTitle,
        }),
    )(event);
  };

  return {
    handleFormSubmit,
    isFormBusy,
    isPromptFieldVisible,
    isSubmitDisabled,
  };
}
