import { ArrowUpLeft, Images } from "lucide-react";
import { Link } from "react-router";

import { DashboardFileVisual } from "./dashboard-file-visual";

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
    <section aria-labelledby="files-heading" className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-fuchsia-300">
            {t("pages.root.dashboard.files.eyebrow")}
          </p>
          <h2
            id="files-heading"
            className="mt-1 text-lg font-semibold text-white"
          >
            {t("pages.root.dashboard.files.title")}
          </h2>
        </div>
        <Link
          to={APP_ROUTES_KEY.gallery.path}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
        >
          {t("pages.root.dashboard.actions.viewAll")}
          <ArrowUpLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
      {files.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.slice(0, 6).map((file, index) => (
            <Link
              key={file.uuid}
              to={APP_ROUTES_KEY.gallery.path}
              className={cn(
                "group relative min-w-0 overflow-hidden rounded-2xl border border-white/8 bg-[#101116] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/25 hover:shadow-fuchsia-950/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400",
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 sm:p-4">
                <Images className="h-4 w-4 shrink-0 text-fuchsia-300" />
                <span className="truncate text-xs font-medium text-white sm:text-sm">
                  {file.file_name || t("common.emptyTitle")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
          {t("pages.root.dashboard.files.empty")}
        </div>
      )}
    </section>
  );
}
