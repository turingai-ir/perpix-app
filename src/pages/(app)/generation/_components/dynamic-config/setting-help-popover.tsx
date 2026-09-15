import { useState } from "react";
import { CircleHelp, Lightbulb } from "lucide-react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useAppTranslate } from "@/hooks";

export function SettingHelpPopover({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  const { t } = useAppTranslate();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || focused || pinned;
  const [description, example] = hint.split(/\s*مثال:\s*/u, 2);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setHovered(false);
          setFocused(false);
          setPinned(false);
        }
      }}
    >
      <PopoverAnchor asChild>
        <button
          type="button"
          className="border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring flex min-h-9 shrink-0 cursor-help items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors outline-none focus-visible:ring-2"
          aria-label={t("pages.generation.image.studio.settings.help", {
            field: label,
          })}
          aria-expanded={open}
          onClick={() => setPinned((value) => !value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <CircleHelp aria-hidden="true" className="size-4" />
          {t("pages.generation.image.studio.settings.guide")}
        </button>
      </PopoverAnchor>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={8}
        className="border-border bg-popover w-[min(320px,calc(100vw-2rem))] gap-2 rounded-xl border p-4 shadow-2xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb aria-hidden="true" className="text-primary size-4" />
          {label}
        </div>
        <div>
          <p className="text-foreground/70 mb-1 text-[11px] font-medium">
            {t("pages.generation.image.studio.settings.effect")}
          </p>
          <p className="text-muted-foreground text-xs leading-6">
            {description}
          </p>
        </div>
        {example && (
          <div className="bg-primary/7 border-primary/15 rounded-lg border p-3">
            <p className="text-primary mb-1 text-[11px] font-semibold">
              {t("pages.generation.image.studio.settings.example")}
            </p>
            <p className="text-foreground/80 text-xs leading-6">{example}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
