import type { FC } from "react";

import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "../dynamic-config";
import { PromptModelSelector } from "./model-selector";
import { PromptSubmitButton } from "./submit-button";

import type { useModel } from "@/pages/(app)/generation/_hooks/model";

type PromptBoxModel = ReturnType<typeof useModel>;

export const PromptModeSection: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
}> = ({ disabled, dynamicForm }) => (
  <div className="border-border/40 flex w-full justify-center border-b pt-1 pb-3 [&_[data-slot=scroll-area]]:mx-auto [&_[data-slot=scroll-area]]:w-fit [&_[data-slot=scroll-area]]:max-w-full">
    <DynamicPromptConfigField
      dynamicForm={dynamicForm}
      fieldName="mode"
      disabled={disabled}
    />
  </div>
);

export const PromptActionsSection: FC<{
  advancedFieldNames: readonly string[];
  chooseModelLabel: string;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  inlineFieldNames: readonly string[];
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  model: PromptBoxModel;
  upgradeLabel: string;
}> = ({
  advancedFieldNames,
  chooseModelLabel,
  disabled,
  dynamicForm,
  inlineFieldNames,
  isLoading,
  isSubmitDisabled,
  model,
  upgradeLabel,
}) => (
  <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
    <div>
      <PromptSubmitButton disabled={isSubmitDisabled} isLoading={isLoading} />
    </div>
    <div className="flex w-full flex-wrap gap-4">
      <PromptModelSelector
        chooseModelLabel={chooseModelLabel}
        disabled={disabled}
        model={model}
        upgradeLabel={upgradeLabel}
      />
      {inlineFieldNames.map((fieldName) => (
        <DynamicPromptConfigField
          key={fieldName}
          dynamicForm={dynamicForm}
          fieldName={fieldName}
          disabled={disabled}
          layout="stacked"
        />
      ))}
      <AdvancedPromptSettingsDialog
        dynamicForm={dynamicForm}
        fieldNames={advancedFieldNames}
        disabled={disabled}
      />
    </div>
  </div>
);

export const PromptFullWidthFieldsSection: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
}> = ({ disabled, dynamicForm, fieldNames }) => {
  if (fieldNames.length === 0) return null;

  return (
    <div className="border-border/60 flex w-full flex-col gap-4 border-t pt-4 pb-2">
      {fieldNames.map((fieldName) => (
        <DynamicPromptConfigField
          key={fieldName}
          dynamicForm={dynamicForm}
          fieldName={fieldName}
          disabled={disabled}
          layout="stacked"
        />
      ))}
    </div>
  );
};
