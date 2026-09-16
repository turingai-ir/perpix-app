import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";
import {
  UserFilePreview,
  FileDetails,
  canUseFileForGeneration,
  useFileClock,
  useVisibleFilePreview,
} from "@/features/file-manager";

import { formatFileSize, type UserFileWithUuid } from "../utils";

interface UserFileCardProps {
  file: UserFileWithUuid;
  isSelected: boolean;
  isSelectionRemovable?: boolean;
  onSelect: (fileId: string) => void;
}

export const UserFileCard: FC<UserFileCardProps> = ({
  file,
  isSelected,
  isSelectionRemovable = false,
  onSelect,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { ref, visible, getFilePreviewState } = useVisibleFilePreview(
    file.uuid,
  );
  const isPreviewError = getFilePreviewState.isError;
  const isPreviewLoading = getFilePreviewState.isPending;
  const previewUrl = getFilePreviewState.data?.preview_url;
  const fileName = file.file_name || t("common.emptyTitle");
  const now = useFileClock();
  const unavailable = !canUseFileForGeneration(file, now);
  let kind: "image" | "video" | "audio" = "image";
  if (file.content_type.startsWith("video/")) kind = "video";
  if (file.content_type.startsWith("audio/")) kind = "audio";
  kind = file.media_metadata?.kind ?? kind;

  return (
    <button
      ref={ref}
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 220px" }}
      type="button"
      aria-pressed={isSelected}
      className={cn(
        "group focus-visible:ring-ring/50 bg-background relative flex min-w-0 flex-col overflow-hidden rounded-lg border text-start transition-colors outline-none focus-visible:ring-3 disabled:cursor-default",
        isSelected
          ? "border-primary ring-primary/20 ring-2"
          : "hover:border-primary/40",
      )}
      disabled={
        (isSelected && !isSelectionRemovable) || (!isSelected && unavailable)
      }
      onClick={() => onSelect(file.uuid)}
    >
      <UserFilePreview
        kind={kind}
        name={fileName}
        url={previewUrl}
        visible={visible}
        pending={isPreviewLoading}
        error={isPreviewError}
        selected={isSelected}
      />
      <div className="flex min-w-0 flex-col gap-0.5 p-2">
        <span className="truncate text-xs font-medium">{fileName}</span>
        <span className="text-muted-foreground truncate text-[10px]">
          {formatFileSize(file.file_size)}
        </span>
        <FileDetails file={file} forGeneration />
      </div>
    </button>
  );
};
