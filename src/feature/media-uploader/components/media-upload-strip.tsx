import type { FC } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { ComposerReferenceTray } from "./composer-reference-tray";
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
  presentation = "default",
  maxItems,
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
  const hasComposerItems =
    presentation === "composer" && uploadedItems.length + localItems.length > 0;

  return (
    <div
      className={cn(
        "relative min-w-0",
        presentation === "composer" && !hasComposerItems ? "w-auto" : "w-full",
      )}
    >
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
        maxItems={presentation === "composer" ? maxItems : undefined}
        onFileSelect={onFileSelect}
        onOpenChange={setFilePickerOpen}
        onUploadedFileSelect={onUploadedFileSelect}
      />
      {hasComposerItems ? (
        <ComposerReferenceTray
          uploadedItems={uploadedItems}
          localItems={localItems}
          disabled={disabled}
          previewType={previewType}
          maxItems={maxItems}
          onDeleteClick={onDeleteClick}
          onLocalDeleteClick={onLocalDeleteClick}
          onAdd={openFilePicker}
        />
      ) : (
        <ScrollArea
          className={cn(
            "min-w-0",
            presentation === "composer" ? "w-auto" : "w-full",
          )}
          viewportClassName="overflow-x-auto"
          orientation="horizontal"
        >
          <div className={cn("flex items-center gap-4", "w-max")}>
            {showPlaceholder && (
              <MediaUploadPlaceholder
                disabled={disabled}
                label={label}
                onClick={openFilePicker}
                presentation={presentation}
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
      )}
      {presentation !== "composer" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-4 w-4 backdrop-blur-[2px]"
        />
      )}
    </div>
  );
};
