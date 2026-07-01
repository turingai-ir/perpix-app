import type { FC } from "react";

import { DynamicConfigFileField } from "../file-upload/file-field";
import { clearElementMediaConflicts } from "../file-upload/media";
import { getNestedLabel, resolvePropertyInputType } from "../schema";
import type { DynamicConfigPropertyFieldProps } from "../types";
import { DynamicConfigArrayField } from "./array-field";
import {
  DynamicConfigObjectField,
  DynamicConfigObjectFields,
} from "./object-field";
import { DynamicConfigPrimitiveField } from "./primitive-field";

export const DynamicConfigPropertyField: FC<
  DynamicConfigPropertyFieldProps
> = ({
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
  const resolvedInputType =
    inputType ?? resolvePropertyInputType(property, undefined);
  const renderNestedField = ({
    fieldName: nestedFieldName,
    property: nestedProperty,
  }: {
    fieldName: string;
    property: typeof property;
  }) => (
    <DynamicConfigPropertyField
      dynamicForm={dynamicForm}
      fieldName={nestedFieldName}
      label={getNestedLabel(nestedProperty, nestedFieldName)}
      property={nestedProperty}
      disabled={disabled}
      layout="stacked"
    />
  );

  if (resolvedInputType === "hidden" || resolvedInputType === "unknown") {
    return null;
  }

  if (resolvedInputType === "file" || resolvedInputType === "file-list") {
    return (
      <DynamicConfigFileField
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        property={property}
        disabled={disabled}
        onValueChange={() => clearElementMediaConflicts(dynamicForm, fieldName)}
      />
    );
  }

  if (resolvedInputType === "array") {
    return (
      <DynamicConfigArrayField
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        property={property}
        disabled={disabled}
        renderObjectFields={({ fieldName, property }) => (
          <DynamicConfigObjectFields
            dynamicForm={dynamicForm}
            fieldName={fieldName}
            property={property}
            disabled={disabled}
            renderField={renderNestedField}
          />
        )}
      />
    );
  }

  if (resolvedInputType === "object") {
    return (
      <DynamicConfigObjectField
        dynamicForm={dynamicForm}
        fieldName={fieldName}
        label={label}
        property={property}
        disabled={disabled}
        renderField={renderNestedField}
      />
    );
  }

  return (
    <DynamicConfigPrimitiveField
      dynamicForm={dynamicForm}
      fieldName={fieldName}
      inputType={resolvedInputType}
      label={label}
      optionLabels={optionLabels}
      options={options}
      property={property}
      disabled={disabled}
      layout={layout}
    />
  );
};
