import { ArrowUpLeft, Images } from "lucide-react";
import { Link } from "react-router";

import { DashboardFileVisual } from "./dashboard-file-visual";
import {
  DASHBOARD_FILE_CARD_CLASS,
  EMPTY_STATE_CLASS,
  SECTION_LINK_CLASS,
} from "../model/dashboard-styles";
import { DashboardSectionHeader } from "./dashboard-parts";

import { Skeleton } from "@/shared/ui/skeleton";
import type { FilePreviewUrls, UserFileItem } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";

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
    <section aria-labelledby="files-heading" className="min-w-0">
      <DashboardSectionHeader
        eyebrow={t("pages.root.dashboard.files.eyebrow")}
        title={t("pages.root.dashboard.files.title")}
        titleId="files-heading"
        action={
          <Link to={APP_ROUTES_KEY.gallery.path} className={SECTION_LINK_CLASS}>
            {t("pages.root.dashboard.actions.viewAll")}
            <ArrowUpLeft className="size-3.5" />
          </Link>
        }
      />
      {files.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.slice(0, 6).map((file, index) => (
            <Link
              key={file.uuid}
              to={APP_ROUTES_KEY.gallery.path}
              className={cn(
                DASHBOARD_FILE_CARD_CLASS,
                index === 0 && "sm:col-span-2",
              )}
            >
              <div
                className={cn(
                  "aspect-[4/3] overflow-hidden bg-black",
                  index === 0 && "sm:aspect-[2/1]",
                )}
              >
                <DashboardFileVisual
                  file={file}
                  preview={file.uuid ? previews[file.uuid] : undefined}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-linear-to-t from-black/94 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex min-w-0 items-center gap-2 p-3 sm:p-4">
                <Images className="text-accent-pink size-4 shrink-0" />
                <span className="truncate text-xs font-medium text-white sm:text-sm">
                  {file.file_name || t("common.emptyTitle")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={EMPTY_STATE_CLASS}>
          {t("pages.root.dashboard.files.empty")}
        </div>
      )}
    </section>
  );
}
