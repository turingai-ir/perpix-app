import type {
  FieldMeta,
  JsonSchemaProperty,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";

export type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;
export type FieldLayout = "inline" | "stacked";
export type FieldInputType = FieldMeta["inputType"];
export type DynamicConfigOption = string | number | boolean | null;
export type DynamicConfigOptions = readonly DynamicConfigOption[];

export interface DynamicConfigFieldProps {
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  hint?: string;
  label: string;
  layout?: FieldLayout;
  property: JsonSchemaProperty;
}

export interface DynamicConfigPropertyFieldProps extends DynamicConfigFieldProps {
  inputType?: FieldInputType;
  optionLabels?: Record<string, string>;
  options?: DynamicConfigOptions;
}
