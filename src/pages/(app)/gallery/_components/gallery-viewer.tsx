import { useState } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { useFilePreview } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { getGalleryMediaType } from "../_utils/gallery";
import type { GalleryFile } from "../_utils/types";
import { useViewerSwipe } from "../_hooks/use-viewer-swipe";
import { GalleryViewerFooter } from "./gallery-viewer-footer";
import { GalleryViewerHeader } from "./gallery-viewer-header";
import { GalleryViewerMedia } from "./gallery-viewer-media";

interface Props {
  files: GalleryFile[];
  selected: string;
  onSelect: (uuid: string) => void;
  onClose: () => void;
  trigger: HTMLButtonElement | null;
}

const viewerClass =
  "fixed inset-0 isolate flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-[clamp(10px,2vw,18px)] overflow-hidden rounded-none border-0 bg-[#06070a] bg-[radial-gradient(circle_at_50%_0%,rgb(130_79_255/13%),transparent_32rem),radial-gradient(circle_at_0%_75%,rgb(28_157_238/8%),transparent_28rem)] p-[max(12px,env(safe-area-inset-top))_max(12px,env(safe-area-inset-right))_max(12px,env(safe-area-inset-bottom))_max(12px,env(safe-area-inset-left))] text-[#f7f7fb] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(rgb(255_255_255/2.5%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/2.5%)_1px,transparent_1px)] before:bg-size-[64px_64px] before:opacity-[0.18] before:mask-[radial-gradient(circle_at_center,black,transparent_82%)] before:content-[''] sm:max-w-none max-md:gap-2 max-md:px-2 rtl:translate-x-0 [&_a]:touch-manipulation [&_button]:touch-manipulation";

export function GalleryViewer({
  files,
  selected,
  onSelect,
  onClose,
  trigger,
}: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [zoomed, setZoomed] = useState(false);
  const { getFilePreviewState } = useFilePreview(selected);
  const index = files.findIndex((file) => file.uuid === selected);
  const file = files[index];

  function move(delta: number) {
    const next = files[index + delta];
    if (!next) return;
    setZoomed(false);
    onSelect(next.uuid);
  }

  const swipe = useViewerSwipe({
    disabled: zoomed,
    hasTarget: (delta) => Boolean(files[index + delta]),
    onMove: move,
  });

  if (!file) return null;
  const name = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  const urls = getFilePreviewState.data;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={viewerClass}
        finalFocus={() => trigger ?? false}
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
        <GalleryViewerHeader
          name={name}
          mediaType={mediaType}
          onClose={onClose}
        />
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[clamp(20px,3vw,32px)] border border-white/7 bg-white/[1.5%] bg-[radial-gradient(circle_at_50%_35%,rgb(255_255_255/4%),transparent_54%)] shadow-[inset_0_1px_rgb(255_255_255/5%)] max-md:rounded-[1.25rem]">
          <motion.div
            data-gallery-viewer-media
            data-dragging={swipe.isDragging}
            className="flex size-full cursor-grab items-center justify-center p-[clamp(6px,1.5vw,18px)] opacity-100 transition-opacity duration-120 data-[dragging=true]:cursor-grabbing data-[dragging=true]:opacity-[0.86]"
            {...swipe.handlers}
            style={{
              touchAction: zoomed ? "auto" : "pan-y",
              transform: swipe.transform,
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
        <GalleryViewerFooter
          fileId={selected}
          index={index}
          total={files.length}
          mediaType={mediaType}
          zoomed={zoomed}
          previewUrl={urls?.preview_url}
          downloadUrl={urls?.download_url}
          onMove={move}
          onToggleZoom={() => setZoomed(!zoomed)}
        />
        <p className="hidden text-center text-[0.6875rem] text-[rgb(244_244_245/45%)] md:block">
          {t("pages.gallery.studio.viewerHint")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
