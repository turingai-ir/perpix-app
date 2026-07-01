import { useEffect, useMemo, type FC } from "react";
import { toast } from "sonner";

import { MediaUploadStrip } from "@/components/custom/media-upload-strip";
import {
  FileManagerUploadStatus,
  useFileManager,
} from "@/feature/file-manager";
import { useAppTranslate } from "@/hook";
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { HttpStatus } from "@/utils";
import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";

import {
  getAcceptList,
  getPreviewType,
  isListFileField,
  normalizeFileIds,
  type MediaPreviewType,
} from "./media";
import type { DynamicConfigForm } from "../types";

export const DynamicConfigFileField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  label: string;
  onValueChange?: (value: string | string[] | undefined) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  property?: JsonSchemaProperty;
  requestId?: string;
}> = ({
  disabled = false,
  dynamicForm,
  fieldName,
  label,
  onValueChange,
  onUploadingChange,
  property,
  requestId = "dynamic_config",
}) => {
  const { t } = useAppTranslate();
  const acceptList = useMemo(() => getAcceptList(property), [property]);
  const previewType = getPreviewType(acceptList);
  const isList = isListFileField(property);
  const maxItems = isList ? property?.maxItems : 1;
  const { pendingUploads, removePendingUpload, requestUpload } = useFileManager(
    `${requestId}_${fieldName.replace(/\./g, "_")}`,
    {
      allowedFileTypes: [...acceptList],
    },
  );

  const selectedFileIds = normalizeFileIds(dynamicForm.watch(fieldName));
  const localItems = Array.from(pendingUploads.values()).map((upload) => ({
    file: upload.file,
    status: upload.status,
  }));
  const isUploading = localItems.some(
    ({ status }) => status === FileManagerUploadStatus.UPLOADING,
  );
  const selectedSlotsCount = selectedFileIds.length + localItems.length;
  const hasReachedMaxItems =
    maxItems !== undefined && selectedSlotsCount >= maxItems;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const setFileValue = (value: string | string[] | undefined) => {
    dynamicForm.setValue(fieldName, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    onValueChange?.(value);
  };

  const handleDelete = (fileId: string) => {
    if (disabled) return;

    if (!isList) {
      setFileValue(undefined);
      return;
    }

    setFileValue(selectedFileIds.filter((id) => id !== fileId));
  };

  const handleLocalDelete = (fileName: string) => {
    if (!disabled) removePendingUpload(fileName);
  };

  const handleFileSelect = async (file: File) => {
    if (disabled || hasReachedMaxItems) return;

    try {
      const uploadedFileId = await requestUpload(file);

      if (!uploadedFileId) return;

      if (!isList) {
        setFileValue(uploadedFileId);
        return;
      }

      const nextSelectedFileIds = normalizeFileIds(
        dynamicForm.getValues(fieldName),
      );

      if (maxItems !== undefined && nextSelectedFileIds.length >= maxItems) {
        return;
      }

      setFileValue([...nextSelectedFileIds, uploadedFileId]);
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

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 py-2">
      <span className="text-muted-foreground text-sm font-normal">{label}</span>
      <MediaUploadStrip
        uploadedItems={selectedFileIds.map((id) => ({ id }))}
        localItems={localItems}
        disabled={disabled}
        onDeleteClick={handleDelete}
        onLocalDeleteClick={handleLocalDelete}
        onFileSelect={handleFileSelect}
        showPlaceholder={!hasReachedMaxItems}
        label={getUploadLabel(previewType, t)}
        accept={acceptList.join(", ")}
        previewType={previewType}
      />
    </div>
  );
};

function getUploadLabel(
  previewType: MediaPreviewType,
  t: ReturnType<typeof useAppTranslate>["t"],
) {
  if (previewType === "video") return t("common.addVideo");
  if (previewType === "audio") return t("common.addAudio");

  return t("common.addImage");
}
