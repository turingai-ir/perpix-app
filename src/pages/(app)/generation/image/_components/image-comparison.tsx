import { useState } from "react";
import { Columns2, Trash2, X } from "lucide-react";

import { MediaPreviewItem } from "@/components/custom/media-preview-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import type { ImageComparisonItem } from "./image-comparison.types";
import styles from "./image-comparison.module.css";

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

  if (items.length === 0) return null;

  return (
    <>
      <aside className={styles.tray} aria-live="polite">
        <span className={styles.trayIcon}>
          <Columns2 aria-hidden="true" />
        </span>
        <div className={styles.trayCopy}>
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
        <div className={styles.actions}>
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
        <DialogContent className={styles.dialog}>
          <DialogHeader>
            <DialogTitle>
              {t("pages.generation.image.compare.title")}
            </DialogTitle>
            <DialogDescription>
              {t("pages.generation.image.compare.description")}
            </DialogDescription>
          </DialogHeader>
          <div className={styles.grid}>
            {items.map((item, index) => (
              <article key={item.fileId} className={styles.card}>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className={styles.remove}
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
                <div className={styles.meta}>
                  <strong>
                    {t("pages.generation.image.compare.item", {
                      index: index + 1,
                    })}
                  </strong>
                  <p>{item.prompt}</p>
                  <span>
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
