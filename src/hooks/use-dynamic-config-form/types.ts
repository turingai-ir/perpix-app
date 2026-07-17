import type { UseFormProps } from "react-hook-form";

import type { ControlElement, UISchemaElement } from "@jsonforms/core";

export type JsonSchemaType =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "null";

export type JsonConfigUiField = {
  widget?: string | null;
  title?: string | null;
  description?: string | null;
  hint?: string | null;
  file?: JsonSchemaProperty["x-file"] | null;
  errors?: Record<string, string>;
  labels?: Record<string, string>;
};

export type JsonFormsUiSchemaControl = ControlElement & {
  label?: string;
  options?: JsonConfigUiField & {
    detail?: UISchemaElement | string;
  };
};

export type JsonSchemaProperty = {
  type?: JsonSchemaType | readonly JsonSchemaType[];
  enum?: readonly (string | number | boolean | null)[];
  const?: unknown;

  default?: unknown;
  description?: string;
  title?: string;

  minimum?: number;
  maximum?: number;

  minLength?: number;
  maxLength?: number;

  minItems?: number;
  maxItems?: number;

  items?: JsonSchemaProperty;

  properties?: Record<string, JsonSchemaProperty>;
  required?: readonly string[];
  additionalProperties?: boolean;
  not?: JsonSchemaProperty;
  "x-file"?: {
    type?: "list" | "single" | string;
    accept?: readonly string[];
  };
};

export function getPrimaryType(property: JsonSchemaProperty) {
  if (!Array.isArray(property.type)) return property.type;

  return property.type.find((type) => type !== "null") ?? property.type[0];
}

export type JsonConfigSchema = {
  $schema?: string;
  $id?: string;
  type: "object";
  required?: readonly string[];
  properties: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean;
  allOf?: readonly unknown[];
};

export type JsonConfigMeta = {
  uischema?: UISchemaElement;
};

export type DynamicConfigValues = Record<string, unknown>;

export type FieldMeta = {
  name: string;
  property: JsonSchemaProperty;
  required: boolean;
  defaultValue: unknown;
  inputType:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "switch"
    | "file"
    | "file-list"
    | "array"
    | "object"
    | "hidden"
    | "unknown";
  options?: readonly (string | number | boolean | null)[];
  optionLabels?: Record<string, string>;
  description?: string;
  hint?: string;
  title?: string;
};

export type UseDynamicConfigFormInput = {
  configSchema?: JsonConfigSchema | null;
  configDefaults?: Record<string, unknown> | null;
  configMeta?: JsonConfigMeta | null;
  schemaKey?: string | number | null;
  autoResetOnSchemaChange?: boolean;
  formOptions?: Omit<
    UseFormProps<DynamicConfigValues>,
    "resolver" | "defaultValues"
  >;
};

export type DynamicConfigValidationMessages = {
  required: string;
  invalidEnum: string;
  invalidString: string;
  invalidNumber: string;
  invalidInteger: string;
  invalidArray: string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
  minNumber: (min: number) => string;
  maxNumber: (max: number) => string;
  minItems: (min: number) => string;
  maxItems: (max: number) => string;
};
