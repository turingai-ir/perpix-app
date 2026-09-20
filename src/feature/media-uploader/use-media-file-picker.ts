import { useMemo, type ChangeEventHandler } from "react";

import {
  type FileManagerAllowedContentType,
  useInfiniteUserFiles,
  userFilesPageLimit,
} from "@/feature/file-manager";

import { getUserFilesWithUuid } from "./utils";
import { canUseFileForGeneration } from "@/features/file-manager";

interface UseMediaFilePickerOptions {
  acceptedContentTypes: readonly FileManagerAllowedContentType[];
  disabled: boolean;
  isOpen: boolean;
  isUploading: boolean;
  selectedIds: readonly string[];
  onFileSelect?: (file: File) => void | Promise<string | void>;
  onFileUploaded?: (id: string) => void;
  onUploadedFileSelect?: (id: string) => void;
}

export function useMediaFilePicker({
  acceptedContentTypes,
  disabled,
  isOpen,
  isUploading,
  selectedIds,
  onFileSelect,
  onFileUploaded,
  onUploadedFileSelect,
}: UseMediaFilePickerOptions) {
  const { getUserFilesState } = useInfiniteUserFiles({
    contentTypes: acceptedContentTypes,
    enabled: isOpen,
    limit: userFilesPageLimit,
  });
  const userFilesResponse = getUserFilesState.data;
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const userFiles = useMemo(
    () =>
      getUserFilesWithUuid(
        userFilesResponse?.pages?.flatMap((page) => page.files ?? []),
      ),
    [userFilesResponse?.pages],
  );
  const isLoadingFiles = getUserFilesState.isPending && !userFilesResponse;

  const uploadFile = async (file: File) => {
    if (disabled || isUploading) return;

    const uploadedFileId = await onFileSelect?.(file);
    if (uploadedFileId) onFileUploaded?.(uploadedFileId);
    await getUserFilesState.refetch();
  };

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

    await uploadFile(selectedFile);
  };

  const fetchMoreFiles = () => {
    if (
      getUserFilesState.hasNextPage &&
      !getUserFilesState.isFetchingNextPage &&
      !getUserFilesState.isPending &&
      !getUserFilesState.isError
    ) {
      getUserFilesState.fetchNextPage();
    }
  };

  const selectUploadedFile = (fileId: string) => {
    const file = userFiles.find((item) => item.uuid === fileId);
    if (
      disabled ||
      selectedIdsSet.has(fileId) ||
      !file ||
      !canUseFileForGeneration(file)
    )
      return;

    onUploadedFileSelect?.(fileId);
  };

  return {
    handleFileChange,
    uploadFile,
    fetchMoreFiles,
    hasMoreFiles: getUserFilesState.hasNextPage,
    isFetchingFiles: getUserFilesState.isFetching,
    isFetchingMoreFiles: getUserFilesState.isFetchingNextPage,
    isFilesError: getUserFilesState.isError && !userFiles.length,
    isLoadingFiles,
    refetchFiles: getUserFilesState.refetch,
    selectedIdsSet,
    selectUploadedFile,
    userFiles,
  };
}
