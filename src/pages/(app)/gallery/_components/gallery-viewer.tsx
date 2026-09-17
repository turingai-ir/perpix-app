import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
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
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const dragX = useMotionValue(0);
  const dragTransform = useMotionTemplate`translate3d(${dragX}px, 0, 0)`;
  const dragStart = useRef<
    | {
        pointerId: number;
        time: number;
        x: number;
      }
    | undefined
  >(undefined);
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
  function handleSwipe(offsetX: number, velocityX: number) {
    if (zoomed || (Math.abs(offsetX) < 72 && Math.abs(velocityX) < 500)) {
      return;
    }

    const rtl = document.documentElement.dir === "rtl";
    const movedTowardEnd = rtl ? offsetX > 0 : offsetX < 0;
    move(movedTowardEnd ? 1 : -1);
  }
  function getDragOffset(offsetX: number) {
    const rtl = document.documentElement.dir === "rtl";
    const movedTowardEnd = rtl ? offsetX > 0 : offsetX < 0;
    const targetIndex = index + (movedTowardEnd ? 1 : -1);
    return files[targetIndex] ? offsetX : offsetX * 0.22;
  }
  function settleDrag() {
    setIsDragging(false);
    void animate(dragX, 0, {
      type: "spring",
      duration: shouldReduceMotion ? 0.01 : 0.32,
      bounce: 0,
    });
  }
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (zoomed || event.button !== 0) return;
    if (event.nativeEvent.isTrusted) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    dragStart.current = {
      pointerId: event.pointerId,
      time: performance.now(),
      x: event.clientX,
    };
    setIsDragging(true);
  }
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    dragX.set(getDragOffset(event.clientX - start.x));
  }
  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const offsetX = event.clientX - start.x;
    const elapsed = Math.max(performance.now() - start.time, 1);
    dragStart.current = undefined;
    handleSwipe(offsetX, (offsetX / elapsed) * 1000);
    settleDrag();
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
        className={`${styles.viewer} inset-0 flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 sm:max-w-none rtl:translate-x-0`}
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
        <header className={styles.viewerHeader}>
          <div className={styles.viewerHeading}>
            <DialogTitle dir="auto" className={styles.viewerTitle}>
              {name}
            </DialogTitle>
            <DialogDescription>
              {t(`pages.gallery.mediaTypes.${mediaType}`)}
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            className={styles.viewerClose}
            aria-label={t("pages.gallery.studio.close")}
            onClick={onClose}
          >
            <X />
          </Button>
        </header>
        <div className={styles.viewerStage}>
          <motion.div
            data-gallery-viewer-media
            className={styles.viewerMediaFrame}
            data-dragging={isDragging}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={() => {
              dragStart.current = undefined;
              settleDrag();
            }}
            style={{
              touchAction: zoomed ? "auto" : "pan-y",
              transform: dragTransform,
            }}
          >
            <GalleryViewerMedia
              key={`${selected}-${urls?.preview_url}`}
              url={urls?.preview_url}
              name={name}
              mediaType={mediaType}
              zoomed={zoomed}
            />
          </motion.div>
        </div>
        <footer className={styles.viewerFooter}>
          <div className={styles.viewerNavigation}>
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
          <div className={styles.viewerActions}>
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
        <p className={styles.viewerHint}>
          {t("pages.gallery.studio.viewerHint")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
