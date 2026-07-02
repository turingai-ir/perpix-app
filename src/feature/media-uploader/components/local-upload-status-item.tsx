import { AlertCircle, Check, LoaderCircle } from "lucide-react";
import type { FC } from "react";

import { FileManagerUploadStatus } from "@/feature/file-manager";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import type { LocalMediaItem } from "../types";

export const LocalUploadStatusItem: FC<{ item: LocalMediaItem }> = ({
  item,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isUploading = item.status === FileManagerUploadStatus.UPLOADING;
  const isError = item.status === FileManagerUploadStatus.FAILED;

  return (
    <div
      className={cn(
        "flex max-w-56 min-w-0 items-center gap-2 rounded-lg border px-2 py-1.5",
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
      <span className="min-w-0 truncate text-xs">{item.file.name}</span>
      <span
        className={cn(
          "text-muted-foreground shrink-0 text-[10px]",
          isError && "text-destructive",
        )}
      >
        {isUploading
          ? t("common.uploading")
          : isError
            ? t("common.error")
            : t("common.uploaded")}
      </span>
    </div>
  );
};
