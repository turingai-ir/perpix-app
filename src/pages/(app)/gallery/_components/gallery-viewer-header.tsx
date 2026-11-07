import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type { GalleryMediaType } from "../_utils/types";
import { GalleryViewerBar } from "./gallery-viewer-bar";

export function GalleryViewerHeader({
  name,
  mediaType,
  onClose,
}: {
  name: string;
  mediaType: GalleryMediaType;
  onClose: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <GalleryViewerBar
      as="header"
      className="min-h-16 justify-between gap-4 py-[0.55rem] ps-[0.65rem] pe-4"
    >
      <div className="min-w-0">
        <DialogTitle
          dir="auto"
          className="max-w-[min(64vw,46rem)] overflow-hidden text-[0.9375rem] leading-normal font-[650] text-ellipsis whitespace-nowrap text-white"
        >
          {name}
        </DialogTitle>
        <DialogDescription className="text-[0.6875rem] text-[rgb(244_244_245/55%)]">
          {t(`pages.gallery.mediaTypes.${mediaType}`)}
        </DialogDescription>
      </div>
      <Button
        variant="outline"
        className="size-11 flex-none rounded-full border-white/12 bg-white/6 text-white"
        aria-label={t("pages.gallery.studio.close")}
        onClick={onClose}
      >
        <X />
      </Button>
    </GalleryViewerBar>
  );
}
