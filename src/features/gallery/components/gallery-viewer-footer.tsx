import {
  ArrowLeft,
  ArrowRight,
  Download,
  Image,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { downloadFile } from "@/shared/utils";
import type { GalleryMediaType } from "../model/types";
import { GalleryViewerBar, viewerControlClass } from "./gallery-viewer-bar";

interface Props {
  fileId: string;
  index: number;
  total: number;
  mediaType: GalleryMediaType;
  zoomed: boolean;
  previewUrl?: string;
  downloadUrl?: string;
  onMove: (delta: number) => void;
  onToggleZoom: () => void;
}

export function GalleryViewerFooter(props: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isImage = props.mediaType === "image";
  return (
    <GalleryViewerBar
      as="footer"
      className="min-h-16 justify-between gap-3 p-[0.45rem] max-md:flex-col max-md:items-stretch max-md:p-2"
    >
      <div className="flex items-center gap-[0.4rem] max-md:justify-center">
        <Button
          variant="outline"
          className={cn(viewerControlClass, "size-11")}
          disabled={props.index === 0}
          aria-label={t("pages.gallery.studio.previous")}
          onClick={() => props.onMove(-1)}
        >
          <ArrowRight className="ltr:rotate-180" />
        </Button>
        <span
          aria-live="polite"
          className="min-w-18 text-center text-xs text-[rgb(244_244_245/62%)] tabular-nums"
        >
          {t("pages.gallery.studio.position", {
            current: props.index + 1,
            total: props.total,
          })}
        </span>
        <Button
          variant="outline"
          className={cn(viewerControlClass, "size-11")}
          disabled={props.index === props.total - 1}
          aria-label={t("pages.gallery.studio.next")}
          onClick={() => props.onMove(1)}
        >
          <ArrowLeft className="ltr:rotate-180" />
        </Button>
      </div>
      <div className="flex items-center gap-[0.4rem] max-md:justify-center max-md:[&>:last-child]:w-full max-md:[&>:last-child]:flex-1">
        {isImage && (
          <Button
            variant="outline"
            className={cn(viewerControlClass, "size-11")}
            disabled={!props.previewUrl}
            aria-pressed={props.zoomed}
            aria-label={t(
              props.zoomed
                ? "pages.gallery.studio.fit"
                : "pages.gallery.studio.zoom",
            )}
            onClick={props.onToggleZoom}
          >
            {props.zoomed ? <ZoomOut /> : <ZoomIn />}
          </Button>
        )}
        <Button
          variant="outline"
          className={cn(viewerControlClass, "size-11")}
          aria-label={t("common.download")}
          disabled={!props.downloadUrl}
          onClick={() => props.downloadUrl && downloadFile(props.downloadUrl)}
        >
          <Download />
        </Button>
        {isImage && (
          <Link
            to={`/editor/${props.fileId}`}
            className={cn(
              buttonVariants(),
              viewerControlClass,
              "h-11 active:scale-[0.97]",
            )}
          >
            <Image />
            {t("pages.editor.edit")}
          </Link>
        )}
      </div>
    </GalleryViewerBar>
  );
}
