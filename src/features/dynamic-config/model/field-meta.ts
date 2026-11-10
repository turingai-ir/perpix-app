import {
  findJsonFormsControl,
  getJsonFormsControlEntries,
} from "./json-forms-adapter";
import {
  type FieldMeta,
  type JsonConfigMeta,
  type JsonConfigSchema,
  type JsonSchemaProperty,
  getPrimaryType,
} from "./form-types";
import {
  getConditionalProperty,
  getRequiredConfigFields,
  isRequired,
} from "./field-visibility";

function resolveWidgetInputType(
  widget: string | undefined,
): FieldMeta["inputType"] | undefined {
  switch (widget) {
    case "textarea":
    case "text":
    case "select":
    case "switch":
    case "number":
    case "checkbox":
    case "file":
    case "file-list":
    case "array":
    case "object":
    case "hidden":
      return widget;

    default:
      return undefined;
  }
}

function resolveInputType(prop: JsonSchemaProperty): FieldMeta["inputType"] {
  if (prop["x-file"]?.type === "list") return "file-list";
  if (prop["x-file"]) return "file";

  const hasEnumOptions = Boolean(prop.enum && prop.enum.length > 0);
  const isConstOnly =
    "const" in prop && prop.const !== undefined && !hasEnumOptions;

  if (prop["x-pricing-only"] || isConstOnly) return "hidden";

  const propType = getPrimaryType(prop);

  if (hasEnumOptions) return "select";
  if (propType === "string")
    return (prop.maxLength ?? 0) > 200 ? "textarea" : "text";
  if (propType === "integer" || propType === "number") return "number";
  if (propType === "boolean") return "checkbox";
  if (propType === "array") return "array";
  if (propType === "object") return "object";
  return "unknown";
}

function resolveOptionLabels(
  fieldName: string,
  configMeta?: JsonConfigMeta | null,
) {
  return resolveUiFieldMeta(configMeta, fieldName)?.labels;
}

function normalizeMetaFieldName(fieldName: string) {
  return fieldName.replace(/\.\d+(?=\.|$)/g, "[]");
}

export function resolveUiFieldMeta(
  configMeta: JsonConfigMeta | null | undefined,
  fieldName: string,
) {
  const normalizedFieldName = normalizeMetaFieldName(fieldName);
  const control = findJsonFormsControl(configMeta, normalizedFieldName);
  return control
    ? { ...control.options, title: control.label ?? control.options?.title }
    : undefined;
}

export function buildFieldMeta(params: {
  name: string;
  prop: JsonSchemaProperty;
  requiredFields: readonly string[];
  defaultValues: Record<string, unknown>;
  configMeta?: JsonConfigMeta | null;
  configSchema?: JsonConfigSchema;
  values?: Record<string, unknown>;
}): FieldMeta {
  const {
    name,
    prop,
    requiredFields,
    defaultValues,
    configMeta,
    configSchema,
    values,
  } = params;

  const uiFieldMeta = resolveUiFieldMeta(configMeta, name);
  const conditionalProperty =
    values && configSchema
      ? (getConditionalProperty(configSchema, name, values) ?? prop)
      : prop;
  const resolvedWidget = uiFieldMeta?.widget ?? undefined;
  const resolvedProperty: JsonSchemaProperty = {
    ...conditionalProperty,
    title: uiFieldMeta?.title ?? conditionalProperty.title,
    description: uiFieldMeta?.description ?? conditionalProperty.description,
    "x-file": uiFieldMeta?.file ?? conditionalProperty["x-file"],
  };
  const hasEnumOptions = Boolean(
    resolvedProperty.enum && resolvedProperty.enum.length > 0,
  );
  let inputType = resolveWidgetInputType(resolvedWidget);
  if (inputType === "select" && !hasEnumOptions) {
    inputType = undefined;
  }
  if (!inputType) {
    if (resolvedWidget === "switch") {
      inputType = hasEnumOptions ? "select" : "checkbox";
    } else if (
      resolvedWidget === "list" ||
      resolvedWidget === "elements-list"
    ) {
      inputType = "array";
    } else {
      inputType = resolveInputType(resolvedProperty);
    }
  }
  if (resolvedProperty["x-pricing-only"]) {
    inputType = "hidden";
  }

  if (resolvedProperty["x-pricing-only"] === true) {
    inputType = "hidden";
  }

  return {
    name,
    property: resolvedProperty,
    required:
      values && configSchema
        ? getRequiredConfigFields(configSchema, values).has(name)
        : isRequired(name, requiredFields),
    defaultValue: defaultValues[name],
    inputType,
    options: resolvedProperty.enum,
    optionLabels: resolveOptionLabels(name, configMeta),
    description: resolvedProperty.description,
    hint:
      name === "prompt"
        ? undefined
        : (uiFieldMeta?.hint ?? resolvedProperty.description),
    title: resolvedProperty.title,
  };
}

export function getOrderedFieldNames(
  configSchema?: JsonConfigSchema | null,
  configMeta?: JsonConfigMeta | null,
) {
  const schemaFields = Object.keys(configSchema?.properties ?? {});
  const schemaFieldSet = new Set(schemaFields);
  const jsonFormsOrder = getJsonFormsControlEntries(configMeta)
    .map((entry) => entry.fieldName)
    .filter((fieldName) => !fieldName.includes("[]"));
  const orderedFields = jsonFormsOrder.filter((fieldName) =>
    schemaFieldSet.has(fieldName),
  );
  const orderedFieldSet = new Set(orderedFields);
  const remainingFields = schemaFields.filter(
    (fieldName) => !orderedFieldSet.has(fieldName),
  );

  return [...orderedFields, ...remainingFields];
}
