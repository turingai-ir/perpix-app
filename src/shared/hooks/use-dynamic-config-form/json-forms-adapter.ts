import type Ajv from "ajv";
import {
  evalVisibility,
  isControlElement,
  isLayout,
  toDataPath,
  type UISchemaElement,
} from "@jsonforms/core";

import type { JsonConfigMeta, JsonFormsUiSchemaControl } from "./types";

export type JsonFormsControlEntry = {
  control: JsonFormsUiSchemaControl;
  fieldName: string;
};

const controlEntriesByMeta = new WeakMap<
  JsonConfigMeta,
  readonly JsonFormsControlEntry[]
>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getJsonFormsControlEntries(
  configMeta?: JsonConfigMeta | null,
): readonly JsonFormsControlEntry[] {
  if (!configMeta) return [];

  const cachedEntries = controlEntriesByMeta.get(configMeta);
  if (cachedEntries) return cachedEntries;

  const rootUiSchema = configMeta.uischema;
  if (!rootUiSchema) return [];

  const controls: JsonFormsControlEntry[] = [];
  const visit = (element: UISchemaElement, parentArrayFieldName?: string) => {
    if (isControlElement(element)) {
      const relativeFieldName = toDataPath(element.scope);
      if (!relativeFieldName) return;

      const fieldName = parentArrayFieldName
        ? `${parentArrayFieldName}[].${relativeFieldName}`
        : relativeFieldName;
      const control = element as JsonFormsUiSchemaControl;
      controls.push({ control, fieldName });

      const detail = control.options?.detail;
      if (isRecord(detail) && typeof detail.type === "string") {
        visit(detail as UISchemaElement, fieldName);
      }
      return;
    }

    if (isLayout(element)) {
      element.elements.forEach((child) => visit(child, parentArrayFieldName));
    }
  };

  visit(rootUiSchema);
  controlEntriesByMeta.set(configMeta, controls);
  return controls;
}

export function findJsonFormsControl(
  configMeta: JsonConfigMeta | null | undefined,
  fieldName: string,
) {
  return getJsonFormsControlEntries(configMeta).find(
    (entry) => entry.fieldName === fieldName,
  )?.control;
}

export function getJsonFormsHiddenFields(
  fieldNames: ReadonlySet<string>,
  values: Record<string, unknown>,
  ajv: Ajv,
  configMeta?: JsonConfigMeta | null,
) {
  const hiddenFields = new Set<string>();

  for (const { control, fieldName } of getJsonFormsControlEntries(configMeta)) {
    if (!fieldNames.has(fieldName) || !control.rule) continue;
    if (!evalVisibility(control, values, "", ajv, {})) {
      hiddenFields.add(fieldName);
    }
  }

  return hiddenFields;
}
