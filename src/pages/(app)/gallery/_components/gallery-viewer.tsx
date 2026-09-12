import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Image,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FilePreviewUrls } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { downloadFile } from "@/utils";
import { GalleryViewerMedia } from "./gallery-viewer-media";
import { getGalleryMediaType } from "../_utils/gallery";
import type { GalleryFile } from "../_utils/types";
import styles from "../gallery.module.css";

interface Props {
  files: GalleryFile[];
  selected: string;
  previews: Record<string, FilePreviewUrls>;
  onSelect: (uuid: string) => void;
  onClose: () => void;
  trigger: HTMLButtonElement | null;
}
export function GalleryViewer({
  files,
  selected,
  previews,
  onSelect,
  onClose,
  trigger,
}: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [zoomed, setZoomed] = useState(false);
  const index = files.findIndex((file) => file.uuid === selected);
  const file = files[index];
  if (!file) return null;
  const name = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  const urls = previews[selected];
  function move(delta: number) {
    const next = files[index + delta];
    if (next) {
      setZoomed(false);
      onSelect(next.uuid);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={`${styles.viewer} bg-background inset-s-0 top-0 flex h-dvh max-h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-4 rounded-none border-0 p-4 sm:max-w-none md:p-6 rtl:translate-x-0`}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger?.focus();
        }}
        onKeyDown={(event) => {
          if (
            zoomed ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            (event.target instanceof HTMLElement &&
              event.target.closest("video,audio,input,select,textarea"))
          )
            return;
          const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(rtl ? -1 : 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(rtl ? 1 : -1);
          }
        }}
      >
        <header className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle dir="auto" className="truncate text-base">
              {name}
            </DialogTitle>
            <DialogDescription>
              {t(`pages.gallery.mediaTypes.${mediaType}`)}
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            className="size-11 shrink-0 rounded-full"
            aria-label={t("pages.gallery.studio.close")}
            onClick={onClose}
          >
            <X />
          </Button>
        </header>
        <div className="bg-muted/40 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border p-2 md:p-4">
          <GalleryViewerMedia
            key={`${selected}-${urls?.preview_url}`}
            url={urls?.preview_url}
            name={name}
            mediaType={mediaType}
            zoomed={zoomed}
          />
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="size-11"
              disabled={index === 0}
              aria-label={t("pages.gallery.studio.previous")}
              onClick={() => move(-1)}
            >
              <ArrowRight className="ltr:rotate-180" />
            </Button>
            <span
              aria-live="polite"
              className="text-muted-foreground min-w-16 text-center text-sm"
            >
              {t("pages.gallery.studio.position", {
                current: index + 1,
                total: files.length,
              })}
            </span>
            <Button
              variant="outline"
              className="size-11"
              disabled={index === files.length - 1}
              aria-label={t("pages.gallery.studio.next")}
              onClick={() => move(1)}
            >
              <ArrowLeft className="ltr:rotate-180" />
            </Button>
          </div>
          <div className="flex gap-2">
            {mediaType === "image" && (
              <Button
                variant="outline"
                className="size-11"
                disabled={!urls?.preview_url}
                aria-pressed={zoomed}
                aria-label={t(
                  zoomed
                    ? "pages.gallery.studio.fit"
                    : "pages.gallery.studio.zoom",
                )}
                onClick={() => setZoomed(!zoomed)}
              >
                {zoomed ? <ZoomOut /> : <ZoomIn />}
              </Button>
            )}
            <Button
              variant="outline"
              className="size-11"
              aria-label={t("common.download")}
              disabled={!urls?.download_url}
              onClick={() =>
                urls?.download_url && downloadFile(urls.download_url)
              }
            >
              <Download />
            </Button>
            {mediaType === "image" && (
              <Button asChild className="h-11">
                <Link to={`/editor/${selected}`}>
                  <Image />
                  {t("pages.editor.edit")}
                </Link>
              </Button>
            )}
          </div>
        </footer>
        <p className="text-muted-foreground hidden text-center text-xs sm:block">
          {t("pages.gallery.studio.viewerHint")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
