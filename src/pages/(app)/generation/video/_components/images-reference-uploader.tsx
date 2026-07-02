import { useCallback, useEffect, useState, type FC } from "react";
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

const REQUEST_ID = "video_generation";
const IMAGE_FIELD_NAMES = ["frame_images", "reference_images"] as const;
const INCOMPATIBLE_IMAGE_FIELDS = {
  frame_images: ["reference_images"],
  reference_images: ["frame_images"],
} as const satisfies Record<
  (typeof IMAGE_FIELD_NAMES)[number],
  readonly (typeof IMAGE_FIELD_NAMES)[number][]
>;

type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;

interface Props {
  dynamicForm: DynamicConfigForm;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}

type ImageUploaderFieldProps = Props & {
  fieldName: (typeof IMAGE_FIELD_NAMES)[number];
  onFieldUploadingChange?: (
    fieldName: (typeof IMAGE_FIELD_NAMES)[number],
    isUploading: boolean,
  ) => void;
};

const ImageReferenceUploaderField: FC<ImageUploaderFieldProps> = ({
  dynamicForm,
  disabled = false,
  fieldName,
  onFieldUploadingChange,
}) => {
  const { t } = useAppTranslate();
  const { requestUpload, removePendingUpload, pendingUploads } = useFileManager(
    `${REQUEST_ID}_${fieldName}`,
  );

  const imageProperty = dynamicForm.properties[fieldName];
  const imagePropertyDefinition =
    typeof imageProperty === "object" && imageProperty !== null
      ? imageProperty
      : undefined;
  const fieldLabel = t(`common.dynamicConfig.fields.${fieldName}`, {
    defaultValue: imagePropertyDefinition?.title ?? fieldName,
  });
  const shouldShowImageUploader =
    Boolean(imagePropertyDefinition) && dynamicForm.isFieldVisible(fieldName);
  const imagesFrameMaxItems = imagePropertyDefinition?.maxItems;
  const selectedImages = normalizeMediaIds(dynamicForm.watch(fieldName, []));

  const localImageItems = toLocalMediaItems(pendingUploads.values());
  const uploadedImageItems = toUploadedMediaItems(selectedImages);
  const isUploadingImage =
    shouldShowImageUploader && hasUploadingLocalItem(localImageItems);
  const hasReachedImagesFrameMax = hasReachedMediaMaxItems(
    selectedImages,
    localImageItems,
    imagesFrameMaxItems,
  );

  useEffect(() => {
    onFieldUploadingChange?.(fieldName, isUploadingImage);
  }, [fieldName, isUploadingImage, onFieldUploadingChange]);

  const handleImageDelete = (imageId: string) => {
    if (disabled) return;

    dynamicForm.setValue(fieldName, removeMediaId(selectedImages, imageId), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleLocalImageDelete = (fileName: string) => {
    if (disabled) return;

    removePendingUpload(fileName);
  };

  const selectImage = (imageId: string) => {
    const nextSelectedImages = normalizeMediaIds(
      dynamicForm.getValues(fieldName),
    );
    const selectedWithNewImage = appendMediaId(
      nextSelectedImages,
      imageId,
      imagesFrameMaxItems,
    );

    if (!selectedWithNewImage) return;

    dynamicForm.setValue(fieldName, selectedWithNewImage, {
      shouldDirty: true,
      shouldValidate: true,
    });

    for (const incompatibleField of INCOMPATIBLE_IMAGE_FIELDS[fieldName]) {
      dynamicForm.setValue(incompatibleField, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleUploadedImageSelect = (imageId: string) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesFrameMax) {
      return;
    }

    selectImage(imageId);
  };

  const handleImageSelect = async (file: File) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesFrameMax) {
      return;
    }

    try {
      const uploadedImageId = await requestUpload(file);

      if (uploadedImageId) {
        selectImage(uploadedImageId);

        return uploadedImageId;
      }
    } catch (error) {
      if (
        error instanceof FetchHttpError &&
        error.response.status === HttpStatus.FORBIDDEN
      ) {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error || "");

      toast.error(errorMessage || t("common.errorOnUploading"));
    }
  };

  if (!shouldShowImageUploader) {
    return null;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 py-2">
      <span className="text-muted-foreground text-sm font-normal">
        {fieldLabel}
      </span>
      <MediaUploadStrip
        uploadedItems={uploadedImageItems}
        localItems={localImageItems}
        disabled={disabled}
        onDeleteClick={handleImageDelete}
        onLocalDeleteClick={handleLocalImageDelete}
        onFileSelect={handleImageSelect}
        onUploadedFileSelect={handleUploadedImageSelect}
        showPlaceholder={!hasReachedImagesFrameMax}
        label={t("common.addImage")}
        accept="image/jpeg, image/png"
      />
    </div>
  );
};

export const ImagesReferenceUploader: FC<Props> = ({
  onUploadingChange,
  ...props
}) => {
  const [uploadingByField, setUploadingByField] = useState<
    Partial<Record<(typeof IMAGE_FIELD_NAMES)[number], boolean>>
  >({});

  const handleFieldUploadingChange = useCallback(
    (fieldName: (typeof IMAGE_FIELD_NAMES)[number], isUploading: boolean) => {
      if (uploadingByField[fieldName] === isUploading) {
        return;
      }

      setUploadingByField((prev) => {
        return {
          ...prev,
          [fieldName]: isUploading,
        };
      });
    },
    [uploadingByField],
  );

  useEffect(() => {
    onUploadingChange?.(Object.values(uploadingByField).some(Boolean));
  }, [onUploadingChange, uploadingByField]);

  return (
    <>
      {IMAGE_FIELD_NAMES.map((fieldName) => (
        <ImageReferenceUploaderField
          key={fieldName}
          {...props}
          fieldName={fieldName}
          onFieldUploadingChange={handleFieldUploadingChange}
        />
      ))}
    </>
  );
};
