import type { FC } from "react";

import {
  PromptActionsSection,
  PromptFullWidthFieldsSection,
  PromptModeSection,
} from "./config-sections";
import { PromptTextarea } from "./prompt-textarea";
import type { GenerationPromptBoxProps } from "./types";

import { Card } from "@/shared/ui/card";
import { Form } from "@/shared/ui/form";
import { useAppTranslate } from "@/shared/hooks";
import {
  useGenerationPromptBox,
  usePromptBoxFieldGroups,
} from "@/features/generation/hooks";

export const GenerationPromptBox: FC<GenerationPromptBoxProps> = ({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  composerIntent,
  extraContent,
  failedRequest,
  modelSelectionContent,
  primaryActionLabel,
  advancedSettingsLabel,
  composerLabel,
  modelLabel,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  lastMessageStatus,
  onSubmit,
  onComposerIntentApplied,
  successfulMessageClearKey,
  promptBoxFieldNames: includedPromptBoxFieldNames,
  promptPlaceholderKey,
  showModeSection = false,
  supportedOutputs,
}) => {
  const { t } = useAppTranslate();
  const promptBox = useGenerationPromptBox({
    advancedExcludedFieldNames,
    configDefaultsResolver,
    composerIntent,
    failedRequest,
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
          ? "border-night-foreground/10 bg-night/88 shadow-modal ring-night-foreground/5 supports-[backdrop-filter]:bg-night/72 w-full min-w-0 rounded-3xl border p-4 ring-1 backdrop-blur-2xl sm:p-5"
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
          {fieldGroups.hasModeField &&
            (showModeSection || !primaryActionLabel) && (
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
                label={
                  composerLabel ??
                  t("pages.generation.image.studio.composerLabel")
                }
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
            modelLabel={modelLabel}
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
