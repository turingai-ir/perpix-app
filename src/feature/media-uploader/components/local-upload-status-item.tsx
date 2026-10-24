import { AlertCircle, Check, LoaderCircle } from "lucide-react";
import type { FC } from "react";

import { FileManagerUploadStatus } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import type { LocalMediaItem } from "../types";

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
        "flex w-72 max-w-full min-w-0 flex-wrap items-center gap-2 rounded-lg border px-2 py-1.5",
        isError && "border-destructive/30 bg-destructive/5",
      )}
    >
      {isUploading ? (
        <LoaderCircle className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />
      ) : isError ? (
        <AlertCircle className="text-destructive h-4 w-4 shrink-0" />
      ) : (
        <Check className="text-primary h-4 w-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1 truncate text-xs">{item.file.name}</span>
      <span
        className={cn(
          "text-muted-foreground text-xs",
          isError && "text-destructive order-last basis-full wrap-break-word",
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
          className="shrink-0 text-xs underline"
          onClick={() => onRetry(item.file)}
        >
          {t("features.fileManager.facts.retry")}
        </button>
      ) : null}
    </div>
  );
};
