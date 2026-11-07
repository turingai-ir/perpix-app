import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const SORT_KEYS = ["original", "name", "size"];

export function GallerySortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const items = SORT_KEYS.map((key) => ({
    value: key,
    label: t(`pages.gallery.studio.${key}`),
  }));
  return (
    <div className="relative min-w-34 max-md:w-full max-md:min-w-0">
      <Select
        value={value}
        items={items}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger
          aria-label={t("pages.gallery.studio.sort")}
          className="border-foreground/10 bg-background/64 text-foreground focus-visible:border-ring h-12 w-full justify-between rounded-2xl border px-[0.85rem] text-[0.8125rem] outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ring)_20%,transparent)] data-[size=default]:h-12 max-md:min-w-0 max-md:text-base"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="start"
          className="border-glass-edge bg-glass-strong min-w-(--anchor-width) rounded-2xl border bg-[linear-gradient(135deg,rgb(255_255_255/10%),transparent_46%)] p-[0.3rem] shadow-[inset_0_1px_rgb(255_255_255/13%),0_18px_48px_-28px_rgb(0_0_0/72%)]"
        >
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="data-selected:bg-primary/16 data-selected:text-foreground min-h-10 rounded-[0.7rem] ps-3 pe-9 text-[0.8125rem] max-md:min-h-11 max-md:text-base"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
