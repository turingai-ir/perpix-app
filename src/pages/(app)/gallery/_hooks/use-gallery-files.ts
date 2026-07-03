import { useMemo, useState } from "react";

import { useInfiniteUserFiles } from "@/feature/file-manager";
import { useInfiniteScroll } from "@/hooks/use-infinitive-scroll";

import { galleryContentTypes, getGalleryFiles } from "../_utils/gallery";
import type { GalleryFilter } from "../_utils/types";

export const useGalleryFiles = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const userFilesState = useInfiniteUserFiles({
    contentTypes: galleryContentTypes[activeFilter],
    limit: 50,
  }).getUserFilesState;

  const files = useMemo(
    () => getGalleryFiles(userFilesState.data?.pages),
    [userFilesState.data?.pages],
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
    loadMoreRef,
    setActiveFilter,
    userFilesState,
  };
};
