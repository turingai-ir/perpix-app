import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

import type { DynamicConfigForm } from "../types";

export type MediaPreviewType = "audio" | "image" | "video";

export const DEFAULT_FILE_ACCEPT = ["image/jpeg", "image/png"] as const;

export function normalizeFileIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );
  }

  return typeof value === "string" && value.length > 0 ? [value] : [];
}

export function getAcceptList(property?: JsonSchemaProperty) {
  return property?.["x-file"]?.accept?.length
    ? [...property["x-file"].accept]
    : [...DEFAULT_FILE_ACCEPT];
}

export function getPreviewType(
  acceptList: readonly string[],
): MediaPreviewType {
  if (acceptList.some((accept) => accept.startsWith("video/"))) {
    return "video";
  }

  if (acceptList.some((accept) => accept.startsWith("audio/"))) {
    return "audio";
  }

  return "image";
}

export function isListFileField(property?: JsonSchemaProperty) {
  return property?.["x-file"]?.type === "list";
}

export function clearTopLevelMediaConflicts(
  dynamicForm: DynamicConfigForm,
  fieldName: string,
) {
  if (fieldName === "frame_images") {
    dynamicForm.setValue("reference_images", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
    dynamicForm.setValue("reference_videos", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
    return;
  }

  if (fieldName === "reference_images" || fieldName === "reference_videos") {
    dynamicForm.setValue("frame_images", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }
}

export function clearElementMediaConflicts(
  dynamicForm: DynamicConfigForm,
  fieldName: string,
) {
  if (fieldName.endsWith(".videos")) {
    const parentPath = fieldName.slice(0, -".videos".length);

    setDynamicValue(dynamicForm, `${parentPath}.images`, []);
    setDynamicValue(dynamicForm, `${parentPath}.voices`, []);
    setDynamicValue(dynamicForm, `${parentPath}.frontal_image`, undefined);
    return;
  }

  if (fieldName.endsWith(".images") || fieldName.endsWith(".voices")) {
    const parentPath = fieldName
      .replace(/\.images$/, "")
      .replace(/\.voices$/, "");

    setDynamicValue(dynamicForm, `${parentPath}.videos`, []);
  }
}

function setDynamicValue(
  dynamicForm: DynamicConfigForm,
  fieldName: string,
  value: unknown,
) {
  dynamicForm.setValue(fieldName as never, value as never, {
    shouldDirty: true,
    shouldValidate: true,
  });
}
