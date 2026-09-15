import type { FC } from "react";

import { ImageModelDiscovery } from "./model-discovery";
import { ImageReferenceInput } from "./image-reference-input";

import { useAppTranslate } from "@/hooks";

import { GenerationPromptBox } from "@/pages/(app)/generation/_components/prompt-box";
import type { GenerationComposerIntent } from "@/pages/(app)/generation/_types/conversation";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";

interface Props {
  initialPrompt?: string;
  onSubmit: (
    data: Readonly<Record<string, unknown>>,
    aiModelUuid: string,
  ) => Promise<void> | void;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
  lastMessageModelUuid?: SchemaAiTaskMessageResponse["ai_model_uuid"];
  lastMessageStatus?: SchemaAiTaskMessageResponse["task_status"];
  successfulMessageClearKey?: string;
  composerIntent?: GenerationComposerIntent;
  onComposerIntentApplied?: (intentId: string) => void;
}

const PROMPT_FIELD_NAMES = new Set(["prompt", "reference_images"]);
const PROMPT_BOX_CONFIG_FIELD_NAMES = new Set([
  "mode",
  "resolution",
  "aspect_ratio",
]);
const ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES = new Set([
  ...PROMPT_FIELD_NAMES,
  ...PROMPT_BOX_CONFIG_FIELD_NAMES,
]);

export const GenerationImagePromptBox: FC<Props> = (props) => {
  const { t } = useAppTranslate();
  return (
    <GenerationPromptBox
      {...props}
      modelSelectionContent={(selectionProps) => (
        <ImageModelDiscovery {...selectionProps} />
      )}
      primaryActionLabel={t("pages.generation.image.studio.create")}
      advancedSettingsLabel={t(
        "pages.generation.image.studio.optionalSettings",
      )}
      advancedExcludedFieldNames={ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES}
      extraContent={({ dynamicForm, isFormBusy, setIsUploadingMedia }) => (
        <ImageReferenceInput
          dynamicForm={dynamicForm}
          disabled={isFormBusy}
          onUploadingChange={setIsUploadingMedia}
        />
      )}
      promptBoxFieldNames={PROMPT_BOX_CONFIG_FIELD_NAMES}
      promptPlaceholderKey="pages.generation.image.promptBox.promptTextArea.placeholder"
      supportedOutputs={[AiRegistryModelSupportedTypesEnumMap.IMAGE]}
    />
  );
};
