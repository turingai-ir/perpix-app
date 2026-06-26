import type { FC } from "react";

import { ImageReferenceUploader } from "./image-reference-uploader";

import { GenerationPromptBox } from "@/pages/(app)/generation/_components/prompt-box";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";

interface Props {
  onSubmit: (data: any, ai_model_uuid: string) => void;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
}

const PROMPT_FIELD_NAMES = new Set(["prompt", "reference_images"]);
const PROMPT_BOX_CONFIG_FIELD_NAMES = new Set(["size", "resolution"]);
const ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES = new Set([
  ...PROMPT_FIELD_NAMES,
  ...PROMPT_BOX_CONFIG_FIELD_NAMES,
]);

export const GenerationImagePromptBox: FC<Props> = (props) => (
  <GenerationPromptBox
    {...props}
    advancedExcludedFieldNames={ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES}
    configDefaultsResolver={(lastMessageConfig) =>
      lastMessageConfig
        ? {
            ...lastMessageConfig,
            reference_images:
              lastMessageConfig.images_generated ??
              lastMessageConfig.reference_images,
          }
        : undefined
    }
    extraContent={({ dynamicForm, isFormBusy, setIsUploadingMedia }) => (
      <ImageReferenceUploader
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
