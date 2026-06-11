import type { UseFormProps } from "react-hook-form";

export type JsonSchemaType =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "array"
  | "object";

export type JsonSchemaProperty = {
  type?: JsonSchemaType;
  enum?: readonly (string | number)[];

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
};

export type JsonConfigSchema = {
  $id?: string;
  type: "object";
  required?: readonly string[];
  properties: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean;
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
    | "array"
    | "object"
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
