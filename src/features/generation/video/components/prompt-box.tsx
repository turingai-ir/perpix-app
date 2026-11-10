import type { FC } from "react";
import { useWatch } from "react-hook-form";

import { VideoModelPicker } from "./model-picker";
import { VideoModeTabs } from "./video-mode-tabs";
import { VideoReferenceBoard } from "./reference-board";
import { VideoStudioFooter } from "./studio-footer";
import { VideoStudioSettings } from "./studio-settings";
import { Form } from "@/shared/ui/form";
import { useAppTranslate } from "@/shared/hooks";
import { PromptTextarea } from "@/features/generation/components/prompt-box/prompt-textarea";
import type { GenerationPromptBoxProps } from "@/features/generation/components/prompt-box/types";
import { useGenerationPromptBox } from "@/features/generation/hooks";
import { AiRegistryModelSupportedTypesEnumMap } from "@/shared/api";

type Props = Pick<
  GenerationPromptBoxProps,
  | "failedRequest"
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
    <div
      className="border-border bg-card text-foreground [&_:is(button,input,textarea,summary):focus-visible]:outline-ring flex h-full min-h-0 flex-col overflow-hidden rounded-[18px] border max-[950px]:h-auto [&_:is(button,input,textarea,summary):focus-visible]:outline-2 [&_:is(button,input,textarea,summary):focus-visible]:outline-offset-3 [&_button]:touch-manipulation [&_form]:flex [&_form]:min-h-0 [&_form]:min-w-0 [&_form]:flex-1 [&_form]:flex-col [&_input]:text-base [&_textarea]:text-base"
      data-generation-composer-card
    >
      <Form {...dynamicForm.form}>
        <form aria-busy={isFormBusy} onSubmit={studio.handleFormSubmit}>
          <div className="flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-5 overflow-y-auto overscroll-contain px-4.5 pt-5 pb-6 max-[950px]:overflow-visible max-[600px]:gap-3.5 max-[600px]:px-3.5 max-[600px]:pt-4 max-[600px]:pb-4.5">
            <div className="grid grid-cols-1 items-center gap-5">
              <header className="flex items-center gap-2.5">
                <img
                  src="/android-chrome-512x512.png"
                  width={36}
                  height={36}
                  alt=""
                  className="size-8 object-contain"
                />
                <h2 className="m-0 text-lg font-bold tracking-tight">
                  {t("pages.generation.video.studio.title")}
                </h2>
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
              <div className="border-border bg-background focus-within:border-primary/60 [&_textarea]:caret-primary grid min-w-0 gap-2.5 rounded-[14px] border p-4 transition-[border-color,box-shadow] duration-150 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)] motion-reduce:transition-none [&_label]:text-xs [&_label]:leading-relaxed [&_textarea]:max-h-55 [&_textarea]:min-h-28 [&_textarea]:resize-y [&_textarea]:rounded-none [&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:px-0 [&_textarea]:pt-2.5 [&_textarea]:pb-0 [&_textarea]:leading-loose [&_textarea]:shadow-none [&_textarea:focus]:border-0 [&_textarea:focus]:shadow-none [&_textarea:focus-visible]:outline-0">
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
