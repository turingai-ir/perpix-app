import { z } from "zod";
import type { TFunction } from "i18next";
import type { DefaultValues } from "react-hook-form";

import type {
  DynamicConfigValidationMessages,
  DynamicConfigValues,
  FieldMeta,
  JsonConfigSchema,
  JsonSchemaProperty,
} from "./types";

const DYNAMIC_CONFIG_VALIDATION_KEY = "common.validationErrors.dynamicConfig";

export const EMPTY_CONFIG_SCHEMA: JsonConfigSchema = {
  type: "object",
  required: [],
  properties: {},
  additionalProperties: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isJsonConfigSchema(value: unknown): value is JsonConfigSchema {
  if (
    !isRecord(value) ||
    value.type !== "object" ||
    !isRecord(value.properties)
  ) {
    return false;
  }

  if (
    "required" in value &&
    value.required !== undefined &&
    !Array.isArray(value.required)
  ) {
    return false;
  }

  if (
    "additionalProperties" in value &&
    value.additionalProperties !== undefined &&
    typeof value.additionalProperties !== "boolean"
  ) {
    return false;
  }

  return true;
}

const DEFAULT_VALIDATION_MESSAGES: DynamicConfigValidationMessages = {
  required: "این فیلد الزامی است",
  invalidEnum: "مقدار انتخاب‌شده معتبر نیست",
  invalidString: "مقدار باید متن باشد",
  invalidNumber: "مقدار باید عدد باشد",
  invalidInteger: "مقدار باید عدد صحیح باشد",
  invalidArray: "مقدار باید آرایه باشد",
  minLength: (min) => `حداقل ${min} کاراکتر لازم است`,
  maxLength: (max) => `حداکثر ${max} کاراکتر مجاز است`,
  minNumber: (min) => `حداقل مقدار ${min} است`,
  maxNumber: (max) => `حداکثر مقدار ${max} است`,
  minItems: (min) => `حداقل ${min} آیتم لازم است`,
  maxItems: (max) => `حداکثر ${max} آیتم مجاز است`,
};

export function createValidationMessages(
  t: TFunction,
): DynamicConfigValidationMessages {
  return {
    required: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.required`),
    invalidEnum: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidEnum`),
    invalidString: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidString`),
    invalidNumber: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidNumber`),
    invalidInteger: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidInteger`),
    invalidArray: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidArray`),
    minLength: (min) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minLength`, { min }),
    maxLength: (max) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxLength`, { max }),
    minNumber: (min) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minNumber`, { min }),
    maxNumber: (max) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxNumber`, { max }),
    minItems: (min) => t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minItems`, { min }),
    maxItems: (max) => t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxItems`, { max }),
  };
}

function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

function toNumber(value: unknown) {
  const normalizedValue = emptyToUndefined(value);

  if (typeof normalizedValue !== "string") {
    return normalizedValue;
  }

  const trimmedValue = normalizedValue.trim();

  if (!trimmedValue) return undefined;

  const numericValue = Number(trimmedValue);

  return Number.isNaN(numericValue) ? value : numericValue;
}

function toBoolean(value: unknown) {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

function toArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];

  if (typeof value !== "string") {
    return value;
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isRequired(
  prop: JsonSchemaProperty,
  fieldName: string,
  requiredFields: readonly string[],
) {
  return prop.required === true || requiredFields.includes(fieldName);
}

function nestedRequiredFields(prop: JsonSchemaProperty): readonly string[] {
  return Array.isArray(prop.required) ? prop.required : [];
}

function buildBaseZodField(
  prop: JsonSchemaProperty,
  messages: DynamicConfigValidationMessages,
): z.ZodTypeAny {
  if (prop.enum && prop.enum.length > 0) {
    return z.enum(prop.enum as [string, ...string[]], {
      message: messages.invalidEnum,
    });
  }

  switch (prop.type) {
    case "string": {
      let schema = z.string(messages.invalidString);

      if (prop.minLength !== undefined) {
        schema = schema.min(prop.minLength, messages.minLength(prop.minLength));
      }

      if (prop.maxLength !== undefined) {
        schema = schema.max(prop.maxLength, messages.maxLength(prop.maxLength));
      }

      return schema;
    }

    case "integer": {
      let schema = z
        .number(messages.invalidNumber)
        .int(messages.invalidInteger);

      if (prop.minimum !== undefined) {
        schema = schema.min(prop.minimum, messages.minNumber(prop.minimum));
      }

      if (prop.maximum !== undefined) {
        schema = schema.max(prop.maximum, messages.maxNumber(prop.maximum));
      }

      return z.preprocess(toNumber, schema);
    }

    case "number": {
      let schema = z.number(messages.invalidNumber);

      if (prop.minimum !== undefined) {
        schema = schema.min(prop.minimum, messages.minNumber(prop.minimum));
      }

      if (prop.maximum !== undefined) {
        schema = schema.max(prop.maximum, messages.maxNumber(prop.maximum));
      }

      return z.preprocess(toNumber, schema);
    }

    case "boolean":
      return z.preprocess(toBoolean, z.boolean());

    case "array": {
      const itemSchema = prop.items
        ? buildBaseZodField(prop.items, messages)
        : z.any();

      let schema = z.array(itemSchema, messages.invalidArray);

      if (prop.minItems !== undefined) {
        schema = schema.min(prop.minItems, messages.minItems(prop.minItems));
      }

      if (prop.maxItems !== undefined) {
        schema = schema.max(prop.maxItems, messages.maxItems(prop.maxItems));
      }

      return z.preprocess(toArray, schema);
    }

    case "object": {
      if (!prop.properties) {
        return z.record(z.string(), z.any());
      }

      return buildObjectZodSchema(
        {
          type: "object",
          properties: prop.properties,
          required: nestedRequiredFields(prop),
          additionalProperties: prop.additionalProperties,
        },
        messages,
      );
    }

    default:
      return z.any();
  }
}

function makeFieldRequired(
  schema: z.ZodTypeAny,
  messages: DynamicConfigValidationMessages,
): z.ZodTypeAny {
  const hasRequiredValue = z
    .custom((value) => value !== undefined, {
      message: messages.required,
    })
    .pipe(schema);

  return z.preprocess(emptyToUndefined, hasRequiredValue);
}

function makeFieldOptional(schema: z.ZodTypeAny): z.ZodTypeAny {
  return z.preprocess(emptyToUndefined, schema.optional());
}

function buildZodField(
  prop: JsonSchemaProperty,
  options: { required: boolean; messages: DynamicConfigValidationMessages },
): z.ZodTypeAny {
  const baseSchema = buildBaseZodField(prop, options.messages);

  if (options.required) {
    return makeFieldRequired(baseSchema, options.messages);
  }

  return makeFieldOptional(baseSchema);
}

export function buildObjectZodSchema(
  configSchema: JsonConfigSchema,
  messages: DynamicConfigValidationMessages = DEFAULT_VALIDATION_MESSAGES,
) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const requiredFields = configSchema.required ?? [];

  for (const [key, prop] of Object.entries(configSchema.properties ?? {})) {
    shape[key] = buildZodField(prop, {
      required: isRequired(prop, key, requiredFields),
      messages,
    });
  }

  let schema = z.object(shape);

  if (configSchema.additionalProperties === false) {
    schema = schema.strict();
  }

  return schema;
}

function getEmptyDefaultValue(prop: JsonSchemaProperty): unknown {
  if (prop.enum && prop.enum.length > 0) {
    return prop.default ?? prop.enum[0];
  }

  switch (prop.type) {
    case "string":
      return "";

    case "integer":
    case "number":
      return undefined;

    case "boolean":
      return false;

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

  if (prop.type === "object" && prop.properties && isRecord(value)) {
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

  if (prop.type === "array" && prop.items && Array.isArray(value)) {
    return value
      .map((item) =>
        cleanValueByProperty(prop.items as JsonSchemaProperty, item),
      )
      .filter((item) => item !== undefined);
  }

  return value;
}

function getPropertyDefaultValue(
  prop: JsonSchemaProperty,
  defaultValue: unknown,
): unknown {
  if (defaultValue !== undefined) {
    return cleanValueByProperty(prop, defaultValue);
  }

  return cleanValueByProperty(prop, prop.default ?? getEmptyDefaultValue(prop));
}

export function sanitizeConfigValues(
  configSchema?: JsonConfigSchema | null,
  values?: Record<string, unknown> | null,
): DynamicConfigValues {
  if (!configSchema?.properties || !values) {
    return {};
  }

  const result: DynamicConfigValues = {};

  for (const [key, prop] of Object.entries(configSchema.properties)) {
    if (!(key in values)) continue;

    const value = cleanValueByProperty(prop, values[key]);

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
    );
  }

  return result as DefaultValues<DynamicConfigValues>;
}

function resolveInputType(prop: JsonSchemaProperty): FieldMeta["inputType"] {
  if (prop.enum && prop.enum.length > 0) return "select";
  if (prop.type === "string")
    return (prop.maxLength ?? 0) > 200 ? "textarea" : "text";
  if (prop.type === "integer" || prop.type === "number") return "number";
  if (prop.type === "boolean") return "checkbox";
  if (prop.type === "array") return "array";
  if (prop.type === "object") return "object";
  return "unknown";
}

export function buildFieldMeta(params: {
  name: string;
  prop: JsonSchemaProperty;
  requiredFields: readonly string[];
  defaultValues: Record<string, unknown>;
}): FieldMeta {
  const { name, prop, requiredFields, defaultValues } = params;

  return {
    name,
    property: prop,
    required: isRequired(prop, name, requiredFields),
    defaultValue: defaultValues[name],
    inputType: resolveInputType(prop),
    options: prop.enum,
    description: prop.description,
    title: prop.title,
  };
}

export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map(stripUndefinedDeep)
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      const cleaned = stripUndefinedDeep(val);

      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }

    return result as T;
  }

  return value;
}
