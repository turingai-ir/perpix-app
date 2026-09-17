import { Grid2X2, LayoutGrid, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { getGalleryFilters } from "../_utils/gallery";
import type { GalleryFilter } from "../_utils/types";
import styles from "../gallery.module.css";

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
    <section className={styles.toolbar} aria-label={t("pages.gallery.title")}>
      <div className={styles.toolbarTopline}>
        <div
          className={styles.filterRail}
          role="group"
          aria-label={t("pages.gallery.title")}
        >
          {getGalleryFilters(t).map((filter) => (
            <Button
              key={filter.key}
              variant={
                props.activeFilter === filter.key ? "secondary" : "ghost"
              }
              className={styles.filterButton}
              aria-pressed={props.activeFilter === filter.key}
              onClick={() => props.onFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <p className={styles.resultCount} role="status">
          {t("pages.gallery.studio.loaded", { count: props.count })}
        </p>
      </div>
      <div className={styles.toolbarControls}>
        <div className={styles.searchField}>
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
            className={styles.searchInput}
          />
          {props.search && (
            <Button
              variant="ghost"
              className={styles.clearSearch}
              aria-label={t("pages.gallery.studio.clear")}
              onClick={() => props.onSearch("")}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className={styles.sortControl}>
          <Select value={props.sort} onValueChange={props.onSort}>
            <SelectTrigger
              aria-label={t("pages.gallery.studio.sort")}
              className={styles.sortSelect}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className={styles.sortContent}
            >
              {["original", "name", "size"].map((value) => (
                <SelectItem
                  key={value}
                  value={value}
                  className={styles.sortItem}
                >
                  {t(`pages.gallery.studio.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={styles.layoutPicker}>
          <Button
            variant={props.compact ? "ghost" : "secondary"}
            className={styles.layoutButton}
            aria-pressed={!props.compact}
            aria-label={t("pages.gallery.studio.exhibition")}
            onClick={() => props.onCompact(false)}
          >
            <Grid2X2 aria-hidden="true" />
          </Button>
          <Button
            variant={props.compact ? "secondary" : "ghost"}
            className={styles.layoutButton}
            aria-pressed={props.compact}
            aria-label={t("pages.gallery.studio.compact")}
            onClick={() => props.onCompact(true)}
          >
            <LayoutGrid aria-hidden="true" />
          </Button>
        </div>
      </div>
      <p id="gallery-search-hint" className={styles.searchHint}>
        {t("pages.gallery.studio.searchHint")}
      </p>
    </section>
  );
}
