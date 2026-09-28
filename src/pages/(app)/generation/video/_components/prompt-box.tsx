import type { FC } from "react";

import { VideoModelPicker } from "./model-picker";
import { VideoReferenceBoard } from "./reference-board";
import { VideoStudioFooter } from "./studio-footer";
import { VideoStudioSettings } from "./studio-settings";
import styles from "../composer.module.css";
import { Form } from "@/components/ui/form";
import { useAppTranslate } from "@/hooks";
import { DynamicPromptConfigField } from "@/pages/(app)/generation/_components/dynamic-config";
import { PromptTextarea } from "@/pages/(app)/generation/_components/prompt-box/prompt-textarea";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
import { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";

type Props = Pick<
  GenerationPromptBoxProps,
  | "initialPrompt"
  | "onSubmit"
  | "isLoading"
  | "lastMessageConfig"
  | "lastMessageModelUuid"
  | "lastMessageStatus"
  | "successfulMessageClearKey"
>;
const QUICK_FIELDS = new Set([
  "mode",
  "aspect_ratio",
  "duration",
  "resolution",
]);
const ADVANCED_EXCLUDED_FIELDS = new Set(["prompt", ...QUICK_FIELDS]);

export const GenerationVideoPromptBox: FC<Props> = (props) => {
  const { t } = useAppTranslate();
  const studio = useGenerationPromptBox({
    ...props,
    advancedExcludedFieldNames: ADVANCED_EXCLUDED_FIELDS,
    promptBoxFieldNames: QUICK_FIELDS,
    supportedOutputs: [AiRegistryModelSupportedTypesEnumMap.VIDEO],
    validationErrorTitle: t("common.error"),
    validationFieldErrorMessage: t("common.invalidField"),
  });
  const { dynamicForm, model, isFormBusy } = studio;

  return (
    <div className={styles.composer} data-generation-composer-card>
      <Form {...dynamicForm.form}>
        <form aria-busy={isFormBusy} onSubmit={studio.handleFormSubmit}>
          <div className={styles.body}>
            <header className={styles.heading}>
              <span>{t("pages.generation.video.studio.eyebrow")}</span>
              <h2>{t("pages.generation.video.studio.title")}</h2>
            </header>
            <VideoModelPicker
              model={model}
              disabled={
                Boolean(props.isLoading) ||
                studio.isUploadingMedia ||
                model.modelsListState.isLoading
              }
            />
            {dynamicForm.isFieldVisible("mode") && (
              <DynamicPromptConfigField
                dynamicForm={dynamicForm}
                fieldName="mode"
                disabled={isFormBusy || studio.isUploadingMedia}
                layout="stacked"
              />
            )}
            <VideoReferenceBoard key={model.currentModel} studio={studio} />
            {studio.isPromptFieldVisible && (
              <PromptTextarea
                dynamicForm={dynamicForm}
                disabled={isFormBusy}
                label={t("pages.generation.video.studio.composerLabel")}
                placeholder={t(
                  "pages.generation.video.promptBox.promptTextArea.placeholder",
                )}
              />
            )}
            <VideoStudioSettings studio={studio} />
          </div>
          <VideoStudioFooter
            studio={studio}
            model={model}
            isLoading={props.isLoading}
          />
        </form>
      </Form>
    </div>
  );
};
