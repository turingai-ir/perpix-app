import type { FC } from "react";
import { AlertCircle, Images, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { GalleryFileCard } from "./gallery-file-card";
import { GalleryHeader } from "./gallery-header";
import { GalleryToolbar } from "./gallery-toolbar";
import { GalleryGrid } from "./gallery-grid";
import { GalleryViewer } from "./gallery-viewer";
import { GallerySkeleton } from "./gallery-skeleton";
import { GalleryState } from "./gallery-state";
import { useGallery } from "../hooks/use-gallery";

export const GalleryPage: FC = () => {
  const {
    t,
    activeFilter,
    setActiveFilter,
    files,
    visible,
    search,
    setSearch,
    sort,
    setSort,
    compact,
    setCompact,
    isEmpty,
    isSearchEmpty,
    userFilesState,
    loadMoreRef,
    selected,
    setSelected,
    trigger,
    handleOpenViewer,
    handleCloseViewer,
  } = useGallery();

  return (
    <div
      data-gallery-page
      className="relative isolate mx-auto min-h-full w-full max-w-[1800px] min-w-0 overflow-clip bg-[radial-gradient(circle_at_92%_2%,color-mix(in_oklch,var(--primary)_13%,transparent),transparent_28rem),radial-gradient(circle_at_4%_36%,rgb(41_171_255/8%),transparent_32rem)] p-[clamp(12px,3vw,40px)] [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(rgb(255_255_255/3%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/3%)_1px,transparent_1px)] before:mask-[linear-gradient(to_bottom,black,transparent_64%)] before:bg-size-[52px_52px] before:opacity-[0.22] before:content-[''] max-md:px-3"
    >
      <GalleryHeader
        refreshing={userFilesState.isFetching}
        onRefresh={() => userFilesState.refetch()}
      />
      <GalleryToolbar
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSort={setSort}
        compact={compact}
        onCompact={setCompact}
        count={files.length}
      />
      {userFilesState.isPending && files.length === 0 ? <GallerySkeleton /> : null}
      {userFilesState.isError ? (
        <div role="alert" className="mb-6 space-y-3 rounded-2xl border p-5">
          <p className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            {t("pages.gallery.error.description")}
          </p>
          <Button
            variant="outline"
            className="h-11"
            disabled={userFilesState.isFetching}
            onClick={() => userFilesState.refetch()}
          >
            {t("pages.gallery.actions.refresh")}
          </Button>
        </div>
      ) : null}
      {isEmpty ? (
        <GalleryState
          icon={<Images className="size-8" />}
          title={t("pages.gallery.empty.title")}
          description={t("pages.gallery.empty.description")}
        />
      ) : null}
      {isSearchEmpty ? (
        <GalleryState
          icon={<Search className="size-8" />}
          title={t("pages.gallery.studio.noResults")}
          description={t("pages.gallery.studio.noResultsHint")}
        />
      ) : null}
      <GalleryGrid compact={compact}>
        {visible.map((file, index) => (
          <GalleryFileCard
            key={file.uuid}
            file={file}
            index={index}
            compact={compact}
            onOpen={(element) => handleOpenViewer(file.uuid, element)}
          />
        ))}
      </GalleryGrid>
      {userFilesState.hasNextPage ? (
        <div
          ref={search.trim() ? undefined : loadMoreRef}
          className="flex min-h-24 items-center justify-center"
        >
          <Button
            variant="outline"
            className="h-11"
            disabled={userFilesState.isFetching}
            onClick={() => userFilesState.fetchNextPage()}
          >
            {t(
              userFilesState.isFetchingNextPage
                ? "pages.gallery.loadingMore"
                : "pages.gallery.studio.loadMore",
            )}
          </Button>
        </div>
      ) : null}
      {!userFilesState.hasNextPage && files.length > 0 ? (
        <p className="text-muted-foreground py-8 text-center text-xs">
          {t("pages.gallery.studio.end")}
        </p>
      ) : null}
      {selected ? (
        <GalleryViewer
          files={visible}
          selected={selected}
          onSelect={setSelected}
          onClose={handleCloseViewer}
          trigger={trigger}
        />
      ) : null}
    </div>
  );
};

export default GalleryPage;
