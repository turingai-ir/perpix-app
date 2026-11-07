import { useMemo, useState } from "react";

import {
  useInfiniteUserFiles,
  userFilesPageLimit,
} from "@/features/file-manager";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

import { galleryContentTypes, getGalleryFiles } from "../model/gallery";
import type { GalleryFilter } from "../model/types";

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
