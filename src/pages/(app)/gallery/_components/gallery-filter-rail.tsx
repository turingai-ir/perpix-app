import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { getGalleryFilters } from "../_utils/gallery";
import type { GalleryFilter } from "../_utils/types";

export function GalleryFilterRail({
  active,
  onFilter,
}: {
  active: GalleryFilter;
  onFilter: (filter: GalleryFilter) => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div
      className="border-foreground/7 bg-muted/40 grid w-[min(100%,22rem)] max-w-full min-w-0 grid-cols-4 gap-1 rounded-2xl border p-1 max-md:w-full"
      role="group"
      aria-label={t("pages.gallery.title")}
    >
      {getGalleryFilters(t).map((filter) => (
        <Button
          key={filter.key}
          variant={active === filter.key ? "secondary" : "ghost"}
          className="aria-pressed:border-primary/18 ease-out-quint min-h-11 w-full min-w-0 rounded-xl px-2 transition-[color,background-color,transform] duration-140 active:scale-[0.97] aria-pressed:bg-[color-mix(in_srgb,var(--primary)_15%,var(--card))] aria-pressed:shadow-[inset_0_1px_rgb(255_255_255/10%)] motion-reduce:duration-[0.01ms]"
          aria-pressed={active === filter.key}
          onClick={() => onFilter(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
