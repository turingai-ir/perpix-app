import { Grid2X2, LayoutGrid, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { getGalleryFilters } from "../_utils/gallery";
import type { GalleryFilter } from "../_utils/types";

interface Props {
  activeFilter: GalleryFilter;
  onFilter: (filter: GalleryFilter) => void;
  search: string;
  onSearch: (value: string) => void;
  compact: boolean;
  onCompact: (value: boolean) => void;
  sort: string;
  onSort: (value: string) => void;
  count: number;
}
export function GalleryToolbar(props: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <section className="my-6 space-y-4" aria-label={t("pages.gallery.title")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="bg-muted flex max-w-full flex-wrap gap-1 rounded-2xl p-1"
          role="group"
          aria-label={t("pages.gallery.title")}
        >
          {getGalleryFilters(t).map((filter) => (
            <Button
              key={filter.key}
              variant={
                props.activeFilter === filter.key ? "secondary" : "ghost"
              }
              className="h-11 rounded-xl px-4"
              aria-pressed={props.activeFilter === filter.key}
              onClick={() => props.onFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-sm" role="status">
          {t("pages.gallery.studio.loaded", { count: props.count })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-card focus-within:ring-ring relative flex min-w-0 basis-full items-center rounded-xl border focus-within:ring-2 sm:flex-1 sm:basis-auto">
          <Search
            className="text-muted-foreground pointer-events-none absolute start-3 size-4"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label={t("pages.gallery.studio.search")}
            aria-describedby="gallery-search-hint"
            placeholder={t("pages.gallery.studio.search")}
            value={props.search}
            onChange={(event) => props.onSearch(event.target.value)}
            className="h-12 w-full min-w-0 rounded-xl bg-transparent ps-10 pe-12 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {props.search && (
            <Button
              variant="ghost"
              className="absolute end-0 size-11 rounded-xl"
              aria-label={t("pages.gallery.studio.clear")}
              onClick={() => props.onSearch("")}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
        <select
          aria-label={t("pages.gallery.studio.sort")}
          value={props.sort}
          onChange={(event) => props.onSort(event.target.value)}
          className="bg-card focus-visible:ring-ring h-12 min-w-0 flex-1 rounded-xl border px-3 text-sm outline-none focus-visible:ring-2 sm:flex-none"
        >
          {["original", "name", "size"].map((value) => (
            <option key={value} value={value}>
              {t(`pages.gallery.studio.${value}`)}
            </option>
          ))}
        </select>
        <div className="bg-muted flex gap-1 rounded-xl p-1">
          <Button
            variant={props.compact ? "ghost" : "secondary"}
            className="size-11 rounded-lg"
            aria-pressed={!props.compact}
            aria-label={t("pages.gallery.studio.exhibition")}
            onClick={() => props.onCompact(false)}
          >
            <Grid2X2 aria-hidden="true" />
          </Button>
          <Button
            variant={props.compact ? "secondary" : "ghost"}
            className="size-11 rounded-lg"
            aria-pressed={props.compact}
            aria-label={t("pages.gallery.studio.compact")}
            onClick={() => props.onCompact(true)}
          >
            <LayoutGrid aria-hidden="true" />
          </Button>
        </div>
      </div>
      <p
        id="gallery-search-hint"
        className="text-muted-foreground text-xs leading-6"
      >
        {t("pages.gallery.studio.searchHint")}
      </p>
    </section>
  );
}
