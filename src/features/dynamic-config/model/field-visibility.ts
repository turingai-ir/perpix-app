import Ajv2020 from "ajv/dist/2020.js";
import { getJsonFormsHiddenFields } from "./json-forms-adapter";
import {
  type DynamicConfigValues,
  type JsonConfigMeta,
  type JsonConfigSchema,
  type JsonSchemaProperty,
} from "./form-types";
import { isRecord } from "./schema-guards";

const visibilityAjv = new Ajv2020({
  allErrors: true,
  coerceTypes: true,
  strict: false,
  validateSchema: false,
});

export function isRequired(
  fieldName: string,
  requiredFields: readonly string[],
) {
  return requiredFields.includes(fieldName);
}

export function nestedRequiredFields(
  prop: JsonSchemaProperty,
): readonly string[] {
  return Array.isArray(prop.required) ? prop.required : [];
}

function conditionMatches(
  condition: unknown,
  values: Record<string, unknown>,
): boolean {
  if (!isRecord(condition)) return false;
  return visibilityAjv.validate(condition, values) as boolean;
}

export function getRequiredConfigFields(
  schema: unknown,
  values: Record<string, unknown>,
): Set<string> {
  const required = new Set<string>();
  if (!isRecord(schema)) return required;
  for (const name of Array.isArray(schema.required) ? schema.required : []) {
    if (typeof name === "string") required.add(name);
  }
  const branches = Array.isArray(schema.allOf) ? [...schema.allOf] : [];
  if (isRecord(schema.if)) {
    branches.push(
      conditionMatches(schema.if, values) ? schema.then : schema.else,
    );
  }
  for (const branch of branches) {
    for (const name of getRequiredConfigFields(branch, values))
      required.add(name);
  }
  // Alternatives do not make every input mandatory: only their common requirements do.
  for (const alternatives of [schema.oneOf, schema.anyOf]) {
    if (!Array.isArray(alternatives) || !alternatives.length) continue;
    const sets = alternatives.map((branch) =>
      getRequiredConfigFields(branch, values),
    );
    for (const name of sets[0]) {
      if (sets.every((fields) => fields.has(name))) required.add(name);
    }
  }
  return required;
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

  const visit = (schema: unknown, conditional = false) => {
    if (!isRecord(schema)) return;

    if (conditional && "not" in schema) {
      for (const fieldName of collectNotRequiredFields(schema.not)) {
        hiddenFields.add(fieldName);
      }
    }

    for (const rule of Array.isArray(schema.allOf) ? schema.allOf : []) {
      if (!isRecord(rule)) continue;
      if (isRecord(rule.if)) {
        visit(conditionMatches(rule.if, values) ? rule.then : rule.else, true);
      } else {
        visit(rule);
      }
    }
  };

  visit(configSchema);

  return hiddenFields;
}

export function getVisibleConfigFields(
  configSchema: JsonConfigSchema,
  values: Record<string, unknown>,
  configMeta?: JsonConfigMeta | null,
) {
  const visibleFields = getSchemaFieldNames(configSchema);

  const uiHiddenFields = getJsonFormsHiddenFields(
    visibleFields,
    values,
    visibilityAjv,
    configMeta,
  );
  for (const fieldName of uiHiddenFields) {
    visibleFields.delete(fieldName);
  }

  for (const fieldName of getSchemaHiddenFields(configSchema, values)) {
    visibleFields.delete(fieldName);
  }

  return visibleFields;
}

export function applyConditionalConstValues(
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

export function getConditionalProperty(
  configSchema: JsonConfigSchema,
  fieldName: string,
  values: Record<string, unknown>,
): JsonSchemaProperty | undefined {
  const property = configSchema.properties[fieldName];

  if (!property) return undefined;

  return applyConditionalPropertyConstraints(
    configSchema,
    fieldName,
    values,
    property,
  );
}

function applyConditionalPropertyConstraints(
  schema: Record<string, unknown>,
  fieldName: string,
  values: Record<string, unknown>,
  property: JsonSchemaProperty,
): JsonSchemaProperty {
  let resolvedProperty = property;
  const rules = Array.isArray(schema.allOf) ? schema.allOf : [];

  for (const rule of rules) {
    if (!isRecord(rule) || !conditionMatches(rule.if, values)) continue;
    if (!isRecord(rule.then)) continue;

    const conditionalProperties = isRecord(rule.then.properties)
      ? rule.then.properties
      : undefined;
    const conditionalProperty = conditionalProperties?.[fieldName];

    if (isRecord(conditionalProperty)) {
      resolvedProperty = { ...resolvedProperty, ...conditionalProperty };
    }

    resolvedProperty = applyConditionalPropertyConstraints(
      rule.then,
      fieldName,
      values,
      resolvedProperty,
    );
  }

  return resolvedProperty;
}
