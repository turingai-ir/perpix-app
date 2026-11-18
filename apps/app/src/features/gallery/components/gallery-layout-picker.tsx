import { Grid2X2, LayoutGrid } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

export function GalleryLayoutPicker({
  compact,
  onChange,
}: {
  compact: boolean;
  onChange: (compact: boolean) => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className="border-foreground/8 bg-muted/42 flex flex-none gap-1 rounded-2xl border p-[0.2rem]">
      <Button
        variant={compact ? "ghost" : "secondary"}
        className="size-11 rounded-xl"
        aria-pressed={!compact}
        aria-label={t("pages.gallery.studio.exhibition")}
        onClick={() => onChange(false)}
      >
        <Grid2X2 aria-hidden="true" />
      </Button>
      <Button
        variant={compact ? "secondary" : "ghost"}
        className="size-11 rounded-xl"
        aria-pressed={compact}
        aria-label={t("pages.gallery.studio.compact")}
        onClick={() => onChange(true)}
      >
        <LayoutGrid aria-hidden="true" />
      </Button>
    </div>
  );
}
