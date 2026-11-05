import { useId, useState, type ClipboardEvent, type FC } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileManagerUploadStatus,
  type FileManagerAllowedContentType,
} from "@/feature/file-manager";
import { getClipboardImage, toClipboardImageFile } from "../clipboard-image";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { LocalUploadStatusItem } from "./local-upload-status-item";
import { NewFileUploadCard } from "./new-file-upload-card";
import { UserFilesSection } from "./user-files-section";
import type {
  LocalMediaItem,
  MediaPreviewType,
  MediaUploadPresentation,
} from "../types";
import { useMediaFilePicker } from "../use-media-file-picker";
import { canUseFileForGeneration } from "@/features/file-manager";

interface MediaFilePickerDialogProps {
  accept: string;
  acceptedContentTypes: readonly FileManagerAllowedContentType[];
  disabled: boolean;
  isOpen: boolean;
  isUploading: boolean;
  label?: string;
  localItems: LocalMediaItem[];
  previewType: MediaPreviewType;
  presentation?: MediaUploadPresentation;
  selectedIds: string[];
  maxItems?: number;
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
  presentation = "default",
  selectedIds,
  maxItems,
  onFileSelect,
  onOpenChange,
  onUploadedFileSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const uploadInputId = useId();
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const {
    fetchMoreFiles,
    handleFileChange,
    uploadFile,
    hasMoreFiles,
    isFetchingFiles,
    isFetchingMoreFiles,
    isFilesError,
    isLoadingFiles,
    refetchFiles,
    selectedIdsSet: existingSelectedIdsSet,
    selectUploadedFile,
    userFiles,
  } = useMediaFilePicker({
    acceptedContentTypes,
    disabled,
    isOpen,
    isUploading,
    selectedIds,
    onFileSelect,
    onFileUploaded:
      maxItems === undefined
        ? undefined
        : (id) =>
            setDraftIds((current) =>
              current.includes(id) ? current : [...current, id],
            ),
    onUploadedFileSelect,
  });
  const uploadingCount = localItems.filter(
    (item) => item.status === FileManagerUploadStatus.UPLOADING,
  ).length;
  const remainingSlots = Math.max(
    0,
    (maxItems ?? Infinity) - selectedIds.length - uploadingCount,
  );
  const stagedIds = draftIds
    .filter((id) => !existingSelectedIdsSet.has(id))
    .slice(0, remainingSlots);
  const selectedIdsSet = new Set([...selectedIds, ...stagedIds]);
  const canPasteImage =
    previewType === "image" &&
    !disabled &&
    !isUploading &&
    (maxItems === undefined || stagedIds.length < remainingSlots);

  const pasteImage = async (file: Blob | undefined) => {
    if (!file) {
      toast.error(t("features.mediaUploader.newFile.clipboardEmpty"));
      return;
    }
    if (!canPasteImage) return;
    try {
      const image = await toClipboardImageFile(file, acceptedContentTypes);
      if (!image) {
        toast.error(t("common.validationErrors.invalidFileFormat"));
        return;
      }
      await uploadFile(image);
    } catch {
      toast.error(t("common.validationErrors.imageDimensionsUnreadable"));
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (previewType !== "image") return;
    const file = getClipboardImage(event.clipboardData);
    if (!file) return;
    event.preventDefault();
    void pasteImage(file);
  };

  const handlePasteClick = async () => {
    if (!navigator.clipboard?.read) {
      toast.error(t("features.mediaUploader.newFile.clipboardUnavailable"));
      return;
    }
    let imageBlob: Blob | undefined;
    try {
      const items = await navigator.clipboard.read();
      const images = items
        .flatMap((item) => item.types.map((type) => ({ item, type })))
        .filter(({ type }) => type.startsWith("image/"));
      const image =
        images.find(({ type }) =>
          acceptedContentTypes.some((acceptedType) => acceptedType === type),
        ) ?? images[0];
      imageBlob = image && (await image.item.getType(image.type));
    } catch {
      toast.error(t("features.mediaUploader.newFile.clipboardUnavailable"));
      return;
    }
    await pasteImage(imageBlob);
  };

  const handleSelect = (id: string) => {
    if (maxItems === undefined) {
      selectUploadedFile(id);
      return;
    }
    if (existingSelectedIdsSet.has(id)) return;
    const file = userFiles.find((item) => item.uuid === id);
    if (!draftIds.includes(id) && file && !canUseFileForGeneration(file))
      return;
    setDraftIds((current) => {
      if (current.includes(id))
        return current.filter((draftId) => draftId !== id);
      if (current.length >= remainingSlots) return current;
      return [...current, id];
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setDraftIds([]);
    onOpenChange(open);
  };

  const handleConfirm = () => {
    stagedIds.forEach((id) => {
      const file = userFiles.find((item) => item.uuid === id);
      if (!file || canUseFileForGeneration(file)) onUploadedFileSelect?.(id);
    });
    handleOpenChange(false);
  };

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
