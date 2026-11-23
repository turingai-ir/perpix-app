import { AlertCircle, Check, LoaderCircle } from "lucide-react";
import type { FC } from "react";

import { FileManagerUploadStatus } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { APP_I18_KEYS } from "@/shared/i18n";

import type { LocalMediaItem } from "../model/types";

export const LocalUploadStatusItem: FC<{
  item: LocalMediaItem;
  onRetry?: (file: File) => void;
}> = ({ item, onRetry }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isUploading = item.status === FileManagerUploadStatus.UPLOADING;
  const isError = item.status === FileManagerUploadStatus.FAILED;

  return (
    <div
      className={cn(
        "flex w-72 max-w-full min-w-0 flex-wrap items-center gap-2 rounded-lg border px-3 py-2 motion-safe:transition-colors motion-safe:duration-150",
        isError && "border-destructive/30 bg-destructive/5",
      )}
    >
      {isUploading ? (
        <LoaderCircle
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground motion-safe:animate-spin"
        />
      ) : isError ? (
        <AlertCircle
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-destructive"
        />
      ) : (
        <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
      )}
      <span
        className="min-w-0 flex-1 truncate text-xs"
        dir="auto"
        title={item.file.name}
      >
        {item.file.name}
      </span>
      <span
        role="status"
        aria-live="polite"
        className={cn(
          "text-xs text-muted-foreground",
          isError && "order-last basis-full wrap-break-word text-destructive",
        )}
      >
        {isUploading
          ? t("common.uploading")
          : isError
            ? t(item.errorKey ?? "common.error")
            : t("common.uploaded")}
      </span>
      {isError &&
      onRetry &&
      item.errorKey !== "features.fileManager.errors.unknownUpload" ? (
        <button
          type="button"
          className="flex min-h-11 shrink-0 items-center rounded-md px-2 text-xs underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onRetry(item.file)}
        >
          {t("features.fileManager.facts.retry")}
        </button>
      ) : null}
    </div>
  );
};
