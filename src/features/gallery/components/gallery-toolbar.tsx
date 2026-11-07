import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type { GalleryFilter } from "../model/types";
import { GalleryFilterRail } from "./gallery-filter-rail";
import { GalleryLayoutPicker } from "./gallery-layout-picker";
import { GallerySearchField } from "./gallery-search-field";
import { GallerySortSelect } from "./gallery-sort-select";

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
    <section
      className="glass-blur border-glass-edge bg-glass-strong group/toolbar contrast-more:border-foreground/44 sticky top-10 z-20 mt-4 mb-6 flex flex-col gap-3 rounded-3xl border bg-[linear-gradient(135deg,rgb(255_255_255/7%),transparent_42%)] p-3 shadow-[inset_0_1px_rgb(255_255_255/12%),0_18px_56px_-36px_rgb(0_0_0/62%)] max-md:top-9 max-md:mt-3 max-md:mb-4 max-md:rounded-[1.25rem] max-md:p-2.5 [&_button]:touch-manipulation"
      aria-label={t("pages.gallery.title")}
    >
      <div className="flex min-w-0 items-center justify-between gap-3 max-md:flex-col-reverse max-md:items-stretch">
        <GalleryFilterRail
          active={props.activeFilter}
          onFilter={props.onFilter}
        />
        <p
          className="border-foreground/8 bg-background/32 text-foreground/62 min-h-8 flex-none rounded-full border px-[0.7rem] py-[0.35rem] text-xs tabular-nums max-md:self-start"
          role="status"
        >
          {t("pages.gallery.studio.loaded", { count: props.count })}
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-3 max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto]">
        <GallerySearchField value={props.search} onChange={props.onSearch} />
        <GallerySortSelect value={props.sort} onChange={props.onSort} />
        <GalleryLayoutPicker
          compact={props.compact}
          onChange={props.onCompact}
        />
      </div>
      <p
        id="gallery-search-hint"
        className="text-muted-foreground max-h-0 overflow-hidden text-xs leading-normal opacity-0 transition-[max-height,opacity] duration-180 group-focus-within/toolbar:max-h-8 group-focus-within/toolbar:opacity-100 max-md:hidden"
      >
        {t("pages.gallery.studio.searchHint")}
      </p>
    </section>
  );
}
