import { Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

export function GallerySearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className="border-foreground/10 bg-background/56 focus-within:border-primary/55 focus-within:bg-background/74 relative flex min-w-0 flex-1 items-center rounded-2xl border transition-[border-color,box-shadow,background-color] duration-160 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)] max-md:col-span-full">
      <Search
        className="text-muted-foreground pointer-events-none absolute start-3 size-4"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={t("pages.gallery.studio.search")}
        aria-describedby="gallery-search-hint"
        placeholder={t("pages.gallery.studio.search")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full min-w-0 rounded-[inherit] bg-transparent ps-10 pe-12 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <Button
          variant="ghost"
          className="absolute end-0.5 size-11 rounded-[0.875rem]"
          aria-label={t("pages.gallery.studio.clear")}
          onClick={() => onChange("")}
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
