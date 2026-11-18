import { type DefaultValues } from "react-hook-form";
import {
  type DynamicConfigValues,
  type JsonConfigSchema,
  type JsonSchemaProperty,
  getPrimaryType,
} from "./form-types";
import { isRecord } from "./schema-guards";
import {
  applyConditionalConstValues,
  getConditionalProperty,
  getVisibleConfigFields,
  isRequired,
  nestedRequiredFields,
} from "./field-visibility";

function getEmptyDefaultValue(
  prop: JsonSchemaProperty,
  isRequiredField = false,
): unknown {
  if (prop.enum && prop.enum.length > 0) {
    return isRequiredField ? prop.enum[0] : undefined;
  }

  switch (getPrimaryType(prop)) {
    case "string":
      return "";

    case "integer":
    case "number":
      return undefined;

    case "boolean":
      return isRequiredField ? false : undefined;

    case "array":
      return [];

    case "object":
      if (prop.properties) {
        return buildDefaultValues({
          type: "object",
          properties: prop.properties,
          required: nestedRequiredFields(prop),
          additionalProperties: prop.additionalProperties,
        });
      }

      return {};

    default:
      return undefined;
  }
}

function cleanValueByProperty(
  prop: JsonSchemaProperty,
  value: unknown,
): unknown {
  if (value === undefined) return undefined;
  if (value === null) return undefined;
  if (value === "") return undefined;

  const propType = getPrimaryType(prop);

  if (propType === "object" && prop.properties && isRecord(value)) {
    return sanitizeConfigValues(
      {
        type: "object",
        properties: prop.properties,
        required: nestedRequiredFields(prop),
        additionalProperties: prop.additionalProperties,
      },
      value,
    );
  }

  if (propType === "array" && prop.items && Array.isArray(value)) {
    return value
      .map((item) =>
        cleanValueByProperty(prop.items as JsonSchemaProperty, item),
      )
      .filter((item) => item !== undefined);
  }

  return value;
}

function resolveEffectiveDefault(
  prop: JsonSchemaProperty,
  candidate: unknown,
  fallbackValue: unknown,
): unknown {
  if (candidate === undefined || candidate === null) return undefined;

  if (candidate === "" && (prop.enum || getPrimaryType(prop) !== "string")) {
    return fallbackValue;
  }

  return candidate;
}

function getPropertyDefaultValue(
  prop: JsonSchemaProperty,
  defaultValue: unknown,
  isRequiredField = false,
): unknown {
  const emptyDefaultValue = getEmptyDefaultValue(prop, isRequiredField);
  const fallbackDefaultValue =
    prop.default !== undefined && prop.default !== null
      ? prop.default
      : emptyDefaultValue;
  const resolvedDefaultValue = resolveEffectiveDefault(
    prop,
    defaultValue,
    fallbackDefaultValue,
  );

  if (resolvedDefaultValue !== undefined) {
    return cleanValueByProperty(prop, resolvedDefaultValue);
  }

  const resolvedSchemaDefault = resolveEffectiveDefault(
    prop,
    prop.default,
    emptyDefaultValue,
  );

  if (resolvedSchemaDefault !== undefined) {
    return cleanValueByProperty(prop, resolvedSchemaDefault);
  }

  return cleanValueByProperty(prop, emptyDefaultValue);
}

export function sanitizeConfigValues(
  configSchema?: JsonConfigSchema | null,
  values?: Record<string, unknown> | null,
  options?: {
    visibleFields?: ReadonlySet<string>;
  },
): DynamicConfigValues {
  if (!configSchema?.properties || !values) {
    return {};
  }

  const result: DynamicConfigValues = {};
  const visibleFields =
    options?.visibleFields ?? getVisibleConfigFields(configSchema, values);
  const visibleValues: DynamicConfigValues = {};

  for (const fieldName of visibleFields) {
    if (fieldName in values) {
      visibleValues[fieldName] = values[fieldName];
    }
  }

  const valuesWithConditionalConsts = applyConditionalConstValues(
    configSchema,
    visibleValues,
  );

  for (const [key, prop] of Object.entries(configSchema.properties)) {
    if (!visibleFields.has(key)) {
      continue;
    }

    const candidateValue =
      key in valuesWithConditionalConsts &&
      valuesWithConditionalConsts[key] !== undefined
        ? valuesWithConditionalConsts[key]
        : prop.default;

    if (candidateValue === undefined) {
      continue;
    }

    const value = cleanValueByProperty(prop, candidateValue);

    if (
      getPrimaryType(prop) === "array" &&
      Array.isArray(value) &&
      value.length === 0 &&
      (getConditionalProperty(configSchema, key, valuesWithConditionalConsts)
        ?.minItems ??
        prop.minItems ??
        0) > 0
    ) {
      continue;
    }

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

export function buildDefaultValues(
  configSchema?: JsonConfigSchema | null,
  configDefaults?: Record<string, unknown> | null,
): DefaultValues<DynamicConfigValues> {
  if (!configSchema?.properties) {
    return {};
  }

  const result: DynamicConfigValues = {};

  for (const [key, prop] of Object.entries(configSchema.properties)) {
    result[key] = getPropertyDefaultValue(
      prop,
      configDefaults && key in configDefaults ? configDefaults[key] : undefined,
      isRequired(key, configSchema.required ?? []),
    );
  }

  return result as DefaultValues<DynamicConfigValues>;
}
