// Public API of the dynamic-config form schema, split by responsibility.
export { EMPTY_CONFIG_SCHEMA, isJsonConfigSchema } from "./schema-guards";
export { createValidationMessages } from "./validation-messages";
export {
  getRequiredConfigFields,
  getVisibleConfigFields,
  getConditionalProperty,
} from "./field-visibility";
export { buildAjvResolver } from "./ajv-resolver";
export { sanitizeConfigValues, buildDefaultValues } from "./config-defaults";
export { buildFieldMeta, getOrderedFieldNames } from "./field-meta";
export { stripUndefinedDeep } from "./value-coercion";
