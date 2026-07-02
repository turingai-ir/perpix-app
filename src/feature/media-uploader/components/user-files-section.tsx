import { AlertCircle, RefreshCw } from "lucide-react";
import type { FC } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import { UserFileCard } from "./user-file-card";
import type { MediaPreviewType } from "../types";
import type { UserFileWithUuid } from "../utils";

interface UserFilesSectionProps {
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  previewType: MediaPreviewType;
  selectedIdsSet: ReadonlySet<string>;
  userFiles: readonly UserFileWithUuid[];
  onRefresh: () => void;
  onSelect: (fileId: string) => void;
}

export const UserFilesSection: FC<UserFilesSectionProps> = ({
  isError,
  isFetching,
  isLoading,
  previewType,
  selectedIdsSet,
  userFiles,
  onRefresh,
  onSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          {t("features.mediaUploader.userFiles")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isFetching}
          onClick={onRefresh}
        >
          <RefreshCw className={cn(isFetching && "animate-spin")} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      <ScrollArea
        className="min-h-0 flex-1 rounded-lg border"
        viewportClassName="max-h-[360px]"
      >
        {isLoading ? (
          <UserFilesSkeleton />
        ) : isError ? (
          <div className="text-destructive flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center text-sm">
            <AlertCircle className="h-5 w-5" />
            {t("common.error")}
          </div>
        ) : userFiles.length === 0 ? (
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
                previewType={previewType}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const UserFilesSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="aspect-square rounded-lg" />
    ))}
  </div>
);
