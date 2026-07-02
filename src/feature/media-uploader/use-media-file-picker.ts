import { useMemo, type ChangeEventHandler } from "react";

import {
  type FileManagerAllowedContentType,
  type UserFileItem,
  useInfiniteUserFiles,
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
  const { getUserFilesState } = useInfiniteUserFiles({
    contentTypes: acceptedContentTypes,
    enabled: isOpen,
  });
  const userFilesResponse = getUserFilesState.data as
    | { pages?: readonly { files?: readonly UserFileItem[] }[] }
    | undefined;
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const userFiles = useMemo(
    () =>
      getUserFilesWithUuid(
        userFilesResponse?.pages?.flatMap((page) => page.files ?? []),
      ),
    [userFilesResponse?.pages],
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
    if (disabled || selectedIdsSet.has(fileId)) return;

    onUploadedFileSelect?.(fileId);
  };

  return {
    handleFileChange,
    fetchMoreFiles,
    hasMoreFiles: getUserFilesState.hasNextPage,
    isFetchingFiles: getUserFilesState.isFetching,
    isFetchingMoreFiles: getUserFilesState.isFetchingNextPage,
    isFilesError: getUserFilesState.isError,
    isLoadingFiles,
    refetchFiles: getUserFilesState.refetch,
    selectedIdsSet,
    selectUploadedFile,
    userFiles,
  };
}
