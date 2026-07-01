import { useCallback, useEffect, useState, type FC } from "react";
import { toast } from "sonner";

import { MediaUploadStrip } from "@/components/custom/media-upload-strip";
import {
  FileManagerUploadStatus,
  useFileManager,
} from "@/feature/file-manager";
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

const normalizeImageFrames = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (imageId): imageId is string =>
      typeof imageId === "string" && imageId.length > 0,
  );
};

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
  const selectedImages = normalizeImageFrames(dynamicForm.watch(fieldName, []));

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
  const hasReachedImagesFrameMax =
    imagesFrameMaxItems !== undefined &&
    selectedImageSlotsCount >= imagesFrameMaxItems;

  useEffect(() => {
    onFieldUploadingChange?.(fieldName, isUploadingImage);
  }, [fieldName, isUploadingImage, onFieldUploadingChange]);

  const handleImageDelete = (imageId: string) => {
    if (disabled) return;

    dynamicForm.setValue(
      fieldName,
      selectedImages.filter((id) => id !== imageId),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleLocalImageDelete = (fileName: string) => {
    if (disabled) return;

    removePendingUpload(fileName);
  };

  const handleImageSelect = async (file: File) => {
    if (disabled || !shouldShowImageUploader || hasReachedImagesFrameMax) {
      return;
    }

    try {
      const uploadedImageId = await requestUpload(file);

      if (uploadedImageId) {
        const nextSelectedImages = normalizeImageFrames(
          dynamicForm.getValues(fieldName),
        );

        if (
          imagesFrameMaxItems !== undefined &&
          nextSelectedImages.length >= imagesFrameMaxItems
        ) {
          return;
        }

        dynamicForm.setValue(
          fieldName,
          [...nextSelectedImages, uploadedImageId],
          { shouldDirty: true, shouldValidate: true },
        );

        for (const incompatibleField of INCOMPATIBLE_IMAGE_FIELDS[fieldName]) {
          dynamicForm.setValue(incompatibleField, [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
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
