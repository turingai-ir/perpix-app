import { useMemo, useState } from "react";
import { AlertCircle, Images, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { GalleryFileCard } from "./_components/gallery-file-card";
import { GalleryHeader } from "./_components/gallery-header";
import { GalleryToolbar } from "./_components/gallery-toolbar";
import { GalleryViewer } from "./_components/gallery-viewer";
import { GallerySkeleton } from "./_components/gallery-skeleton";
import { GalleryState } from "./_components/gallery-state";
import { useGalleryFiles } from "./_hooks/use-gallery-files";
import styles from "./gallery.module.css";

export default function GalleryPage() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const {
    activeFilter,
    files,
    filesPreviewUrls,
    isFilesPreviewLoading,
    setActiveFilter,
    userFilesState,
    loadMoreRef,
  } = useGalleryFiles();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("original");
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const visible = useMemo(() => {
    const result = files.filter((file) =>
      (file.file_name || "")
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(search.trim().normalize("NFKC").toLocaleLowerCase()),
    );
    if (sort === "name")
      result.sort((a, b) =>
        (a.file_name || "").localeCompare(b.file_name || "", "fa", {
          numeric: true,
        }),
      );
    if (sort === "size")
      result.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
    return result;
  }, [files, search, sort]);
  const empty =
    !userFilesState.isPending && !userFilesState.isError && files.length === 0;
  return (
    <div className={styles.page}>
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
      {userFilesState.isPending && files.length === 0 && <GallerySkeleton />}
      {userFilesState.isError && (
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
      )}
      {empty && (
        <GalleryState
          icon={<Images className="size-8" />}
          title={t("pages.gallery.empty.title")}
          description={t("pages.gallery.empty.description")}
        />
      )}
      {files.length > 0 && visible.length === 0 && (
        <GalleryState
          icon={<Search className="size-8" />}
          title={t("pages.gallery.studio.noResults")}
          description={t("pages.gallery.studio.noResultsHint")}
        />
      )}
      <div className={`${styles.grid} ${compact ? styles.compact : ""}`}>
        {visible.map((file, index) => (
          <GalleryFileCard
            key={file.uuid}
            file={file}
            index={index}
            compact={compact}
            isPreviewLoading={isFilesPreviewLoading}
            previewUrls={filesPreviewUrls[file.uuid]}
            onOpen={(element) => {
              setTrigger(element);
              setSelected(file.uuid);
            }}
          />
        ))}
      </div>
      {userFilesState.hasNextPage && (
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
      )}
      {!userFilesState.hasNextPage && files.length > 0 && (
        <p className="text-muted-foreground py-8 text-center text-xs">
          {t("pages.gallery.studio.end")}
        </p>
      )}
      {selected && (
        <GalleryViewer
          files={visible}
          selected={selected}
          previews={filesPreviewUrls}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
          trigger={trigger}
        />
      )}
    </div>
  );
}
