import type { ReactNode } from "react";

import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import type {
  AiRegistryModelSupportedTypesEnumValue,
  SchemaAiTaskMessageResponse,
} from "@/services/api";

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
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
  lastMessageModelUuid?: SchemaAiTaskMessageResponse["ai_model_uuid"];
  onSubmit: (data: unknown, ai_model_uuid: string) => Promise<void> | void;
  promptClearKey?: string;
  promptBoxFieldNames: ReadonlySet<string>;
  promptPlaceholderKey: string;
  supportedOutputs: AiRegistryModelSupportedTypesEnumValue[];
}
