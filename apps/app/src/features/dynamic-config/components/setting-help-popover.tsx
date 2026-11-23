import { useEffect, useRef, useState } from "react";
import { CircleHelp, Lightbulb } from "lucide-react";

import { Popover, PopoverContent } from "@/shared/ui/popover";
import { useAppTranslate } from "@/shared/hooks";

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
  const anchorRef = useRef<HTMLButtonElement>(null);
  const open = hovered || focused || pinned;

  useEffect(() => {
    if (!open) return;
    // Escape closes only this guide, not the dialog that contains it.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setHovered(false);
      setFocused(false);
      setPinned(false);
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [open]);

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
      <button
        ref={anchorRef}
        type="button"
        className="flex min-h-9 shrink-0 cursor-help items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs text-muted-foreground transition-colors outline-none hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
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
      <PopoverContent
        anchor={anchorRef}
        side="top"
        align="end"
        sideOffset={8}
        className="w-[min(320px,calc(100vw-2rem))] gap-2 rounded-xl border border-border bg-popover p-4 shadow-2xl"
        initialFocus={false}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb aria-hidden="true" className="size-4 text-primary" />
          {label}
        </div>
        <div>
          <p className="mb-1 text-caption font-medium text-foreground/70">
            {t("pages.generation.image.studio.settings.effect")}
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {example && (
          <div className="rounded-lg border border-primary/15 bg-primary/7 p-3">
            <p className="mb-1 text-caption font-semibold text-primary">
              {t("pages.generation.image.studio.settings.example")}
            </p>
            <p className="text-xs leading-6 text-foreground/80">{example}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
