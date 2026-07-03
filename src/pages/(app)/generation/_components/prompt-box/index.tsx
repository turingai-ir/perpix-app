import type { FC } from "react";

import {
  PromptActionsSection,
  PromptFullWidthFieldsSection,
  PromptModeSection,
} from "./config-sections";
import { PromptTextarea } from "./prompt-textarea";
import type { GenerationPromptBoxProps } from "./types";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAppTranslate } from "@/hook";
import {
  useGenerationPromptBox,
  usePromptBoxFieldGroups,
} from "@/pages/(app)/generation/_hooks";

export const GenerationPromptBox: FC<GenerationPromptBoxProps> = ({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  extraContent,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  onSubmit,
  promptClearKey,
  promptBoxFieldNames: includedPromptBoxFieldNames,
  promptPlaceholderKey,
  supportedOutputs,
}) => {
  const { t } = useAppTranslate();
  const promptBox = useGenerationPromptBox({
    advancedExcludedFieldNames,
    configDefaultsResolver,
    isLoading,
    lastMessageConfig,
    lastMessageModelUuid,
    onSubmit,
    promptBoxFieldNames: includedPromptBoxFieldNames,
    promptClearKey,
    supportedOutputs,
    validationErrorTitle: t("common.error"),
  });

  const fieldGroups = usePromptBoxFieldGroups({
    dynamicForm: promptBox.dynamicForm,
    fieldNames: promptBox.promptBoxConfigFieldNames,
  });

  return (
    <Card className="w-full min-w-0 overflow-hidden px-2">
      {extraContent?.({
        dynamicForm: promptBox.dynamicForm,
        isFormBusy: promptBox.isFormBusy,
        isUploadingMedia: promptBox.isUploadingMedia,
        setIsUploadingMedia: promptBox.setIsUploadingMedia,
      })}
      <Form {...promptBox.dynamicForm.form}>
        <form
          className="flex w-full min-w-0 flex-col gap-4"
          onSubmit={promptBox.handleFormSubmit}
        >
          {fieldGroups.hasModeField && (
            <PromptModeSection
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
            />
          )}
          {promptBox.isPromptFieldVisible && (
            <PromptTextarea
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
              placeholder={t(promptPlaceholderKey)}
            />
          )}
          <PromptActionsSection
            advancedFieldNames={promptBox.advancedFieldNames}
            chooseModelLabel={t("common.chooseModel")}
            disabled={promptBox.isFormBusy}
            dynamicForm={promptBox.dynamicForm}
            inlineFieldNames={fieldGroups.inlineFieldNames}
            isLoading={isLoading}
            isSubmitDisabled={promptBox.isSubmitDisabled}
            model={promptBox.model}
            upgradeLabel={t("common.upgradeRequired")}
          />
          <PromptFullWidthFieldsSection
            dynamicForm={promptBox.dynamicForm}
            fieldNames={fieldGroups.fullWidthFieldNames}
            disabled={promptBox.isFormBusy}
          />
        </form>
      </Form>
    </Card>
  );
};
