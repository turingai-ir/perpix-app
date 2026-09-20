import { ArrowUpLeft, Images } from "lucide-react";
import { Link } from "react-router";

import { DashboardFileVisual } from "./dashboard-file-visual";
import styles from "../dashboard.module.css";

import { Skeleton } from "@/components/ui/skeleton";
import type { FilePreviewUrls, UserFileItem } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardFilesProps {
  files: readonly UserFileItem[];
  isLoading: boolean;
  previews: Record<string, FilePreviewUrls>;
}

export function DashboardFiles({
  files,
  isLoading,
  previews,
}: DashboardFilesProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return (
    <section aria-labelledby="files-heading" className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>
            {t("pages.root.dashboard.files.eyebrow")}
          </p>
          <h2 id="files-heading" className={styles.sectionTitle}>
            {t("pages.root.dashboard.files.title")}
          </h2>
        </div>
        <Link to={APP_ROUTES_KEY.gallery.path} className={styles.sectionLink}>
          {t("pages.root.dashboard.actions.viewAll")}
          <ArrowUpLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
      {files.length ? (
        <div className={styles.fileGrid}>
          {files.slice(0, 6).map((file, index) => (
            <Link
              key={file.uuid}
              to={APP_ROUTES_KEY.gallery.path}
              className={cn(
                `group ${styles.fileCard}`,
                index === 0 && "sm:col-span-2",
              )}
            >
              <div
                className={cn(
                  styles.fileVisual,
                  index === 0 && "sm:aspect-[2/1]",
                )}
              >
                <DashboardFileVisual
                  file={file}
                  preview={file.uuid ? previews[file.uuid] : undefined}
                />
              </div>
              <div className={styles.fileScrim} />
              <div className={styles.fileMeta}>
                <Images className="h-4 w-4 shrink-0 text-fuchsia-300" />
                <span className="truncate text-xs font-medium text-white sm:text-sm">
                  {file.file_name || t("common.emptyTitle")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {t("pages.root.dashboard.files.empty")}
        </div>
      )}
    </section>
  );
}
