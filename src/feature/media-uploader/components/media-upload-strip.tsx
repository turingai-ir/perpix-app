import type { FC } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { MediaFilePickerDialog } from "./media-file-picker-dialog";
import { MediaUploadPlaceholder } from "./media-upload-placeholder";
import { LocalMediaPreviewItem, MediaPreviewItem } from "./media-strip-items";
import { useMediaUploader } from "../hook";
import type { MediaUploadStripProps } from "../types";

export const MediaUploadStrip: FC<MediaUploadStripProps> = ({
  uploadedItems,
  localItems,
  label,
  showPlaceholder = true,
  accept = "image/jpeg, image/png",
  disabled = false,
  previewType = "image",
  onFileSelect,
  onUploadedFileSelect,
  onDeleteClick,
  onLocalDeleteClick,
}) => {
  const {
    acceptedContentTypes,
    isFilePickerOpen,
    isUploading,
    openFilePicker,
    selectedIds,
    setFilePickerOpen,
  } = useMediaUploader({
    accept,
    disabled,
    localItems,
    uploadedItems,
  });

  return (
    <div className="relative w-full min-w-0">
      <MediaFilePickerDialog
        accept={accept}
        acceptedContentTypes={acceptedContentTypes}
        disabled={disabled}
        isOpen={isFilePickerOpen}
        isUploading={isUploading}
        label={label}
        localItems={localItems}
        previewType={previewType}
        selectedIds={selectedIds}
        onFileSelect={onFileSelect}
        onOpenChange={setFilePickerOpen}
        onUploadedFileSelect={onUploadedFileSelect}
      />
      <ScrollArea
        className="w-full min-w-0"
        viewportClassName="overflow-x-auto"
        orientation="horizontal"
      >
        <div className="flex w-max items-center gap-4">
          {showPlaceholder && (
            <MediaUploadPlaceholder
              disabled={disabled}
              label={label}
              onClick={openFilePicker}
            />
          )}

          {localItems.map((item) => (
            <LocalMediaPreviewItem
              key={item.file.name}
              item={item}
              disabled={disabled}
              previewType={previewType}
              onDeleteClick={onLocalDeleteClick}
            />
          ))}

          {uploadedItems.map((item) => (
            <MediaPreviewItem
              key={item.id}
              item={item}
              disabled={disabled}
              previewType={previewType}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      </ScrollArea>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-4 w-4 backdrop-blur-[2px]"
      />
    </div>
  );
};
