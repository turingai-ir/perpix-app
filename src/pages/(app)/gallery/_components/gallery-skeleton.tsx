import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../gallery.module.css";

export const GallerySkeleton = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("features.mediaUploader.loadingFiles")}
    >
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            data-slot="gallery-skeleton-card"
            className={`${styles.card} ${styles.skeletonCard}`}
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none motion-reduce:animate-none" />
            <div className={styles.cardBody}>
              <div className="w-1/2 space-y-2">
                <Skeleton className="h-3 w-full animate-none" />
                <Skeleton className="h-2.5 w-2/3 animate-none" />
              </div>
              <div className="h-11 w-[5.5rem] shrink-0" />
            </div>
            <div className={styles.fileFacts}>
              <Skeleton className="h-2.5 w-2/5 animate-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
