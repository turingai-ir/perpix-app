import { AlertCircle, RefreshCw } from "lucide-react";
import type { FC } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import { UserFileCard } from "./user-file-card";
import type { MediaPreviewType } from "../types";
import type { UserFileWithUuid } from "../utils";

interface UserFilesSectionProps {
  isError: boolean;
  isFetching: boolean;
  isFetchingMore: boolean;
  isLoading: boolean;
  hasMore: boolean;
  previewType: MediaPreviewType;
  selectedIdsSet: ReadonlySet<string>;
  toggleableIdsSet?: ReadonlySet<string>;
  userFiles: readonly UserFileWithUuid[];
  onFetchMore: () => void;
  onRefresh: () => void;
  onSelect: (fileId: string) => void;
}

export const UserFilesSection: FC<UserFilesSectionProps> = ({
  isError,
  isFetching,
  isFetchingMore,
  isLoading,
  hasMore,
  previewType,
  selectedIdsSet,
  toggleableIdsSet,
  userFiles,
  onFetchMore,
  onRefresh,
  onSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
    offset: 240,
    disabled: !hasMore || isError,
    loading: isLoading || isFetchingMore,
    onTrigger: onFetchMore,
  });

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          {t("features.mediaUploader.userFiles")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t("features.fileManager.details.refresh")}
          disabled={isFetching}
          onClick={onRefresh}
        >
          <RefreshCw
            aria-hidden="true"
            className={cn(isFetching && "motion-safe:animate-spin")}
          />
        </Button>
      </div>

      <div className="rounded-lg border">
        {isLoading ? (
          <div
            role="status"
            aria-busy="true"
            aria-label={t("features.mediaUploader.loadingFiles")}
          >
            <UserFilesSkeleton />
          </div>
        ) : (
          <div className="flex flex-col">
            {isError && (
              <div
                role="alert"
                className="text-destructive flex items-center gap-2 p-3 text-sm"
              >
                <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
                <span>
                  {t(
                    userFiles.length
                      ? "features.fileManager.details.refreshFailed"
                      : "features.mediaUploader.loadFailed",
                  )}
                </span>
              </div>
            )}
            {userFiles.length === 0 && !isError ? (
              <div className="text-muted-foreground flex min-h-40 items-center justify-center p-4 text-center text-sm">
                {t("features.mediaUploader.emptyFiles")}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4">
                {userFiles.map((file) => (
                  <UserFileCard
                    key={file.uuid}
                    file={file}
                    isSelected={selectedIdsSet.has(file.uuid)}
                    isSelectionRemovable={toggleableIdsSet?.has(file.uuid)}
                    previewType={previewType}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
            {(hasMore || isFetchingMore) && !isError && (
              <div
                ref={loadMoreRef}
                className="text-muted-foreground flex min-h-12 items-center justify-center p-3 text-xs"
              >
                {isFetchingMore ? t("features.mediaUploader.loadingMore") : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserFilesSkeleton = () => (
  <div
    aria-hidden="true"
    className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4"
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        data-slot="picker-skeleton-card"
        className="min-w-0 overflow-hidden rounded-lg border"
      >
        <Skeleton className="aspect-square w-full rounded-none motion-reduce:animate-none" />
        <div className="space-y-2 p-2">
          <Skeleton className="h-3 w-4/5 animate-none" />
          <Skeleton className="h-2.5 w-2/5 animate-none" />
          <Skeleton className="h-2.5 w-3/5 animate-none" />
        </div>
      </div>
    ))}
  </div>
);
