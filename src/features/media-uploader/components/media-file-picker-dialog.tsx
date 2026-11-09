import type { FC } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { LocalUploadStatusItem } from "./local-upload-status-item";
import { NewFileUploadCard } from "./new-file-upload-card";
import { UserFilesSection } from "./user-files-section";
import {
  useMediaFilePickerDialog,
  type UseMediaFilePickerDialogOptions,
} from "../hooks/use-media-file-picker-dialog";

export type MediaFilePickerDialogProps = UseMediaFilePickerDialogOptions;

export const MediaFilePickerDialog: FC<MediaFilePickerDialogProps> = (
  props,
) => {
  const {
    accept,
    disabled,
    isOpen,
    isUploading,
    label,
    localItems,
    previewType,
    presentation = "default",
    selectedIds,
    maxItems,
  } = props;

  const {
    t,
    uploadInputId,
    uploadingCount,
    remainingSlots,
    stagedIds,
    selectedIdsSet,
    userFiles,
    hasMoreFiles,
    isFetchingFiles,
    isFetchingMoreFiles,
    isFilesError,
    isLoadingFiles,
    fetchMoreFiles,
    refetchFiles,
    uploadFile,
    handleFileChange,
    handlePaste,
    handlePasteClick,
    handleSelect,
    handleOpenChange,
    handleConfirm,
  } = useMediaFilePickerDialog(props);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          presentation === "video-dock"
            ? "flex max-h-[min(720px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-3xl grid-rows-none flex-col overflow-hidden border-white/15 bg-[#14151a]/94 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-3xl"
            : "flex max-h-[min(720px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-3xl grid-rows-none flex-col overflow-hidden p-0 sm:max-w-3xl"
        }
        showCloseButton={!isUploading}
        onPaste={handlePaste}
      >
        <DialogHeader className="shrink-0 border-b px-4 pt-4 pb-3">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {t("features.mediaUploader.dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4">
          <NewFileUploadCard
            accept={accept}
            disabled={
              disabled ||
              (maxItems !== undefined && stagedIds.length >= remainingSlots)
            }
            inputId={uploadInputId}
            isUploading={isUploading}
            onFileChange={handleFileChange}
            onPasteClick={
              previewType === "image" ? handlePasteClick : undefined
            }
          />

          {localItems.length > 0 && (
            <div className="flex shrink-0 flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                {t("features.mediaUploader.uploadStatus")}
              </span>
              <div className="flex flex-wrap gap-2">
                {localItems.map((item) => (
                  <LocalUploadStatusItem
                    key={item.id ?? item.file.name}
                    item={item}
                    onRetry={
                      !disabled && !isUploading
                        ? (file) => {
                            void uploadFile(file);
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <UserFilesSection
            isError={isFilesError}
            isFetching={isFetchingFiles}
            isFetchingMore={isFetchingMoreFiles}
            isLoading={isLoadingFiles}
            hasMore={hasMoreFiles}
            previewType={previewType}
            selectedIdsSet={selectedIdsSet}
            toggleableIdsSet={new Set(stagedIds)}
            userFiles={userFiles}
            onFetchMore={fetchMoreFiles}
            onRefresh={() => refetchFiles()}
            onSelect={handleSelect}
          />
        </div>

        <div className="bg-muted/40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t p-4">
          {maxItems !== undefined && (
            <span className="text-muted-foreground text-xs" aria-live="polite">
              {t("features.mediaUploader.composer.count", {
                count: selectedIds.length + uploadingCount + stagedIds.length,
                max: maxItems,
              })}
            </span>
          )}
          <div className="ms-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => handleOpenChange(false)}
            >
              {t("features.mediaUploader.actions.close")}
            </Button>
            {maxItems !== undefined && (
              <Button
                type="button"
                disabled={disabled || isUploading || stagedIds.length === 0}
                onClick={handleConfirm}
              >
                {t(
                  presentation === "video-dock"
                    ? `features.mediaUploader.videoDock.confirm.${previewType}`
                    : "features.mediaUploader.composer.confirm",
                  { count: stagedIds.length },
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
