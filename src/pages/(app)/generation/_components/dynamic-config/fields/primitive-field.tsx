import type { FC } from "react";

import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import { DynamicConfigCheckboxField } from "./controls/checkbox-field";
import { getFieldLayoutClasses } from "./controls/field-layout";
import { DynamicConfigNumberField } from "./controls/number-field";
import { DynamicConfigSelectField } from "./controls/select-field";
import { DynamicConfigSwitchField } from "./controls/switch-field";
import { DynamicConfigTextField } from "./controls/text-field";
import { DynamicConfigTextareaField } from "./controls/textarea-field";
import type {
  DynamicConfigForm,
  DynamicConfigOptions,
  FieldInputType,
  FieldLayout,
} from "../types";

export const DynamicConfigPrimitiveField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  inputType: FieldInputType;
  label: string;
  layout?: FieldLayout;
  optionLabels?: Record<string, string>;
  options?: DynamicConfigOptions;
  property: JsonSchemaProperty;
}> = ({
  disabled,
  dynamicForm,
  fieldName,
  inputType,
  label,
  layout = "inline",
  optionLabels,
  options,
  property,
}) => {
  const classes = getFieldLayoutClasses(layout);

  if (inputType === "switch") {
    return (
      <DynamicConfigSwitchField
        classes={classes}
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        optionLabels={optionLabels}
        options={(options ?? property.enum ?? []).filter(
          (option) => option !== null,
        )}
        property={property}
      />
    );
  }

  if (inputType === "select") {
    return (
      <DynamicConfigSelectField
        classes={classes}
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        optionLabels={optionLabels}
        options={(options ?? property.enum ?? []).filter(
          (option) => option !== null,
        )}
        property={property}
      />
    );
  }

  if (inputType === "number") {
    return (
      <DynamicConfigNumberField
        classes={classes}
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        property={property}
      />
    );
  }

  if (inputType === "checkbox") {
    return (
      <DynamicConfigCheckboxField
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        isStacked={classes.isStacked}
        label={label}
        property={property}
      />
    );
  }

  if (inputType === "textarea") {
    return (
      <DynamicConfigTextareaField
        classes={classes}
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
      />
    );
  }

  return (
    <DynamicConfigTextField
      classes={classes}
      disabled={disabled}
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      label={label}
    />
  );
};
