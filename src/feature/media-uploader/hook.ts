import { useMemo, useState } from "react";

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
  const acceptedContentTypes = useMemo(
    () => getAcceptedContentTypes(accept),
    [accept],
  );
  const isUploading = useMemo(
    () => hasUploadingLocalItem(localItems),
    [localItems],
  );
  const selectedIds = useMemo(
    () => getUploadedItemIds(uploadedItems),
    [uploadedItems],
  );

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
