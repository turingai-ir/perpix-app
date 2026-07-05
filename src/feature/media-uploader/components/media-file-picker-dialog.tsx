import { useId, type FC } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FileManagerAllowedContentType } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { LocalUploadStatusItem } from "./local-upload-status-item";
import { NewFileUploadCard } from "./new-file-upload-card";
import { UserFilesSection } from "./user-files-section";
import type { LocalMediaItem, MediaPreviewType } from "../types";
import { useMediaFilePicker } from "../use-media-file-picker";

interface MediaFilePickerDialogProps {
  accept: string;
  acceptedContentTypes: readonly FileManagerAllowedContentType[];
  disabled: boolean;
  isOpen: boolean;
  isUploading: boolean;
  label?: string;
  localItems: LocalMediaItem[];
  previewType: MediaPreviewType;
  selectedIds: string[];
  onFileSelect?: (file: File) => void | Promise<string | void>;
  onOpenChange: (isOpen: boolean) => void;
  onUploadedFileSelect?: (id: string) => void;
}

export const MediaFilePickerDialog: FC<MediaFilePickerDialogProps> = ({
  accept,
  acceptedContentTypes,
  disabled,
  isOpen,
  isUploading,
  label,
  localItems,
  previewType,
  selectedIds,
  onFileSelect,
  onOpenChange,
  onUploadedFileSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const uploadInputId = useId();
  const {
    fetchMoreFiles,
    handleFileChange,
    hasMoreFiles,
    isFetchingFiles,
    isFetchingMoreFiles,
    isFilesError,
    isFilesPreviewError,
    isFilesPreviewLoading,
    isLoadingFiles,
    previewUrlsByFileUuid,
    refetchFiles,
    selectedIdsSet,
    selectUploadedFile,
    userFiles,
  } = useMediaFilePicker({
    acceptedContentTypes,
    disabled,
    isOpen,
    isUploading,
    selectedIds,
    onFileSelect,
    onUploadedFileSelect,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(720px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-3xl grid-rows-none flex-col overflow-hidden p-0 sm:max-w-3xl"
        showCloseButton={!isUploading}
      >
        <DialogHeader className="border-b px-4 pt-4 pb-3">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {t("features.mediaUploader.dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4">
          <NewFileUploadCard
            accept={accept}
            disabled={disabled}
            inputId={uploadInputId}
            isUploading={isUploading}
            onFileChange={handleFileChange}
          />

          {localItems.length > 0 && (
            <div className="flex shrink-0 flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                {t("features.mediaUploader.uploadStatus")}
              </span>
              <div className="flex flex-wrap gap-2">
                {localItems.map((item) => (
                  <LocalUploadStatusItem key={item.file.name} item={item} />
                ))}
              </div>
            </div>
          )}

          <UserFilesSection
            isError={isFilesError}
            isFetching={isFetchingFiles}
            isFetchingMore={isFetchingMoreFiles}
            isPreviewError={isFilesPreviewError}
            isPreviewLoading={isFilesPreviewLoading}
            isLoading={isLoadingFiles}
            hasMore={hasMoreFiles}
            previewUrlsByFileUuid={previewUrlsByFileUuid}
            previewType={previewType}
            selectedIdsSet={selectedIdsSet}
            userFiles={userFiles}
            onFetchMore={fetchMoreFiles}
            onRefresh={() => refetchFiles()}
            onSelect={selectUploadedFile}
          />
        </div>

        <div className="bg-muted/40 flex shrink-0 items-center justify-end border-t p-4">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => onOpenChange(false)}
          >
            {t("features.mediaUploader.actions.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
