import type { FC } from "react";

import { ExclusiveImageInputsHint } from "./exclusive-image-inputs-hint";
import { ImagesReferenceUploader } from "./images-reference-uploader";

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

const PROMPT_FIELD_NAMES = new Set([
  "prompt",
  "frame_images",
  "reference_images",
]);
const PROMPT_BOX_CONFIG_FIELD_NAMES = new Set(["size", "resolution"]);
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
        <ImagesReferenceUploader
          dynamicForm={dynamicForm}
          disabled={isFormBusy}
          onUploadingChange={setIsUploadingMedia}
        />
      </>
    )}
    promptBoxFieldNames={PROMPT_BOX_CONFIG_FIELD_NAMES}
    promptPlaceholderKey="pages.generation.video.promptBox.promptTextArea.placeholder"
    supportedOutputs={[AiRegistryModelSupportedTypesEnumMap.VIDEO]}
  />
);
