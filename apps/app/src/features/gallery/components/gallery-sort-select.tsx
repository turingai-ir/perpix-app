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
          className="h-12 w-full justify-between rounded-2xl border border-foreground/10 bg-background/64 px-[0.85rem] text-subhead text-foreground outline-none focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ring)_20%,transparent)] data-[size=default]:h-12 max-md:min-w-0 max-md:text-base"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="start"
          className="min-w-(--anchor-width) rounded-2xl border border-glass-edge bg-glass-strong bg-[linear-gradient(135deg,color-mix(in_oklch,var(--night-foreground)_10%,transparent),transparent_46%)] p-[0.3rem] shadow-modal inset-shadow-highlight"
        >
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="min-h-10 rounded-lg ps-3 pe-9 text-subhead max-md:min-h-11 max-md:text-base data-selected:bg-primary/16 data-selected:text-foreground"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
