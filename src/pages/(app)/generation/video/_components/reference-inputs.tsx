import { ExclusiveImageInputsHint } from "./exclusive-image-inputs-hint";

import { DynamicConfigFileFields } from "@/pages/(app)/generation/_components/dynamic-config";
import type { PromptBoxExtraContentProps } from "@/pages/(app)/generation/_components/prompt-box/types";

export function VideoReferenceInputs({
  dynamicForm,
  isFormBusy,
  isUploadingMedia,
  setIsUploadingMedia,
}: PromptBoxExtraContentProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-start gap-2">
      <DynamicConfigFileFields
        dynamicForm={dynamicForm}
        disabled={isFormBusy}
        onUploadingChange={setIsUploadingMedia}
        presentation="composer"
        requestId="video_generation"
      />
      <ExclusiveImageInputsHint
        configSchema={dynamicForm.configSchema}
        frameImages={dynamicForm.watch("frame_images")}
        referenceImages={dynamicForm.watch("reference_images")}
        isUploadingImage={isUploadingMedia}
      />
    </div>
  );
}
