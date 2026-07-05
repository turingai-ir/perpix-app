import type { FC } from "react";

import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import type { JsonConfigSchema } from "@/hooks/use-dynamic-config-form/types";

const FRAME_IMAGES_FIELD = "frame_images";
const REFERENCE_IMAGES_FIELD = "reference_images";

interface Props {
  configSchema: JsonConfigSchema | null;
  frameImages: unknown;
  isUploadingImage?: boolean;
  referenceImages: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function schemaRequiresFields(
  schema: unknown,
  fieldNames: readonly string[],
): boolean {
  if (!isRecord(schema)) return false;

  const requiredFields = schema.required;

  if (
    Array.isArray(requiredFields) &&
    fieldNames.every((fieldName) => requiredFields.includes(fieldName))
  ) {
    return true;
  }

  if (Array.isArray(schema.anyOf)) {
    return schema.anyOf.some((item) => schemaRequiresFields(item, fieldNames));
  }

  if (Array.isArray(schema.allOf)) {
    return schema.allOf.some((item) => schemaRequiresFields(item, fieldNames));
  }

  return false;
}

function schemaDisallowsFieldsTogether(
  schema: unknown,
  firstFieldName: string,
  secondFieldName: string,
): boolean {
  if (!isRecord(schema)) return false;

  if (
    "not" in schema &&
    schemaRequiresFields(schema.not, [firstFieldName, secondFieldName])
  ) {
    return true;
  }

  if (Array.isArray(schema.allOf)) {
    return schema.allOf.some((item) =>
      schemaDisallowsFieldsTogether(item, firstFieldName, secondFieldName),
    );
  }

  return false;
}

function schemaDisallowsField(schema: unknown, fieldName: string): boolean {
  if (!isRecord(schema)) return false;

  if ("not" in schema && schemaRequiresFields(schema.not, [fieldName])) {
    return true;
  }

  if (Array.isArray(schema.allOf)) {
    return schema.allOf.some((item) => schemaDisallowsField(item, fieldName));
  }

  return false;
}

function conditionalRuleDisallowsField(
  rule: unknown,
  sourceFieldName: string,
  disallowedFieldName: string,
): boolean {
  if (!isRecord(rule) || !isRecord(rule.then)) return false;

  return (
    schemaRequiresFields(rule.if, [sourceFieldName]) &&
    schemaDisallowsField(rule.then, disallowedFieldName)
  );
}

function supportsExclusiveImageInputs(
  configSchema: JsonConfigSchema | null,
): boolean {
  if (!configSchema) return false;

  const supportsFrameImages = FRAME_IMAGES_FIELD in configSchema.properties;
  const supportsReferenceImages =
    REFERENCE_IMAGES_FIELD in configSchema.properties;

  if (!supportsFrameImages || !supportsReferenceImages) return false;

  if (
    schemaDisallowsFieldsTogether(
      configSchema,
      FRAME_IMAGES_FIELD,
      REFERENCE_IMAGES_FIELD,
    )
  ) {
    return true;
  }

  return (
    (configSchema.allOf ?? []).some((rule) =>
      conditionalRuleDisallowsField(
        rule,
        FRAME_IMAGES_FIELD,
        REFERENCE_IMAGES_FIELD,
      ),
    ) &&
    (configSchema.allOf ?? []).some((rule) =>
      conditionalRuleDisallowsField(
        rule,
        REFERENCE_IMAGES_FIELD,
        FRAME_IMAGES_FIELD,
      ),
    )
  );
}

function hasImageInputValue(value: unknown): boolean {
  return Array.isArray(value) && value.some((item) => typeof item === "string");
}

export const ExclusiveImageInputsHint: FC<Props> = ({
  configSchema,
  frameImages,
  isUploadingImage = false,
  referenceImages,
}) => {
  const { t } = useAppTranslate();

  if (!supportsExclusiveImageInputs(configSchema)) return null;
  if (
    isUploadingImage ||
    hasImageInputValue(frameImages) ||
    hasImageInputValue(referenceImages)
  ) {
    return null;
  }

  return (
    <Muted className="px-1 pt-2">
      {t("pages.generation.video.promptBox.exclusiveImageInputsHint")}
    </Muted>
  );
};
