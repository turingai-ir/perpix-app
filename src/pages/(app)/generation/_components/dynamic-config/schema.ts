import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import type { DynamicConfigOptions, FieldInputType } from "./types";

export function getPrimaryType(property: JsonSchemaProperty) {
  if (!Array.isArray(property.type)) return property.type;

  return property.type.find((type) => type !== "null") ?? property.type[0];
}

export function resolvePropertyInputType(
  property: JsonSchemaProperty,
  widget?: string,
): FieldInputType {
  const resolvedWidget = widget ?? property["x-widget"];
  if (resolvedWidget === "textarea") return "textarea";
  if (resolvedWidget === "text") return "text";
  if (resolvedWidget === "select") return "select";
  if (resolvedWidget === "number") return "number";
  if (resolvedWidget === "checkbox") return "checkbox";
  if (resolvedWidget === "hidden") return "hidden";
  if (resolvedWidget === "switch") return "switch";
  if (resolvedWidget === "list" || resolvedWidget === "elements-list") {
    return "array";
  }
  if (property["x-file"]?.type === "list") return "file-list";
  if (property["x-file"]) return "file";

  const propertyType = getPrimaryType(property);

  if (property.enum && property.enum.length > 0) return "select";
  if (propertyType === "string") {
    return (property.maxLength ?? 0) > 200 ? "textarea" : "text";
  }
  if (propertyType === "integer" || propertyType === "number") {
    return "number";
  }
  if (propertyType === "boolean") return "checkbox";
  if (propertyType === "array") return "array";
  if (propertyType === "object") return "object";

  return "unknown";
}

export function getDefaultValueForProperty(
  property: JsonSchemaProperty,
  fieldName?: string,
  index = 0,
): unknown {
  if (property.default !== undefined && property.default !== null) {
    return property.default;
  }

  if (fieldName === "id") return `element_${index + 1}`;

  const propertyType = getPrimaryType(property);

  if (property.enum?.length) return undefined;
  if (propertyType === "string") return "";
  if (propertyType === "boolean") return false;
  if (propertyType === "array") return [];
  if (propertyType === "object" && property.properties) {
    return Object.fromEntries(
      Object.entries(property.properties).map(([key, childProperty]) => [
        key,
        getDefaultValueForProperty(childProperty, key, index),
      ]),
    );
  }

  return undefined;
}

export function normalizeArrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function resolveFieldValue(value: unknown, defaultValue: unknown) {
  return value ?? defaultValue;
}

export function coerceSelectValue(
  value: string,
  options?: DynamicConfigOptions,
) {
  const matchingOption = options?.find((option) => String(option) === value);

  return matchingOption ?? value;
}

export function getNestedLabel(
  property: JsonSchemaProperty,
  fieldName: string,
) {
  const fieldNameSegments = fieldName.split(".");

  return (
    property.title ??
    fieldNameSegments[fieldNameSegments.length - 1] ??
    fieldName
  );
}
