import { useEffect } from "react";
import {
  DynamicConfigFileField,
  type DynamicConfigForm,
} from "@/pages/(app)/generation/_components/dynamic-config";
import { clearTopLevelMediaConflicts } from "@/pages/(app)/generation/_components/dynamic-config/file-upload/media";
import { normalizeMediaIds } from "@/feature/media-uploader";
import { useAppTranslate } from "@/hooks";

const TEXT_MODE = "text_to_image";
const IMAGE_MODE = "image_to_image";
const REFERENCE_FIELD = "reference_images";
const MAX_REFERENCE_IMAGES = 5;

export function ImageReferenceInput({
  dynamicForm,
  disabled,
  onUploadingChange,
}: {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const { t } = useAppTranslate();
  const modeMeta = dynamicForm.getFieldMeta("mode");
  const modeOptions = modeMeta?.options ?? [];
  const supportsAutomaticMode =
    modeOptions.includes(TEXT_MODE) && modeOptions.includes(IMAGE_MODE);
  const property = dynamicForm.properties[REFERENCE_FIELD];
  const references = normalizeMediaIds(dynamicForm.watch(REFERENCE_FIELD));
  const hasReference = references.length > 0;

  useEffect(() => {
    if (!supportsAutomaticMode) return;
    const nextMode = hasReference ? IMAGE_MODE : TEXT_MODE;
    if (dynamicForm.getValues("mode") === nextMode) return;
    dynamicForm.setValue("mode", nextMode, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [dynamicForm, hasReference, supportsAutomaticMode]);

  if (!property || !supportsAutomaticMode) return null;

  return (
    <div
      className={
        hasReference
          ? "order-2 w-full min-w-0"
          : "flex shrink-0 items-start pt-1"
      }
      data-generation-mode={String(dynamicForm.watch("mode") ?? "")}
    >
      <DynamicConfigFileField
        dynamicForm={dynamicForm}
        fieldName={REFERENCE_FIELD}
        label={t("pages.generation.image.studio.reference.uploadLabel")}
        property={property}
        disabled={disabled}
        maxItemsOverride={MAX_REFERENCE_IMAGES}
        requestId="image_generation"
        presentation="composer"
        pasteFromParentForm
        onUploadingChange={onUploadingChange}
        onValueChange={() =>
          clearTopLevelMediaConflicts(dynamicForm, REFERENCE_FIELD)
        }
      />
      <span className="sr-only" aria-live="polite">
        {t(
          hasReference
            ? "pages.generation.image.studio.reference.imageMode"
            : "pages.generation.image.studio.reference.textMode",
        )}
      </span>
    </div>
  );
}
