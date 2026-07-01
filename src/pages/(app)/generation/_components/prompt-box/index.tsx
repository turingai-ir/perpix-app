import type { FC } from "react";

import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
} from "../dynamic-config";
import { PromptModelSelector } from "./model-selector";
import { PromptTextarea } from "./prompt-textarea";
import { PromptSubmitButton } from "./submit-button";
import type { GenerationPromptBoxProps } from "./types";
import { useGenerationPromptBox } from "./use-generation-prompt-box";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAppTranslate } from "@/hook";

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
    extraContent,
    isLoading,
    lastMessageConfig,
    lastMessageModelUuid,
    onSubmit,
    promptBoxFieldNames: includedPromptBoxFieldNames,
    promptClearKey,
    promptPlaceholderKey,
    supportedOutputs,
    t,
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
          {promptBox.isPromptFieldVisible && (
            <PromptTextarea
              dynamicForm={promptBox.dynamicForm}
              disabled={promptBox.isFormBusy}
              placeholder={t(promptPlaceholderKey)}
            />
          )}
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <div>
              <PromptSubmitButton
                disabled={promptBox.isSubmitDisabled}
                isLoading={isLoading}
              />
            </div>
            <div className="flex w-full flex-wrap gap-4">
              <PromptModelSelector
                chooseModelLabel={t("common.chooseModel")}
                disabled={promptBox.isFormBusy}
                model={promptBox.model}
                upgradeLabel={t("common.upgradeRequired")}
              />
              {promptBox.promptBoxConfigFieldNames.map((fieldName) => (
                <DynamicPromptConfigField
                  key={fieldName}
                  dynamicForm={promptBox.dynamicForm}
                  fieldName={fieldName}
                  disabled={promptBox.isFormBusy}
                />
              ))}
              <AdvancedPromptSettingsDialog
                dynamicForm={promptBox.dynamicForm}
                fieldNames={promptBox.advancedFieldNames}
                disabled={promptBox.isFormBusy}
              />
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
