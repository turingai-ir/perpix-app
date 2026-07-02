import { useEffect, type FC } from "react";
import { toast } from "sonner";

import { useFileManager } from "@/feature/file-manager";
import {
  appendMediaId,
  hasReachedMediaMaxItems,
  hasUploadingLocalItem,
  MediaUploadStrip,
  normalizeMediaIds,
  removeMediaId,
  toLocalMediaItems,
  toUploadedMediaItems,
} from "@/feature/media-uploader";
import { useAppTranslate } from "@/hook";
import type { useDynamicConfigForm } from "@/hooks/use-dynamic-config-form";
import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";
import { HttpStatus } from "@/utils";

const REQUEST_ID = "image_generation";
const REFERENCE_IMAGES_FIELD = "reference_images";

type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;

interface Props {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}

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
  const selectedImages = normalizeMediaIds(
    dynamicForm.watch(REFERENCE_IMAGES_FIELD, []),
  );

  const localImageItems = toLocalMediaItems(pendingUploads.values());
  const uploadedImageItems = toUploadedMediaItems(selectedImages);
  const isUploadingImage =
    shouldShowImageUploader && hasUploadingLocalItem(localImageItems);
  const hasReachedImagesReferenceMax = hasReachedMediaMaxItems(
    selectedImages,
    localImageItems,
    imagesReferenceMaxItems,
  );

  useEffect(() => {
    onUploadingChange?.(isUploadingImage);
  }, [isUploadingImage, onUploadingChange]);

  const handleImageDelete = (imageId: string) => {
    if (disabled) return;

    dynamicForm.setValue(
      REFERENCE_IMAGES_FIELD,
      removeMediaId(selectedImages, imageId),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleLocalImageDelete = (fileName: string) => {
    if (disabled) return;

    removePendingUpload(fileName);
  };

  const handleUploadedImageSelect = (imageId: string) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesReferenceMax) {
      return;
    }

    const nextSelectedImages = normalizeMediaIds(
      dynamicForm.getValues(REFERENCE_IMAGES_FIELD),
    );
    const selectedWithNewImage = appendMediaId(
      nextSelectedImages,
      imageId,
      imagesReferenceMaxItems,
    );

    if (!selectedWithNewImage) return;

    dynamicForm.setValue(REFERENCE_IMAGES_FIELD, selectedWithNewImage, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleImageSelect = async (file: File) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesReferenceMax) {
      return;
    }

    try {
      const uploadedImageId = await requestUpload(file);

      if (uploadedImageId) {
        const nextSelectedImages = normalizeMediaIds(
          dynamicForm.getValues(REFERENCE_IMAGES_FIELD),
        );
        const selectedWithUploadedImage = appendMediaId(
          nextSelectedImages,
          uploadedImageId,
          imagesReferenceMaxItems,
        );

        if (!selectedWithUploadedImage) return;

        dynamicForm.setValue(
          REFERENCE_IMAGES_FIELD,
          selectedWithUploadedImage,
          { shouldDirty: true, shouldValidate: true },
        );

        return uploadedImageId;
      }
    } catch (error) {
      if (
        error instanceof FetchHttpError &&
        error.response.status === HttpStatus.BAD_REQUEST
      ) {
        const errorMessage =
          error instanceof Error ? error.message : String(error || "");

        toast.error(errorMessage || t("common.errorOnUploading"));
      }
    }
  };

  if (!shouldShowImageUploader) {
    return null;
  }

  return (
    <MediaUploadStrip
      uploadedItems={uploadedImageItems}
      localItems={localImageItems}
      disabled={disabled}
      onDeleteClick={handleImageDelete}
      onLocalDeleteClick={handleLocalImageDelete}
      onFileSelect={handleImageSelect}
      onUploadedFileSelect={handleUploadedImageSelect}
      showPlaceholder={!hasReachedImagesReferenceMax}
      label={t("common.addImage")}
      accept="image/jpeg, image/png"
    />
  );
};
