import Ajv2020 from "ajv/dist/2020";
import type { ErrorObject, ValidateFunction } from "ajv";
import type { TFunction } from "i18next";
import type { DefaultValues, FieldError, Resolver } from "react-hook-form";
import { toNestErrors } from "@hookform/resolvers";

import type {
  DynamicConfigValidationMessages,
  DynamicConfigValues,
  FieldMeta,
  JsonConfigMeta,
  JsonConfigUiVisibilityRule,
  JsonConfigSchema,
  JsonSchemaProperty,
} from "./types";

const DYNAMIC_CONFIG_VALIDATION_KEY = "common.validationErrors.dynamicConfig";
const ajv = new Ajv2020({
  allErrors: true,
  coerceTypes: true,
  strict: false,
  validateSchema: false,
});
const validateByCacheKey = new Map<
  string,
  { schema: JsonConfigSchema; validate: ValidateFunction }
>();
const validateBySchema = new WeakMap<JsonConfigSchema, ValidateFunction>();

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
  return (
    prop["x-required"] === true ||
    prop.required === true ||
    requiredFields.includes(fieldName)
  );
}

function nestedRequiredFields(prop: JsonSchemaProperty): readonly string[] {
  return Array.isArray(prop.required) ? prop.required : [];
}

function getPrimaryType(prop: JsonSchemaProperty) {
  if (!Array.isArray(prop.type)) return prop.type;

  return prop.type.find((type) => type !== "null") ?? prop.type[0];
}

function isEmptyDynamicValue(value: unknown) {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;

  return false;
}

function hasDynamicValue(values: Record<string, unknown>, fieldName: string) {
  return fieldName in values && !isEmptyDynamicValue(values[fieldName]);
}

function propertyMatchesValue(
  prop: JsonSchemaProperty,
  value: unknown,
): boolean {
  if ("const" in prop && !Object.is(value, prop.const)) return false;

  if (
    prop.not &&
    conditionMatches({ properties: { value: prop.not } }, { value })
  ) {
    return false;
  }

  const propType = getPrimaryType(prop);

  if (propType === "array") {
    if (!Array.isArray(value)) return false;
    if (prop.minItems !== undefined && value.length < prop.minItems) {
      return false;
    }
    if (prop.maxItems !== undefined && value.length > prop.maxItems) {
      return false;
    }
  }

  if (propType === "string" && typeof value !== "string") return false;
  if (propType === "boolean" && typeof value !== "boolean") return false;
  if (
    (propType === "number" || propType === "integer") &&
    typeof value !== "number"
  ) {
    return false;
  }

  return true;
}

function conditionMatches(
  condition: unknown,
  values: Record<string, unknown>,
): boolean {
  if (!isRecord(condition)) return false;

  if (Array.isArray(condition.required)) {
    const hasRequiredFields = condition.required.every(
      (fieldName) =>
        typeof fieldName === "string" && hasDynamicValue(values, fieldName),
    );

    if (!hasRequiredFields) return false;
  }

  if (isRecord(condition.properties)) {
    for (const [fieldName, prop] of Object.entries(condition.properties)) {
      if (!isRecord(prop)) return false;

      if (!propertyMatchesValue(prop, values[fieldName])) {
        return false;
      }
    }
  }

  if (Array.isArray(condition.anyOf)) {
    return condition.anyOf.some((item) => conditionMatches(item, values));
  }

  if (Array.isArray(condition.allOf)) {
    return condition.allOf.every((item) => conditionMatches(item, values));
  }

  if (Array.isArray(condition.oneOf)) {
    return (
      condition.oneOf.filter((item) => conditionMatches(item, values))
        .length === 1
    );
  }

  if ("not" in condition) {
    return !conditionMatches(condition.not, values);
  }

  return true;
}

function collectNotRequiredFields(schema: unknown): string[] {
  if (!isRecord(schema)) return [];

  const requiredFields = Array.isArray(schema.required)
    ? schema.required.filter((fieldName): fieldName is string => {
        return typeof fieldName === "string";
      })
    : [];

  const anyOfRequiredFields = Array.isArray(schema.anyOf)
    ? schema.anyOf.flatMap(collectNotRequiredFields)
    : [];

  const allOfRequiredFields = Array.isArray(schema.allOf)
    ? schema.allOf.flatMap(collectNotRequiredFields)
    : [];

  const oneOfRequiredFields = Array.isArray(schema.oneOf)
    ? schema.oneOf.flatMap(collectNotRequiredFields)
    : [];

  return [
    ...requiredFields,
    ...anyOfRequiredFields,
    ...allOfRequiredFields,
    ...oneOfRequiredFields,
  ];
}

function getSchemaFieldNames(configSchema?: JsonConfigSchema | null) {
  return new Set(Object.keys(configSchema?.properties ?? {}));
}

function getSchemaHiddenFields(
  configSchema: JsonConfigSchema,
  values: Record<string, unknown>,
) {
  const hiddenFields = new Set<string>();

  for (const rule of configSchema.allOf ?? []) {
    if (!isRecord(rule) || !conditionMatches(rule.if, values)) continue;

    if (isRecord(rule.then) && "not" in rule.then) {
      for (const fieldName of collectNotRequiredFields(rule.then.not)) {
        hiddenFields.add(fieldName);
      }
    }
  }

  return hiddenFields;
}

function uiVisibilityConditionMatches(
  rule: JsonConfigUiVisibilityRule,
  values: Record<string, unknown>,
) {
  const condition = rule.condition;

  if (!condition) return false;

  const fieldValue = values[condition.field];

  switch (condition.operator) {
    case "empty":
      return isEmptyDynamicValue(fieldValue);

    case "not_empty":
      return !isEmptyDynamicValue(fieldValue);

    case "equals":
      return Object.is(fieldValue, condition.value);

    case "not_equals":
      return !Object.is(fieldValue, condition.value);

    case "in":
      return (condition.values ?? []).some((value) =>
        Object.is(value, fieldValue),
      );

    case "not_in":
      return !(condition.values ?? []).some((value) =>
        Object.is(value, fieldValue),
      );

    default:
      return false;
  }
}

function getUiHiddenFields(
  configSchema: JsonConfigSchema,
  values: Record<string, unknown>,
) {
  const fieldNames = getSchemaFieldNames(configSchema);
  const hiddenFields = new Set<string>();
  const showControlledFields = new Set<string>();

  for (const rule of configSchema["x-ui"]?.visibility ?? []) {
    if (rule.effect !== "SHOW") continue;

    for (const fieldName of rule.fields ?? []) {
      if (fieldNames.has(fieldName)) showControlledFields.add(fieldName);
    }
  }

  for (const fieldName of showControlledFields) {
    hiddenFields.add(fieldName);
  }

  for (const rule of configSchema["x-ui"]?.visibility ?? []) {
    const matches = uiVisibilityConditionMatches(rule, values);

    if (!matches) continue;

    for (const fieldName of rule.fields) {
      if (!fieldNames.has(fieldName)) continue;

      if (rule.effect === "HIDE") {
        hiddenFields.add(fieldName);
      } else {
        hiddenFields.delete(fieldName);
      }
    }
  }

  return hiddenFields;
}

export function getVisibleConfigFields(
  configSchema: JsonConfigSchema,
  values: Record<string, unknown>,
) {
  const visibleFields = getSchemaFieldNames(configSchema);

  for (const fieldName of getUiHiddenFields(configSchema, values)) {
    visibleFields.delete(fieldName);
  }

  for (const fieldName of getSchemaHiddenFields(configSchema, values)) {
    visibleFields.delete(fieldName);
  }

  return visibleFields;
}

function applyConditionalConstValues(
  configSchema: JsonConfigSchema,
  values: DynamicConfigValues,
) {
  const result = { ...values };
  const maxPasses = Math.max(1, configSchema.allOf?.length ?? 0);

  for (let pass = 0; pass < maxPasses; pass += 1) {
    let changed = false;

    for (const rule of configSchema.allOf ?? []) {
      if (!isRecord(rule) || !conditionMatches(rule.if, result)) continue;
      if (!isRecord(rule.then) || !isRecord(rule.then.properties)) continue;

      for (const [fieldName, prop] of Object.entries(rule.then.properties)) {
        if (isRecord(prop) && "const" in prop) {
          if (!Object.is(result[fieldName], prop.const)) {
            result[fieldName] = prop.const;
            changed = true;
          }
        }
      }
    }

    if (!changed) break;
  }

  return result;
}

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
) {
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
  if (cacheKey !== undefined && cacheKey !== null) {
    const normalizedCacheKey = String(cacheKey);
    const cachedValidateEntry = validateByCacheKey.get(normalizedCacheKey);

    if (cachedValidateEntry?.schema === configSchema) {
      return cachedValidateEntry.validate;
    }

    const compiledValidate = ajv.compile(configSchema);
    validateByCacheKey.set(normalizedCacheKey, {
      schema: configSchema,
      validate: compiledValidate,
    });

    return compiledValidate;
  }

  const cachedValidate = validateBySchema.get(configSchema);

  if (cachedValidate) return cachedValidate;

  const compiledValidate = ajv.compile(configSchema);
  validateBySchema.set(configSchema, compiledValidate);

  return compiledValidate;
}

export function buildAjvResolver(
  configSchema: JsonConfigSchema,
  messages: DynamicConfigValidationMessages = DEFAULT_VALIDATION_MESSAGES,
  options?: {
    cacheKey?: string | number | null;
  },
): Resolver<DynamicConfigValues> {
  const validate = getCompiledValidate(configSchema, options?.cacheKey);

  return async (values, _context, options) => {
    const conditionalValues = applyConditionalConstValues(configSchema, values);
    const visibleFields = getVisibleConfigFields(
      configSchema,
      conditionalValues,
    );
    const sanitizedValues = sanitizeConfigValues(
      configSchema,
      conditionalValues,
      {
        visibleFields,
      },
    );
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
        message: getAjvErrorMessage(error, messages),
      };
    }

    return {
      values: {},
      errors: toNestErrors(flatErrors, options),
    };
  };
}

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
  const valuesWithConditionalConsts = applyConditionalConstValues(
    configSchema,
    values,
  );

  for (const [key, prop] of Object.entries(configSchema.properties)) {
    if (!visibleFields.has(key) || !(key in valuesWithConditionalConsts)) {
      continue;
    }

    const value = cleanValueByProperty(prop, valuesWithConditionalConsts[key]);

    if (
      getPrimaryType(prop) === "array" &&
      Array.isArray(value) &&
      value.length === 0 &&
      (prop.minItems ?? 0) > 0
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
      isRequired(prop, key, configSchema.required ?? []),
    );
  }

  return result as DefaultValues<DynamicConfigValues>;
}

function resolveWidgetInputType(
  widget: string | undefined,
): FieldMeta["inputType"] | undefined {
  switch (widget) {
    case "textarea":
    case "text":
    case "select":
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

  const propType = getPrimaryType(prop);

  if (prop.enum && prop.enum.length > 0) return "select";
  if (propType === "string")
    return (prop.maxLength ?? 0) > 200 ? "textarea" : "text";
  if (propType === "integer" || propType === "number") return "number";
  if (propType === "boolean") return "checkbox";
  if (propType === "array") return "array";
  if (propType === "object") return "object";
  return "unknown";
}

function resolveOptionLabels(
  prop: JsonSchemaProperty,
  fieldName: string,
  enumLabels?: Record<string, Record<string, string>>,
  configMeta?: JsonConfigMeta | null,
) {
  return (
    enumLabels?.[fieldName] ??
    prop.label?.options ??
    configMeta?.labels?.[fieldName]
  );
}

export function buildFieldMeta(params: {
  name: string;
  prop: JsonSchemaProperty;
  requiredFields: readonly string[];
  defaultValues: Record<string, unknown>;
  widget?: string;
  enumLabels?: Record<string, Record<string, string>>;
  configMeta?: JsonConfigMeta | null;
}): FieldMeta {
  const {
    name,
    prop,
    requiredFields,
    defaultValues,
    widget,
    enumLabels,
    configMeta,
  } = params;

  return {
    name,
    property: prop,
    required: isRequired(prop, name, requiredFields),
    defaultValue: defaultValues[name],
    inputType: resolveWidgetInputType(widget) ?? resolveInputType(prop),
    options: prop.enum,
    optionLabels: resolveOptionLabels(prop, name, enumLabels, configMeta),
    description: prop.description,
    title: prop.title,
  };
}

export function getOrderedFieldNames(configSchema?: JsonConfigSchema | null) {
  const schemaFields = Object.keys(configSchema?.properties ?? {});
  const schemaFieldSet = new Set(schemaFields);
  const orderedFields =
    configSchema?.["x-ui"]?.order?.filter((fieldName) =>
      schemaFieldSet.has(fieldName),
    ) ?? [];
  const orderedFieldSet = new Set(orderedFields);
  const remainingFields = schemaFields.filter(
    (fieldName) => !orderedFieldSet.has(fieldName),
  );

  return [...orderedFields, ...remainingFields];
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
