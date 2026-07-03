import { useEffect, useMemo, type FC } from "react";
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
import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";
import { HttpStatus } from "@/utils";
import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";

import {
  getAcceptList,
  getPreviewType,
  isListFileField,
  type MediaPreviewType,
} from "./media";
import type { DynamicConfigForm } from "../types";

const HINT_CLASS_NAME = "text-muted-foreground/60 text-[0.7rem] leading-snug";

export const DynamicConfigFileField: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldName: string;
  hint?: string;
  label: string;
  onValueChange?: (value: string | string[] | undefined) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  property?: JsonSchemaProperty;
  requestId?: string;
}> = ({
  disabled = false,
  dynamicForm,
  fieldName,
  hint,
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

  const selectedFileIds = normalizeMediaIds(dynamicForm.watch(fieldName));
  const localItems = toLocalMediaItems(pendingUploads.values());
  const isUploading = hasUploadingLocalItem(localItems);
  const hasReachedMaxItems = hasReachedMediaMaxItems(
    selectedFileIds,
    localItems,
    maxItems,
  );

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

    setFileValue(removeMediaId(selectedFileIds, fileId));
  };

  const handleLocalDelete = (fileName: string) => {
    if (!disabled) removePendingUpload(fileName);
  };

  const handleUploadedFileSelect = (fileId: string) => {
    if (disabled) {
      return;
    }

    const nextSelectedFileIds = normalizeMediaIds(
      dynamicForm.getValues(fieldName),
    );

    if (!isList) {
      setFileValue(fileId);
      return;
    }

    const selectedWithNewFile = appendMediaId(
      nextSelectedFileIds,
      fileId,
      maxItems,
    );

    if (!selectedWithNewFile) return;

    setFileValue(selectedWithNewFile);
  };

  const handleFileSelect = async (file: File) => {
    if (disabled || hasReachedMaxItems) return;

    try {
      const uploadedFileId = await requestUpload(file);

      if (!uploadedFileId) return;

      if (!isList) {
        setFileValue(uploadedFileId);
        return uploadedFileId;
      }

      const nextSelectedFileIds = normalizeMediaIds(
        dynamicForm.getValues(fieldName),
      );
      const selectedWithUploadedFile = appendMediaId(
        nextSelectedFileIds,
        uploadedFileId,
        maxItems,
      );

      if (!selectedWithUploadedFile) return;

      setFileValue(selectedWithUploadedFile);

      return uploadedFileId;
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
      {hint ? <p className={HINT_CLASS_NAME}>{hint}</p> : null}
      <MediaUploadStrip
        uploadedItems={toUploadedMediaItems(selectedFileIds)}
        localItems={localItems}
        disabled={disabled}
        onDeleteClick={handleDelete}
        onLocalDeleteClick={handleLocalDelete}
        onFileSelect={handleFileSelect}
        onUploadedFileSelect={handleUploadedFileSelect}
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
