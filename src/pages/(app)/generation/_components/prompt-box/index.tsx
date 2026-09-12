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
import { useAppTranslate } from "@/hooks";
import {
  useGenerationPromptBox,
  usePromptBoxFieldGroups,
} from "@/pages/(app)/generation/_hooks";

export const GenerationPromptBox: FC<GenerationPromptBoxProps> = ({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  extraContent,
  modelSelectionContent,
  primaryActionLabel,
  advancedSettingsLabel,
  initialPrompt,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  lastMessageStatus,
  onSubmit,
  successfulMessageClearKey,
  promptBoxFieldNames: includedPromptBoxFieldNames,
  promptPlaceholderKey,
  supportedOutputs,
}) => {
  const { t } = useAppTranslate();
  const promptBox = useGenerationPromptBox({
    advancedExcludedFieldNames,
    configDefaultsResolver,
    initialPrompt,
    isLoading,
    lastMessageConfig,
    lastMessageModelUuid,
    lastMessageStatus,
    onSubmit,
    promptBoxFieldNames: includedPromptBoxFieldNames,
    successfulMessageClearKey,
    supportedOutputs,
    validationErrorTitle: t("common.error"),
    validationFieldErrorMessage: t("common.invalidField"),
  });

  const fieldGroups = usePromptBoxFieldGroups({
    dynamicForm: promptBox.dynamicForm,
    fieldNames: promptBox.promptBoxConfigFieldNames,
  });

  return (
    <Card
      className={
        primaryActionLabel
          ? "border-border/70 bg-card/95 w-full min-w-0 rounded-3xl p-4 shadow-xl shadow-black/5 sm:p-6"
          : "w-full min-w-0 overflow-hidden px-2"
      }
    >
      <Form {...promptBox.dynamicForm.form}>
        <form
          className="flex w-full min-w-0 flex-col gap-4"
          onSubmit={promptBox.handleFormSubmit}
        >
          {fieldGroups.hasModeField && !primaryActionLabel && (
            <PromptModeSection
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
            />
          )}
          {extraContent?.({
            dynamicForm: promptBox.dynamicForm,
            isFormBusy: promptBox.isFormBusy,
            isUploadingMedia: promptBox.isUploadingMedia,
            setIsUploadingMedia: promptBox.setIsUploadingMedia,
          })}
          {promptBox.isPromptFieldVisible && (
            <PromptTextarea
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
              placeholder={t(promptPlaceholderKey)}
            />
          )}
          <PromptActionsSection
            advancedSettingsLabel={advancedSettingsLabel}
            advancedFieldNames={promptBox.advancedFieldNames}
            chooseModelLabel={t("common.chooseModel")}
            disabled={promptBox.isFormBusy}
            dynamicForm={promptBox.dynamicForm}
            inlineFieldNames={
              primaryActionLabel && fieldGroups.hasModeField
                ? ["mode", ...fieldGroups.inlineFieldNames]
                : fieldGroups.inlineFieldNames
            }
            isLoading={isLoading}
            isSubmitDisabled={promptBox.isSubmitDisabled}
            model={promptBox.model}
            hideModelSelector={Boolean(modelSelectionContent)}
            modelSelectionContent={modelSelectionContent?.({
              disabled: promptBox.isFormBusy,
              dynamicForm: promptBox.dynamicForm,
              model: promptBox.model,
            })}
            primaryActionLabel={primaryActionLabel}
            promptRequired={promptBox.isPromptFieldVisible}
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
