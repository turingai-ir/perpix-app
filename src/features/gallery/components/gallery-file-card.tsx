import { Skeleton } from "@/shared/ui/skeleton";
import { FileFacts, useVisibleFilePreview } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { GalleryPreview } from "./gallery-preview";
import { GalleryFallback } from "./gallery-fallback";
import { GalleryActions } from "./gallery-actions";
import { GalleryAffordance } from "./gallery-affordance";
import {
  GalleryCardShell,
  cardBodyClass,
  cardFactsClass,
} from "./gallery-card-shell";
import { cn } from "@/shared/lib/utils";
import { getGalleryMediaType } from "../model/gallery";
import type { GalleryFile } from "../model/types";

interface Props {
  file: GalleryFile;
  index: number;
  compact: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
}
export function GalleryFileCard({ file, index, compact, onOpen }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { ref, visible, getFilePreviewState } = useVisibleFilePreview(
    file.uuid,
  );
  const previewUrls = getFilePreviewState.data;
  const isPreviewLoading = getFilePreviewState.isPending;
  const name = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  return (
    <GalleryCardShell ref={ref} delay={Math.min(index, 7) * 35}>
      <button
        type="button"
        aria-label={name}
        onClick={(event) => onOpen(event.currentTarget)}
        className={cn(
          "focus-visible:ring-ring relative block w-full cursor-zoom-in overflow-hidden bg-[color-mix(in_srgb,var(--muted)_72%,var(--background))] bg-[radial-gradient(circle_at_50%_12%,rgb(255_255_255/6%),transparent_45%)] outline-none focus-visible:ring-2 focus-visible:ring-inset",
          compact ? "aspect-square" : "aspect-[4/3]",
        )}
      >
        {previewUrls?.preview_url && (mediaType !== "video" || visible) && (
          <GalleryPreview
            key={previewUrls.preview_url}
            mediaType={mediaType}
            previewUrl={previewUrls.preview_url}
            fileName={name}
            compact={compact}
            eager={index < 4}
          />
        )}
        {!previewUrls?.preview_url && isPreviewLoading && (
          <Skeleton className="size-full rounded-none motion-reduce:animate-none" />
        )}
        {!previewUrls?.preview_url && !isPreviewLoading && (
          <GalleryFallback mediaType={mediaType} />
        )}
        <GalleryAffordance video={mediaType === "video"} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgb(0_0_0/16%))]"
        />
      </button>
      <div
        className={cn(cardBodyClass, compact && "max-[430px]:justify-center")}
      >
        <div className={cn("min-w-0", compact && "max-[430px]:hidden")}>
          <h2
            className="text-foreground/92 overflow-hidden text-[0.8125rem] leading-[1.65] font-[620] text-ellipsis whitespace-nowrap max-[430px]:max-w-[16ch]"
            dir="auto"
            title={name}
          >
            {name}
          </h2>
          <span className="text-foreground/52 mt-[0.1rem] block text-[0.6875rem] leading-[1.4]">
            {t(`pages.gallery.mediaTypes.${mediaType}`)}
          </span>
        </div>
        <GalleryActions file={file} downloadUrl={previewUrls?.download_url} />
      </div>
      <div className={cn(cardFactsClass, compact && "hidden")}>
        <FileFacts file={file} />
      </div>
    </GalleryCardShell>
  );
}
