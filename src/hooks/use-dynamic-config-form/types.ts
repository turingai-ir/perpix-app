import type { UseFormProps } from "react-hook-form";

export type JsonSchemaType =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "null";

export type JsonConfigUi = {
  order?: readonly string[];
  widgets?: Record<string, string>;
  enumLabels?: Record<string, Record<string, string>>;
  visibility?: readonly JsonConfigUiVisibilityRule[];
};

export type JsonConfigUiVisibilityRule = {
  effect: "SHOW" | "HIDE";
  fields: readonly string[];
  condition: {
    field: string;
    operator: "empty" | "not_empty" | "equals" | "not_equals" | "in" | "not_in";
    value?: unknown;
    values?: readonly unknown[];
  };
};

export type JsonSchemaProperty = {
  type?: JsonSchemaType | readonly JsonSchemaType[];
  enum?: readonly (string | number)[];
  const?: unknown;
  label?: {
    options?: Record<string, string>;
  };

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
  required?: boolean | readonly string[];
  additionalProperties?: boolean;
  not?: JsonSchemaProperty;
  "x-required"?: boolean;
  "x-file"?: {
    type?: "list" | "single" | string;
  };
};

export type JsonConfigSchema = {
  $schema?: string;
  $id?: string;
  type: "object";
  required?: readonly string[];
  properties: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean;
  allOf?: readonly unknown[];
  "x-ui"?: JsonConfigUi;
};

export type JsonConfigMeta = {
  labels?: Record<string, Record<string, string>>;
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
    | "file"
    | "file-list"
    | "array"
    | "object"
    | "hidden"
    | "unknown";
  options?: readonly (string | number)[];
  optionLabels?: Record<string, string>;
  description?: string;
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
