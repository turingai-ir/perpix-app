import { useMemo, useState } from "react";

import {
  useFilesPreviews,
  useInfiniteUserFiles,
  userFilesPageLimit,
} from "@/feature/file-manager";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import { galleryContentTypes, getGalleryFiles } from "../_utils/gallery";
import type { GalleryFilter } from "../_utils/types";

export const useGalleryFiles = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const userFilesState = useInfiniteUserFiles({
    contentTypes: galleryContentTypes[activeFilter],
    limit: userFilesPageLimit,
  }).getUserFilesState;

  const files = useMemo(
    () => getGalleryFiles(userFilesState.data?.pages),
    [userFilesState.data?.pages],
  );
  const fileUuids = useMemo(() => files.map((file) => file.uuid), [files]);
  const { getFilesPreviewsState } = useFilesPreviews(
    fileUuids,
    !userFilesState.isError,
  );

  const fetchMoreFiles = () => {
    if (
      userFilesState.hasNextPage &&
      !userFilesState.isFetchingNextPage &&
      !userFilesState.isPending &&
      !userFilesState.isError
    ) {
      userFilesState.fetchNextPage();
    }
  };

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
    offset: 600,
    disabled: !userFilesState.hasNextPage || userFilesState.isError,
    loading: userFilesState.isPending || userFilesState.isFetchingNextPage,
    onTrigger: fetchMoreFiles,
  });

  return {
    activeFilter,
    files,
    filesPreviewUrls: getFilesPreviewsState.data ?? {},
    isFilesPreviewError: getFilesPreviewsState.isError,
    isFilesPreviewLoading: getFilesPreviewsState.isPending,
    loadMoreRef,
    setActiveFilter,
    userFilesState,
  };
};
