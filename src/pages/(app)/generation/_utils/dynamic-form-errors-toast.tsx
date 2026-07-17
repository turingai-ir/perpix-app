import type { FieldError, FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import {
  getPrimaryType,
  type DynamicConfigValues,
  type JsonSchemaProperty,
} from "@/hooks/use-dynamic-config-form";

type DynamicFormProperties = Record<string, JsonSchemaProperty>;

function isFieldError(error: unknown): error is FieldError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as FieldError).message === "string"
  );
}

function getFieldProperty(
  properties: DynamicFormProperties,
  fieldPath: string,
): JsonSchemaProperty | undefined {
  const pathSegments = fieldPath
    .split(".")
    .filter((segment) => Number.isNaN(Number(segment)));

  let currentProperty: JsonSchemaProperty | undefined =
    properties[pathSegments[0]];

  for (const segment of pathSegments.slice(1)) {
    if (!currentProperty) return undefined;

    if (getPrimaryType(currentProperty) === "array") {
      currentProperty = currentProperty.items;
    }

    currentProperty = currentProperty?.properties?.[segment];
  }

  return currentProperty;
}

function getFieldLabel(properties: DynamicFormProperties, fieldPath: string) {
  return getFieldProperty(properties, fieldPath)?.title ?? fieldPath;
}

function collectErrorMessages(
  errors: FieldErrors<DynamicConfigValues>,
  properties: DynamicFormProperties,
  parentPath = "",
): string[] {
  return Object.entries(errors).flatMap(([fieldName, error]) => {
    if (!error) return [];

    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

    if (isFieldError(error)) {
      return [
        `${getFieldLabel(properties, fieldPath)}: ${String(error.message)}`,
      ];
    }

    if (typeof error === "object") {
      return collectErrorMessages(
        error as FieldErrors<DynamicConfigValues>,
        properties,
        fieldPath,
      );
    }

    return [];
  });
}

export function showDynamicFormErrorsToast({
  errors,
  properties,
  title,
}: {
  errors: FieldErrors<DynamicConfigValues>;
  properties: DynamicFormProperties;
  title: string;
}) {
  const messages: string[] = Array.from(
    new Set(collectErrorMessages(errors, properties)),
  );

  if (messages.length === 0) return;

  toast.error(title, {
    description: (
      <ul className="list-inside list-disc space-y-1 text-start">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    ),
  });
}
