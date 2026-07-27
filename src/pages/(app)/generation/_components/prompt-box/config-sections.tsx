import type { FC } from "react";

import { DynamicPromptConfigField, type DynamicConfigForm } from "../dynamic-config";

export { PromptActionsSection } from "./prompt-actions-section";

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
