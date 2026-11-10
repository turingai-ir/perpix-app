import { type JsonConfigSchema } from "./form-types";

export const EMPTY_CONFIG_SCHEMA: JsonConfigSchema = {
  type: "object",
  required: [],
  properties: {},
  additionalProperties: false,
};

export function isRecord(value: unknown): value is Record<string, unknown> {
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
