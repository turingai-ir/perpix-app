import { useState } from "react";
import { Columns2, Trash2, X } from "lucide-react";

import { MediaPreviewItem } from "@/shared/components/media-preview-item";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useAppTranslate } from "@/shared/hooks";
import type { ImageComparisonItem } from "./image-comparison.types";

function formatResolution(value: unknown) {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

export function ImageComparison({
  disabled,
  items,
  onClear,
  onRemove,
}: {
  disabled?: boolean;
  items: readonly ImageComparisonItem[];
  onClear: () => void;
  onRemove: (fileId: string) => void;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  // Removing items below two must close the dialog for good; otherwise the
  // next "add to comparison" would reopen it by itself.
  if (open && items.length < 2) setOpen(false);

  if (items.length === 0) return null;

  return (
    <>
      <aside
        className="animate-card-arrival border-foreground/9 bg-card/90 contrast-more:border-foreground/30 supports-[not(backdrop-filter:blur(1px))]:bg-card mx-auto mb-2.5 grid min-h-15 w-[calc(100%-1rem)] grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3 rounded-[1.35rem] border p-3 shadow-[inset_0_1px_rgb(255_255_255/6%),0_0.8rem_2.5rem_rgb(0_0_0/18%)] backdrop-blur-lg backdrop-saturate-125 motion-reduce:animate-none min-[641px]:flex min-[641px]:items-center min-[641px]:gap-2.5 min-[641px]:rounded-[1.2rem] min-[641px]:px-2.5 min-[641px]:py-2"
        aria-live="polite"
      >
        <span className="bg-primary/15 text-primary grid size-11 flex-none place-items-center rounded-[0.9rem] min-[641px]:size-9 min-[641px]:rounded-xl [&_svg]:size-4.5 min-[641px]:[&_svg]:size-4">
          <Columns2 aria-hidden="true" />
        </span>
        <div className="[&_span]:text-muted-foreground min-w-0 flex-1 py-1 min-[641px]:py-0 [&_span]:mt-0.5 [&_span]:block [&_span]:text-xs [&_span]:leading-relaxed [&_strong]:block [&_strong]:text-sm [&_strong]:leading-snug min-[641px]:[&_strong]:text-xs">
          <strong>
            {t("pages.generation.image.compare.selection", {
              count: items.length,
            })}
          </strong>
          <span>
            {items.length < 2
              ? t("pages.generation.image.compare.minimum")
              : t("pages.generation.image.compare.ready")}
          </span>
        </div>
        <div className="border-foreground/8 bg-foreground/3 col-span-full grid w-full grid-cols-[minmax(0,1fr)_2.75rem] gap-2 rounded-2xl border p-1.5 min-[641px]:flex min-[641px]:w-auto min-[641px]:flex-none min-[641px]:items-center min-[641px]:border-0 min-[641px]:bg-transparent min-[641px]:p-0 [&>button]:min-h-11 [&>button]:w-full [&>button]:touch-manipulation [&>button]:transition-transform motion-reduce:[&>button]:transition-none min-[641px]:[&>button]:w-auto [&>button:active:not(:disabled)]:scale-[0.97] motion-reduce:[&>button:active:not(:disabled)]:scale-100">
          <Button
            type="button"
            size="sm"
            disabled={disabled || items.length < 2}
            onClick={() => setOpen(true)}
          >
            {t("pages.generation.image.compare.open")}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={t("pages.generation.image.compare.clear")}
            onClick={onClear}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </aside>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-foreground/10 bg-popover/94 max-h-[90dvh] w-[min(74rem,calc(100%-1.5rem))] max-w-296 overflow-auto rounded-[1.25rem] border shadow-[0_2rem_8rem_rgb(0_0_0/72%)] backdrop-blur-xl backdrop-saturate-130 sm:max-h-[min(88dvh,60rem)] sm:max-w-296">
          <DialogHeader>
            <DialogTitle>
              {t("pages.generation.image.compare.title")}
            </DialogTitle>
            <DialogDescription>
              {t("pages.generation.image.compare.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3.5 min-[641px]:grid-cols-2">
            {items.map((item, index) => (
              <article
                key={item.fileId}
                className="border-foreground/9 bg-foreground/3 relative min-w-0 overflow-hidden rounded-2xl border [&>div:first-of-type]:rounded-none [&>div:first-of-type]:border-0"
              >
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="absolute end-2 top-2 z-3 rounded-full shadow-[0_0.5rem_1.5rem_rgb(0_0_0/40%)]"
                  aria-label={t("pages.generation.image.compare.remove")}
                  onClick={() => onRemove(item.fileId)}
                >
                  <X aria-hidden="true" />
                </Button>
                <MediaPreviewItem
                  fileId={item.fileId}
                  index={index}
                  type="image"
                  aspectRatio={item.aspectRatio.replace(":", " / ")}
                  alt={item.prompt}
                />
                <div className="p-3">
                  <strong className="text-xs">
                    {t("pages.generation.image.compare.item", {
                      index: index + 1,
                    })}
                  </strong>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">
                    {item.prompt}
                  </p>
                  <span
                    className="text-primary mt-2 block text-end text-xs"
                    dir="ltr"
                  >
                    {item.aspectRatio}
                    {formatResolution(item.resolution)
                      ? ` · ${formatResolution(item.resolution)}`
                      : ""}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
