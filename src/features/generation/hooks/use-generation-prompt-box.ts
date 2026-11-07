import { useEffect, useRef, useState } from "react";

import { getPromptConfigFieldNames } from "@/features/dynamic-config";
import type { GenerationPromptBoxProps } from "@/features/generation/components/prompt-box/types";
import { useGenerationDynamicForm } from "@/features/generation/hooks/use-generation-dynamic-form";
import { useGenerationFormSubmit } from "@/features/generation/hooks/use-generation-form-submit";
import { useGenerationComposerIntent } from "./use-generation-composer-intent";

type Input = Pick<
  GenerationPromptBoxProps,
  | "advancedExcludedFieldNames"
  | "composerIntent"
  | "configDefaultsResolver"
  | "initialPrompt"
  | "isLoading"
  | "lastMessageConfig"
  | "lastMessageModelUuid"
  | "lastMessageStatus"
  | "onSubmit"
  | "onComposerIntentApplied"
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
  const lastSubmissionRef = useRef<{ prompt: string } | undefined>(undefined);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const { dynamicForm, model } = useGenerationDynamicForm(input);
  const submitState = useGenerationFormSubmit({
    dynamicForm,
    isLoading: input.isLoading,
    isUploadingMedia,
    model,
    onSubmit: async (data, modelUuid) => {
      const previous = lastSubmissionRef.current;
      const submission = { prompt: String(data.prompt ?? "") };
      lastSubmissionRef.current = submission;
      let submitted = false;
      try {
        const result = await input.onSubmit(data, modelUuid);
        submitted = result !== false;
        return result;
      } finally {
        if (!submitted && lastSubmissionRef.current === submission) {
          lastSubmissionRef.current = previous;
        }
      }
    },
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
  const composerIntent = useGenerationComposerIntent({
    dynamicForm,
    intent: input.composerIntent,
    model,
    onApplied: input.onComposerIntentApplied,
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
    const hasUnsubmittedPrompt =
      dynamicForm.form.getFieldState("prompt").isDirty &&
      dynamicForm.getValues("prompt") !== lastSubmissionRef.current?.prompt;
    if (hasUnsubmittedPrompt) return;

    dynamicForm.setValue("prompt", "", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [dynamicForm, input.successfulMessageClearKey]);

  return {
    advancedFieldNames,
    composerIntentBlocked: composerIntent.isBlocked,
    dynamicForm,
    ...submitState,
    isUploadingMedia,
    model,
    promptBoxConfigFieldNames,
    setIsUploadingMedia,
  };
}
