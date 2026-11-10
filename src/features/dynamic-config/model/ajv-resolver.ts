import Ajv2020 from "ajv/dist/2020.js";
import { type ErrorObject, type ValidateFunction } from "ajv";
import { type FieldError, type Resolver } from "react-hook-form";
import { toNestErrors } from "@hookform/resolvers";
import {
  type DynamicConfigValidationMessages,
  type DynamicConfigValues,
  type JsonConfigMeta,
  type JsonConfigSchema,
  type JsonSchemaProperty,
  getPrimaryType,
} from "./form-types";
import { isRecord } from "./schema-guards";
import { DEFAULT_VALIDATION_MESSAGES } from "./validation-messages";
import { toArray, toBoolean, toNumber } from "./value-coercion";
import {
  getVisibleConfigFields,
  nestedRequiredFields,
} from "./field-visibility";
import { sanitizeConfigValues } from "./config-defaults";
import { resolveUiFieldMeta } from "./field-meta";

const validateByCacheKey = new Map<
  string,
  { schema: JsonConfigSchema; validate: ValidateFunction }
>();

const validateBySchema = new WeakMap<JsonConfigSchema, ValidateFunction>();

function normalizeValueForAjv(
  prop: JsonSchemaProperty,
  value: unknown,
): unknown {
  const propType = getPrimaryType(prop);

  if (value === "" && propType !== "string") return undefined;

  if (propType === "integer" || propType === "number") {
    return toNumber(value);
  }

  if (propType === "boolean") {
    return toBoolean(value);
  }

  if (propType === "array" && typeof value === "string") {
    return toArray(value);
  }

  if (propType === "object" && prop.properties && isRecord(value)) {
    return normalizeValuesForAjv(
      {
        type: "object",
        properties: prop.properties,
        required: nestedRequiredFields(prop),
        additionalProperties: prop.additionalProperties,
      },
      value,
    );
  }

  return value;
}

function normalizeValuesForAjv(
  configSchema: JsonConfigSchema,
  values: Record<string, unknown>,
) {
  const result: DynamicConfigValues = { ...values };

  for (const [key, prop] of Object.entries(configSchema.properties ?? {})) {
    if (!(key in result)) continue;

    result[key] = normalizeValueForAjv(prop, result[key]);
  }

  return result;
}

function decodeJsonPointerSegment(segment: string) {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

function getAjvErrorPath(error: ErrorObject) {
  const pathSegments = error.instancePath
    .split("/")
    .filter(Boolean)
    .map(decodeJsonPointerSegment);

  if (error.keyword === "required") {
    const missingProperty = error.params.missingProperty;

    if (typeof missingProperty === "string") {
      pathSegments.push(missingProperty);
    }
  }

  if (error.keyword === "additionalProperties") {
    const additionalProperty = error.params.additionalProperty;

    if (typeof additionalProperty === "string") {
      pathSegments.push(additionalProperty);
    }
  }

  return pathSegments.join(".") || "root";
}

function getAjvErrorMessage(
  error: ErrorObject,
  messages: DynamicConfigValidationMessages,
  configMeta?: JsonConfigMeta | null,
) {
  const fieldErrorMessages =
    resolveUiFieldMeta(configMeta, getAjvErrorPath(error))?.errors ?? {};
  const metaMessage =
    fieldErrorMessages[error.keyword] ??
    fieldErrorMessages[getAjvErrorType(error)];

  if (metaMessage) return metaMessage;

  switch (error.keyword) {
    case "required":
      return messages.required;

    case "enum":
    case "const":
      return messages.invalidEnum;

    case "minLength":
      return messages.minLength(Number(error.params.limit));

    case "maxLength":
      return messages.maxLength(Number(error.params.limit));

    case "minimum":
    case "exclusiveMinimum":
      return messages.minNumber(Number(error.params.limit));

    case "maximum":
    case "exclusiveMaximum":
      return messages.maxNumber(Number(error.params.limit));

    case "minItems":
      return messages.minItems(Number(error.params.limit));

    case "maxItems":
      return messages.maxItems(Number(error.params.limit));

    case "type": {
      const expectedType = error.params.type;
      const expectedTypes = Array.isArray(expectedType)
        ? expectedType
        : [expectedType];

      if (expectedTypes.includes("array")) return messages.invalidArray;
      if (expectedTypes.includes("integer")) return messages.invalidInteger;
      if (expectedTypes.includes("number")) return messages.invalidNumber;
      if (expectedTypes.includes("string")) return messages.invalidString;

      return error.message ?? messages.required;
    }

    default:
      return error.message ?? messages.required;
  }
}

function getAjvErrorType(error: ErrorObject) {
  if (error.keyword === "exclusiveMinimum") return "minimum";
  if (error.keyword === "exclusiveMaximum") return "maximum";

  return error.keyword;
}

function getCompiledValidate(
  configSchema: JsonConfigSchema,
  cacheKey?: string | number | null,
) {
  const normalizedCacheKey =
    cacheKey === undefined || cacheKey === null ? null : String(cacheKey);

  if (normalizedCacheKey !== null) {
    const cachedValidateEntry = validateByCacheKey.get(normalizedCacheKey);

    if (cachedValidateEntry?.schema === configSchema) {
      return cachedValidateEntry.validate;
    }
  } else {
    const cachedValidate = validateBySchema.get(configSchema);

    if (cachedValidate) return cachedValidate;
  }

  const compiledValidate = new Ajv2020({
    allErrors: true,
    coerceTypes: true,
    strict: false,
    validateSchema: false,
  }).compile(configSchema);

  if (normalizedCacheKey !== null) {
    validateByCacheKey.set(normalizedCacheKey, {
      schema: configSchema,
      validate: compiledValidate,
    });
  } else {
    validateBySchema.set(configSchema, compiledValidate);
  }

  return compiledValidate;
}

export function buildAjvResolver(
  configSchema: JsonConfigSchema,
  messages: DynamicConfigValidationMessages = DEFAULT_VALIDATION_MESSAGES,
  resolverConfig?: {
    cacheKey?: string | number | null;
    configMeta?: JsonConfigMeta | null;
  },
): Resolver<DynamicConfigValues> {
  const validate = getCompiledValidate(configSchema, resolverConfig?.cacheKey);

  return async (values, _context, options) => {
    const visibleFields = getVisibleConfigFields(
      configSchema,
      values,
      resolverConfig?.configMeta,
    );
    const sanitizedValues = sanitizeConfigValues(configSchema, values, {
      visibleFields,
    });
    const normalizedValues = normalizeValuesForAjv(
      configSchema,
      sanitizedValues,
    );
    const isValid = validate(normalizedValues);

    if (isValid) {
      return {
        values: normalizedValues,
        errors: {},
      };
    }

    const flatErrors: Record<string, FieldError> = {};

    for (const error of validate.errors ?? []) {
      if (error.keyword === "if") continue;

      const path = getAjvErrorPath(error);

      if (flatErrors[path]) continue;

      flatErrors[path] = {
        type: getAjvErrorType(error),
        message: getAjvErrorMessage(
          error,
          messages,
          resolverConfig?.configMeta,
        ),
      };
    }

    return {
      values: {},
      errors: toNestErrors(flatErrors, options),
    };
  };
}
