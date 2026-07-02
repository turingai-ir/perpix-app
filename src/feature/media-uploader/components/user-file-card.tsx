import { Check, FileAudio, FileVideo, Image as ImageIcon } from "lucide-react";
import type { FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useFilePreview } from "@/feature/file-manager";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import type { MediaPreviewType } from "../types";
import { formatFileSize, type UserFileWithUuid } from "../utils";

interface UserFileCardProps {
  file: UserFileWithUuid;
  isSelected: boolean;
  previewType: MediaPreviewType;
  onSelect: (fileId: string) => void;
}

export const UserFileCard: FC<UserFileCardProps> = ({
  file,
  isSelected,
  previewType,
  onSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(file.uuid);
  const previewUrl = getFilePreviewState.data?.preview_url;
  const isPreviewLoading = getFilePreviewState.isPending;
  const isPreviewError = getFilePreviewState.isError;
  const fileName = file.file_name || t("common.emptyTitle");

  return (
    <button
      type="button"
      className={cn(
        "group focus-visible:ring-ring/50 bg-background relative flex min-w-0 flex-col overflow-hidden rounded-lg border text-start transition-colors outline-none focus-visible:ring-3 disabled:cursor-default",
        isSelected
          ? "border-primary ring-primary/20 ring-2"
          : "hover:border-primary/40",
      )}
      disabled={isSelected}
      onClick={() => onSelect(file.uuid)}
    >
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {!isPreviewError && previewUrl && previewType === "image" ? (
          <img
            src={previewUrl}
            alt={fileName}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : null}

        {!isPreviewError && previewUrl && previewType === "video" ? (
          <video
            src={previewUrl}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            preload="metadata"
            muted
          />
        ) : null}

        {!isPreviewError && previewUrl && previewType === "audio" ? (
          <div className="flex h-full w-full items-center justify-center">
            <FileAudio className="text-muted-foreground h-8 w-8" />
          </div>
        ) : null}

        {isPreviewLoading && !previewUrl && (
          <Skeleton className="h-full w-full rounded-none" />
        )}

        {(isPreviewError || (!isPreviewLoading && !previewUrl)) && (
          <UserFileFallback previewType={previewType} />
        )}

        {isSelected && (
          <span className="bg-primary text-primary-foreground absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
            <Check className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 p-2">
        <span className="truncate text-xs font-medium">{fileName}</span>
        <span className="text-muted-foreground truncate text-[10px]">
          {formatFileSize(file.file_size)}
        </span>
      </div>
    </button>
  );
};

const UserFileFallback: FC<{ previewType: MediaPreviewType }> = ({
  previewType,
}) => {
  const Icon =
    previewType === "video"
      ? FileVideo
      : previewType === "audio"
        ? FileAudio
        : ImageIcon;

  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
      <Icon className="h-8 w-8 opacity-60" />
    </div>
  );
};
