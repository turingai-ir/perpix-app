import type { FC } from "react";

import { DynamicConfigFileFields } from "@/pages/(app)/generation/_components/dynamic-config";
import { GenerationPromptBox } from "@/pages/(app)/generation/_components/prompt-box";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";

interface Props {
  onSubmit: (data: any, ai_model_uuid: string) => Promise<void> | void;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
  lastMessageModelUuid?: SchemaAiTaskMessageResponse["ai_model_uuid"];
  promptClearKey?: string;
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
    extraContent={({ dynamicForm, isFormBusy, setIsUploadingMedia }) => (
      <DynamicConfigFileFields
        dynamicForm={dynamicForm}
        disabled={isFormBusy}
        onUploadingChange={setIsUploadingMedia}
        requestId="image_generation"
      />
    )}
    promptBoxFieldNames={PROMPT_BOX_CONFIG_FIELD_NAMES}
    promptPlaceholderKey="pages.generation.image.promptBox.promptTextArea.placeholder"
    supportedOutputs={[AiRegistryModelSupportedTypesEnumMap.IMAGE]}
  />
);
