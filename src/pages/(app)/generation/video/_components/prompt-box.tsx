import type { FC } from "react";
import { useWatch } from "react-hook-form";

import { VideoModelPicker } from "./model-picker";
import { VideoModeTabs } from "./video-mode-tabs";
import { VideoReferenceBoard } from "./reference-board";
import { VideoStudioFooter } from "./studio-footer";
import { VideoStudioSettings } from "./studio-settings";
import styles from "../composer.module.css";
import { Form } from "@/components/ui/form";
import { useAppTranslate } from "@/hooks";
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
  const mode = useWatch({ control: dynamicForm.control, name: "mode" });
  const defaultPromptPlaceholder = t(
    "pages.generation.video.promptBox.promptTextArea.placeholder",
  );
  const promptPlaceholder = t(
    `pages.generation.video.studio.modePlaceholders.${String(mode ?? "default")}`,
    { defaultValue: defaultPromptPlaceholder },
  );

  return (
    <div className={styles.composer} data-generation-composer-card>
      <Form {...dynamicForm.form}>
        <form aria-busy={isFormBusy} onSubmit={studio.handleFormSubmit}>
          <div className={styles.body}>
            <div className={styles.composerHeader}>
              <header className={styles.heading}>
                <img
                  src="/android-chrome-512x512.png"
                  width={36}
                  height={36}
                  alt=""
                />
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
              <VideoModeTabs
                dynamicForm={dynamicForm}
                disabled={isFormBusy || studio.isUploadingMedia}
              />
            </div>
            {studio.isPromptFieldVisible && (
              <div className={styles.promptCanvas}>
                <PromptTextarea
                  dynamicForm={dynamicForm}
                  disabled={isFormBusy}
                  label={t("pages.generation.video.studio.composerLabel")}
                  placeholder={promptPlaceholder}
                />
              </div>
            )}
            <VideoReferenceBoard key={model.currentModel} studio={studio} />
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
