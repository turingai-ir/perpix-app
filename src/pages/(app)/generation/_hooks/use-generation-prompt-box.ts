import { useEffect, useRef, useState } from "react";

import { getPromptConfigFieldNames } from "@/pages/(app)/generation/_components/dynamic-config";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import { useGenerationDynamicForm } from "@/pages/(app)/generation/_hooks/use-generation-dynamic-form";
import { useGenerationFormSubmit } from "@/pages/(app)/generation/_hooks/use-generation-form-submit";

type Input = Pick<
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

export function useGenerationPromptBox(input: Input) {
  const lastSuccessfulMessageClearKeyRef = useRef<string | undefined>(
    undefined,
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const { dynamicForm, model } = useGenerationDynamicForm(input);
  const submitState = useGenerationFormSubmit({
    dynamicForm,
    isLoading: input.isLoading,
    isUploadingMedia,
    model,
    onSubmit: input.onSubmit,
    validationErrorTitle: input.validationErrorTitle,
    validationFieldErrorMessage: input.validationFieldErrorMessage,
  });
  const promptBoxConfigFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    includedFields: input.promptBoxFieldNames,
  });
  const advancedFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    excludedFields: input.advancedExcludedFieldNames,
  });

  useEffect(() => {
    if (!input.successfulMessageClearKey) return;
    if (
      lastSuccessfulMessageClearKeyRef.current ===
      input.successfulMessageClearKey
    ) {
      return;
    }

    lastSuccessfulMessageClearKeyRef.current = input.successfulMessageClearKey;
    dynamicForm.setValue("prompt", "", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [dynamicForm, input.successfulMessageClearKey]);

  return {
    advancedFieldNames,
    dynamicForm,
    ...submitState,
    isUploadingMedia,
    model,
    promptBoxConfigFieldNames,
    setIsUploadingMedia,
  };
}
