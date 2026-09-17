import { Expand } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FilePreviewUrls } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { GalleryPreview } from "./gallery-preview";
import { GalleryFallback } from "./gallery-fallback";
import { GalleryActions } from "./gallery-actions";
import { getGalleryMediaType } from "../_utils/gallery";
import type { GalleryFile } from "../_utils/types";
import styles from "../gallery.module.css";

interface Props {
  file: GalleryFile;
  index: number;
  compact: boolean;
  isPreviewLoading: boolean;
  previewUrls?: FilePreviewUrls;
  onOpen: (trigger: HTMLButtonElement) => void;
}
export function GalleryFileCard({
  file,
  index,
  compact,
  isPreviewLoading,
  previewUrls,
  onOpen,
}: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const name = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  return (
    <article
      className={`${styles.card} group`}
      style={{ animationDelay: `${Math.min(index, 7) * 35}ms` }}
    >
      <button
        type="button"
        aria-label={name}
        onClick={(event) => onOpen(event.currentTarget)}
        className={`${styles.preview} focus-visible:ring-ring block w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset`}
      >
        {previewUrls?.preview_url && (
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
        <span aria-hidden="true" className={styles.openAffordance}>
          <Expand />
        </span>
        <span aria-hidden="true" className={styles.previewSheen} />
      </button>
      <div className={styles.cardBody}>
        <div className={styles.cardCopy}>
          <h2 className={styles.cardTitle} dir="auto" title={name}>
            {name}
          </h2>
          <span className={styles.mediaType}>
            {t(`pages.gallery.mediaTypes.${mediaType}`)}
          </span>
        </div>
        <GalleryActions file={file} downloadUrl={previewUrls?.download_url} />
      </div>
    </article>
  );
}
