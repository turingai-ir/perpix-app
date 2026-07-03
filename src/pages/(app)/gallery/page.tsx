import type { FC } from "react";
import { AlertCircle, Images, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading2, Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import { GalleryFileCard } from "./_components/gallery-file-card";
import { GallerySkeleton } from "./_components/gallery-skeleton";
import { GalleryState } from "./_components/gallery-state";
import { useGalleryFiles } from "./_hooks/use-gallery-files";
import { getGalleryFilters } from "./_utils/gallery";

const GalleryPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const {
    activeFilter,
    files,
    filesPreviewUrls,
    isFilesPreviewError,
    isFilesPreviewLoading,
    loadMoreRef,
    setActiveFilter,
    userFilesState,
  } = useGalleryFiles();
  const filters = getGalleryFilters(t);

  return (
    <div className="flex min-h-full w-full flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading2 className="text-start text-2xl">
            {t("pages.gallery.title")}
          </Heading2>
          <Muted>{t("pages.gallery.description")}</Muted>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={userFilesState.isFetching}
          onClick={() => userFilesState.refetch()}
        >
          <RefreshCw
            className={cn(userFilesState.isFetching && "animate-spin")}
          />
          {t("pages.gallery.actions.refresh")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            type="button"
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {userFilesState.isPending && files.length === 0 ? (
        <GallerySkeleton />
      ) : userFilesState.isError ? (
        <GalleryState
          icon={<AlertCircle className="h-8 w-8" />}
          title={t("pages.gallery.error.title")}
          description={t("pages.gallery.error.description")}
        />
      ) : files.length === 0 ? (
        <GalleryState
          icon={<Images className="h-8 w-8" />}
          title={t("pages.gallery.empty.title")}
          description={t("pages.gallery.empty.description")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {files.map((file, index) => (
              <GalleryFileCard
                key={file.uuid}
                file={file}
                index={index}
                isPreviewError={isFilesPreviewError}
                isPreviewLoading={isFilesPreviewLoading}
                previewUrls={filesPreviewUrls[file.uuid]}
              />
            ))}
          </div>

          {userFilesState.hasNextPage || userFilesState.isFetchingNextPage ? (
            <div
              ref={loadMoreRef}
              className="text-muted-foreground flex min-h-16 items-center justify-center text-sm"
            >
              {userFilesState.isFetchingNextPage
                ? t("pages.gallery.loadingMore")
                : ""}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
