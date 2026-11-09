import { useId, useState, type ClipboardEvent } from "react";
import { toast } from "sonner";
import {
  canUseFileForGeneration,
  FileManagerUploadStatus,
  type FileManagerAllowedContentType,
} from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { getClipboardImage, toClipboardImageFile } from "../services/clipboard-image";
import { useMediaFilePicker } from "./use-media-file-picker";
import type {
  LocalMediaItem,
  MediaPreviewType,
  MediaUploadPresentation,
} from "../model/types";

export interface UseMediaFilePickerDialogOptions {
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

export function useMediaFilePickerDialog({
  acceptedContentTypes,
  disabled,
  isOpen,
  isUploading,
  localItems,
  previewType,
  selectedIds,
  maxItems,
  onFileSelect,
  onOpenChange,
  onUploadedFileSelect,
}: UseMediaFilePickerDialogOptions) {
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
    if (!draftIds.includes(id) && file && !canUseFileForGeneration(file)) {
      return;
    }
    setDraftIds((current) => {
      if (current.includes(id)) {
        return current.filter((draftId) => draftId !== id);
      }
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
      if (!file || canUseFileForGeneration(file)) {
        onUploadedFileSelect?.(id);
      }
    });
    handleOpenChange(false);
  };

  return {
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
  };
}
