import type { ReactNode } from "react";
import type { GenerationComposerIntent } from "../../_types/conversation";

import type { DynamicConfigForm } from "@/features/dynamic-config";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";
import type {
  AiRegistryModelSupportedTypesEnumValue,
  SchemaAiTaskMessageResponse,
} from "@/shared/api";

export type ConfigDefaultsResolver = (
  lastMessageConfig: SchemaAiTaskMessageResponse["ai_model_config"] | undefined,
) => Record<string, unknown> | undefined;

export interface PromptBoxExtraContentProps {
  dynamicForm: DynamicConfigForm;
  isFormBusy: boolean;
  isUploadingMedia: boolean;
  setIsUploadingMedia: (isUploading: boolean) => void;
}

export interface GenerationPromptBoxProps {
  advancedExcludedFieldNames: ReadonlySet<string>;
  configDefaultsResolver?: ConfigDefaultsResolver;
  extraContent?: (props: PromptBoxExtraContentProps) => ReactNode;
  modelSelectionContent?: (props: {
    disabled: boolean;
    dynamicForm: DynamicConfigForm;
    model: ReturnType<typeof useModel>;
  }) => ReactNode;
  primaryActionLabel?: string;
  advancedSettingsLabel?: string;
  composerLabel?: string;
  modelLabel?: string;
  composerIntent?: GenerationComposerIntent;
  initialPrompt?: string;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
  lastMessageModelUuid?: SchemaAiTaskMessageResponse["ai_model_uuid"];
  lastMessageStatus?: SchemaAiTaskMessageResponse["task_status"];
  /** Return false when a guard prevents submission, so the draft stays unsent. */
  onSubmit: (
    data: Readonly<Record<string, unknown>>,
    aiModelUuid: string,
  ) => Promise<void | false> | void | false;
  onComposerIntentApplied?: (intentId: string) => void;
  successfulMessageClearKey?: string;
  promptBoxFieldNames: ReadonlySet<string>;
  promptPlaceholderKey: string;
  showModeSection?: boolean;
  supportedOutputs: AiRegistryModelSupportedTypesEnumValue[];
}
