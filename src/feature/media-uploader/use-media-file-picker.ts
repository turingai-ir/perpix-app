import { useMemo, type ChangeEventHandler } from "react";

import {
  type FileManagerAllowedContentType,
  type UserFileItem,
  useUserFiles,
} from "@/feature/file-manager";

import { getUserFilesWithUuid } from "./utils";

interface UseMediaFilePickerOptions {
  acceptedContentTypes: readonly FileManagerAllowedContentType[];
  disabled: boolean;
  isOpen: boolean;
  isUploading: boolean;
  selectedIds: readonly string[];
  onFileSelect?: (file: File) => void | Promise<string | void>;
  onUploadedFileSelect?: (id: string) => void;
}

export function useMediaFilePicker({
  acceptedContentTypes,
  disabled,
  isOpen,
  isUploading,
  selectedIds,
  onFileSelect,
  onUploadedFileSelect,
}: UseMediaFilePickerOptions) {
  const { getUserFilesState } = useUserFiles({
    contentTypes: acceptedContentTypes,
    enabled: isOpen,
  });
  const userFilesResponse = getUserFilesState.data as
    | { files?: readonly UserFileItem[] }
    | undefined;
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const userFiles = useMemo(
    () => getUserFilesWithUuid(userFilesResponse?.files),
    [userFilesResponse?.files],
  );
  const isLoadingFiles = getUserFilesState.isPending && !userFilesResponse;

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const input = event.currentTarget;

    if (disabled || isUploading) {
      input.value = "";
      return;
    }

    const selectedFile = input.files?.[0];
    input.value = "";

    if (!selectedFile) return;

    await onFileSelect?.(selectedFile);
    await getUserFilesState.refetch();
  };

  const selectUploadedFile = (fileId: string) => {
    if (disabled || selectedIdsSet.has(fileId)) return;

    onUploadedFileSelect?.(fileId);
  };

  return {
    handleFileChange,
    isFetchingFiles: getUserFilesState.isFetching,
    isFilesError: getUserFilesState.isError,
    isLoadingFiles,
    refetchFiles: getUserFilesState.refetch,
    selectedIdsSet,
    selectUploadedFile,
    userFiles,
  };
}
