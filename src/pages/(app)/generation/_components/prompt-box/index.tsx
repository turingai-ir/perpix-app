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
  composerIntent,
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
  onComposerIntentApplied,
  successfulMessageClearKey,
  promptBoxFieldNames: includedPromptBoxFieldNames,
  promptPlaceholderKey,
  supportedOutputs,
}) => {
  const { t } = useAppTranslate();
  const promptBox = useGenerationPromptBox({
    advancedExcludedFieldNames,
    configDefaultsResolver,
    composerIntent,
    initialPrompt,
    isLoading,
    lastMessageConfig,
    lastMessageModelUuid,
    lastMessageStatus,
    onSubmit,
    onComposerIntentApplied,
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
  const fullWidthFields = (
    <PromptFullWidthFieldsSection
      dynamicForm={promptBox.dynamicForm}
      fieldNames={fieldGroups.fullWidthFieldNames}
      disabled={promptBox.isFormBusy}
    />
  );

  return (
    <Card
      data-generation-composer-card
      className={
        primaryActionLabel
          ? "w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-[#0b0b10]/88 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] ring-1 ring-white/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0b0b10]/72 sm:p-5"
          : "w-full min-w-0 overflow-hidden px-2"
      }
    >
      <Form {...promptBox.dynamicForm.form}>
        <form
          aria-busy={promptBox.isFormBusy}
          className="flex w-full min-w-0 flex-col gap-4"
          onSubmit={promptBox.handleFormSubmit}
        >
          {primaryActionLabel && promptBox.composerIntentBlocked && (
            <div
              className="border-primary/25 bg-primary/7 text-foreground rounded-xl border px-3 py-2 text-sm leading-6"
              role="status"
            >
              {t("pages.generation.image.chat.referenceNeedsModel")}
            </div>
          )}
          {fieldGroups.hasModeField && !primaryActionLabel && (
            <PromptModeSection
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
            />
          )}
          {!primaryActionLabel &&
            extraContent?.({
              dynamicForm: promptBox.dynamicForm,
              isFormBusy: promptBox.isFormBusy,
              isUploadingMedia: promptBox.isUploadingMedia,
              setIsUploadingMedia: promptBox.setIsUploadingMedia,
            })}
          {promptBox.isPromptFieldVisible && primaryActionLabel && (
            <div
              data-generation-prompt-surface
              className="border-border/70 bg-muted/15 focus-within:border-primary/45 focus-within:bg-muted/25 focus-within:ring-primary/10 flex min-w-0 flex-wrap items-start gap-3 rounded-2xl border px-3 py-2 transition-colors focus-within:ring-2"
            >
              {extraContent?.({
                dynamicForm: promptBox.dynamicForm,
                isFormBusy: promptBox.isFormBusy,
                isUploadingMedia: promptBox.isUploadingMedia,
                setIsUploadingMedia: promptBox.setIsUploadingMedia,
              })}
              <PromptTextarea
                dynamicForm={promptBox.dynamicForm}
                disabled={promptBox.isFormBusy}
                placeholder={t(promptPlaceholderKey)}
                label={t("pages.generation.image.studio.composerLabel")}
                compact
              />
            </div>
          )}
          {promptBox.isPromptFieldVisible && !primaryActionLabel && (
            <PromptTextarea
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
              placeholder={t(promptPlaceholderKey)}
            />
          )}
          {primaryActionLabel && fullWidthFields}
          <PromptActionsSection
            advancedSettingsLabel={advancedSettingsLabel}
            advancedFieldNames={promptBox.advancedFieldNames}
            chooseModelLabel={t("common.chooseModel")}
            disabled={promptBox.isFormBusy}
            dynamicForm={promptBox.dynamicForm}
            inlineFieldNames={fieldGroups.inlineFieldNames}
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
          {!primaryActionLabel && fullWidthFields}
        </form>
      </Form>
    </Card>
  );
};
