import type { SubmitEventHandler } from "react";

import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { handleGenerationApplicationError } from "@/pages/(app)/generation/_utils/handle-generation-application-error";

const MIN_PROMPT_LENGTH = 3;

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
  const prompt = String(dynamicForm.watch("prompt") ?? "");
  const isFormBusy =
    Boolean(isLoading) ||
    !dynamicForm.isReady ||
    model.activeSubscriptionState.isLoading ||
    model.modelsListState.isLoading ||
    model.modelState.isLoading;
  const isSubmitDisabled =
    isFormBusy ||
    isUploadingMedia ||
    !model.isCurrentModelAllowed ||
    (isPromptFieldVisible && prompt.trim().length < MIN_PROMPT_LENGTH);

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    if (isSubmitDisabled) {
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
