import type { FC } from "react";

import { VideoReferenceInputs } from "./reference-inputs";

import { useAppTranslate } from "@/hooks";
import { GenerationPromptBox } from "@/pages/(app)/generation/_components/prompt-box";
import type { GenerationPromptBoxProps } from "@/pages/(app)/generation/_components/prompt-box/types";
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

const MEDIA_FIELDS = new Set([
  "prompt",
  "input_video",
  "frame_images",
  "reference_images",
  "reference_videos",
]);
const QUICK_FIELDS = new Set([
  "mode",
  "aspect_ratio",
  "duration",
  "resolution",
]);
const ADVANCED_EXCLUDED_FIELDS = new Set([...MEDIA_FIELDS, ...QUICK_FIELDS]);

export const GenerationVideoPromptBox: FC<Props> = (props) => {
  const { t } = useAppTranslate();

  return (
    <GenerationPromptBox
      {...props}
      advancedExcludedFieldNames={ADVANCED_EXCLUDED_FIELDS}
      advancedSettingsLabel={t("pages.generation.video.studio.advanced")}
      composerLabel={t("pages.generation.video.studio.composerLabel")}
      extraContent={(inputProps) => <VideoReferenceInputs {...inputProps} />}
      modelLabel={t("pages.generation.video.studio.model")}
      primaryActionLabel={t("pages.generation.video.studio.generate")}
      promptBoxFieldNames={QUICK_FIELDS}
      promptPlaceholderKey="pages.generation.video.promptBox.promptTextArea.placeholder"
      showModeSection
      supportedOutputs={[AiRegistryModelSupportedTypesEnumMap.VIDEO]}
    />
  );
};
