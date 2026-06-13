import { useEffect, type FC } from "react";
import { toast } from "sonner";

import { HorizontalImageUploader } from "@/components/custom/horizontal-image-uploader";
import {
  FileManagerUploadStatus,
  useFileManager,
} from "@/feature/file-manager";
import { useAppTranslate } from "@/hook";
import type { useDynamicConfigForm } from "@/hooks/use-dynamic-config-form";

const REQUEST_ID = "image_generation";
const REFERENCE_IMAGES_FIELD = "reference_images";

type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;

interface Props {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}

const normalizeImageReferences = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (imageId): imageId is string =>
      typeof imageId === "string" && imageId.length > 0,
  );
};

export const ImageReferenceUploader: FC<Props> = ({
  dynamicForm,
  disabled = false,
  onUploadingChange,
}) => {
  const { t } = useAppTranslate();
  const { requestUpload, removePendingUpload, pendingUploads } =
    useFileManager(REQUEST_ID);

  const imagesReferenceProperty =
    dynamicForm.properties[REFERENCE_IMAGES_FIELD];
  const shouldShowImageUploader = Boolean(imagesReferenceProperty);
  const imagesReferenceMaxItems = imagesReferenceProperty?.maxItems;
  const selectedImages = normalizeImageReferences(
    dynamicForm.watch(REFERENCE_IMAGES_FIELD, []),
  );

  const localImageItems = Array.from(pendingUploads.values()).map((upload) => ({
    file: upload.file,
    status: upload.status,
  }));
  const uploadedImageItems = selectedImages.map((imageId) => ({
    id: imageId,
  }));
  const isUploadingImage =
    shouldShowImageUploader &&
    localImageItems.some(
      ({ status }) => status === FileManagerUploadStatus.UPLOADING,
    );
  const selectedImageSlotsCount =
    selectedImages.length + localImageItems.length;
  const hasReachedImagesReferenceMax =
    imagesReferenceMaxItems !== undefined &&
    selectedImageSlotsCount >= imagesReferenceMaxItems;

  useEffect(() => {
    onUploadingChange?.(isUploadingImage);
  }, [isUploadingImage, onUploadingChange]);

  const handleImageDelete = (imageId: string) => {
    if (disabled) return;

    dynamicForm.setValue(
      REFERENCE_IMAGES_FIELD,
      selectedImages.filter((id) => id !== imageId),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleLocalImageDelete = (fileName: string) => {
    if (disabled) return;

    removePendingUpload(fileName);
  };

  const handleImageSelect = async (file: File) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesReferenceMax) {
      return;
    }

    try {
      const uploadedImageId = await requestUpload(file);

      if (uploadedImageId) {
        const nextSelectedImages = normalizeImageReferences(
          dynamicForm.getValues(REFERENCE_IMAGES_FIELD),
        );

        if (
          imagesReferenceMaxItems !== undefined &&
          nextSelectedImages.length >= imagesReferenceMaxItems
        ) {
          return;
        }

        dynamicForm.setValue(
          REFERENCE_IMAGES_FIELD,
          [...nextSelectedImages, uploadedImageId],
          { shouldDirty: true, shouldValidate: true },
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error || "");

      toast.error(errorMessage || t("common.errorOnUploading"));
    }
  };

  if (!shouldShowImageUploader) {
    return null;
  }

  return (
    <HorizontalImageUploader
      uploadedImages={uploadedImageItems}
      localImages={localImageItems}
      disabled={disabled}
      onDeleteClick={handleImageDelete}
      onLocalDeleteClick={handleLocalImageDelete}
      onFileSelect={handleImageSelect}
      showPlaceholder={!hasReachedImagesReferenceMax}
      label={t("common.addImage")}
      accept="image/jpeg, image/png"
    />
  );
};
