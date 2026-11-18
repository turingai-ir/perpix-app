import type { SubmitEventHandler } from "react";
import { toast } from "sonner";

import { useAppTranslate } from "@/shared/hooks";

import type { DynamicConfigForm } from "@/features/dynamic-config";
import type { GenerationPromptBoxProps } from "@/features/generation/components/prompt-box/types";
import type { useModel } from "@/features/generation/hooks/use-model";
import { showDynamicFormErrorsToast } from "@/features/generation/components/dynamic-form-errors-toast";
import { handleGenerationApplicationError } from "@/features/generation/services/handle-generation-application-error";
import { useWallet, useWalletChargeDialog } from "@/features/wallet";
import { getGenerationErrorMessageKey } from "@/features/generation/model/generation-error-codes";
import {
  INSUFFICIENT_BALANCE_ERROR_CODE,
  isWalletInDebt,
} from "@/features/generation/model/wallet-balance";

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
  const { t } = useAppTranslate();
  const walletState = useWallet();
  const { openWalletCharge } = useWalletChargeDialog();
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
    if (isWalletInDebt(walletState.data?.balance_usdmicro)) {
      // A subscription unlocks models, but generations are paid from the
      // wallet and the backend rejects new ones while it is in debt.
      event.preventDefault();
      openWalletCharge("insufficientBalance");
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
            onUnmappedApplicationError: async (detail, code) => {
              if (code === INSUFFICIENT_BALANCE_ERROR_CODE) {
                openWalletCharge("insufficientBalance");
                return;
              }
              const messageKey = getGenerationErrorMessageKey(code);
              if (messageKey) {
                toast.error(validationErrorTitle, {
                  description: t(messageKey),
                });
                return;
              }
              // Without field errors the user would see nothing at all.
              toast.error(validationErrorTitle, {
                description:
                  typeof detail === "string" && detail.trim()
                    ? detail
                    : t("common.requestRejected"),
              });
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
