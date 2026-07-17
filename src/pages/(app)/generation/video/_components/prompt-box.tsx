import type { FC } from "react";

import { ExclusiveImageInputsHint } from "./exclusive-image-inputs-hint";

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
  lastMessageStatus?: SchemaAiTaskMessageResponse["task_status"];
  successfulMessageClearKey?: string;
}

const PROMPT_FIELD_NAMES = new Set([
  "prompt",
  "input_video",
  "frame_images",
  "reference_images",
  "reference_videos",
]);
const PROMPT_BOX_CONFIG_FIELD_NAMES = new Set([
  "mode",
  "resolution",
  "aspect_ratio",
  "video_id",
  "character_orientation",
  "duration",
  "elements",
]);
const ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES = new Set([
  ...PROMPT_FIELD_NAMES,
  ...PROMPT_BOX_CONFIG_FIELD_NAMES,
]);

export const GenerationVideoPromptBox: FC<Props> = (props) => (
  <GenerationPromptBox
    {...props}
    advancedExcludedFieldNames={ADVANCED_CONFIG_EXCLUDED_FIELD_NAMES}
    extraContent={({
      dynamicForm,
      isFormBusy,
      isUploadingMedia,
      setIsUploadingMedia,
    }) => (
      <>
        <ExclusiveImageInputsHint
          configSchema={dynamicForm.configSchema}
          frameImages={dynamicForm.watch("frame_images")}
          isUploadingImage={isUploadingMedia}
          referenceImages={dynamicForm.watch("reference_images")}
        />
        <DynamicConfigFileFields
          dynamicForm={dynamicForm}
          disabled={isFormBusy}
          onUploadingChange={setIsUploadingMedia}
          requestId="video_generation"
        />
      </>
    )}
    promptBoxFieldNames={PROMPT_BOX_CONFIG_FIELD_NAMES}
    promptPlaceholderKey="pages.generation.video.promptBox.promptTextArea.placeholder"
    supportedOutputs={[AiRegistryModelSupportedTypesEnumMap.VIDEO]}
  />
);
