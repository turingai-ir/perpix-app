import { useState } from "react";

import type { LocalMediaItem, UploadedMediaItem } from "./types";
import {
  getAcceptedContentTypes,
  getUploadedItemIds,
  hasUploadingLocalItem,
} from "./utils";

interface UseMediaUploaderOptions {
  accept: string;
  disabled: boolean;
  localItems: readonly LocalMediaItem[];
  uploadedItems: readonly UploadedMediaItem[];
}

export function useMediaUploader({
  accept,
  disabled,
  localItems,
  uploadedItems,
}: UseMediaUploaderOptions) {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const acceptedContentTypes = getAcceptedContentTypes(accept);
  const isUploading = hasUploadingLocalItem(localItems);
  const selectedIds = getUploadedItemIds(uploadedItems);

  const openFilePicker = () => {
    if (!disabled) setIsFilePickerOpen(true);
  };

  const setFilePickerOpen = (nextIsOpen: boolean) => {
    if (!nextIsOpen && isUploading) return;

    setIsFilePickerOpen(nextIsOpen);
  };

  return {
    acceptedContentTypes,
    isFilePickerOpen,
    isUploading,
    openFilePicker,
    selectedIds,
    setFilePickerOpen,
  };
}
