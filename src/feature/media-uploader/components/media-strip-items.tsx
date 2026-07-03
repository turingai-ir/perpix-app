import { AlertCircle, LoaderCircle } from "lucide-react";
import { useCallback, useRef, type FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  FileManagerUploadStatus,
  useFilePreview,
} from "@/feature/file-manager";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

import { AudioPreviewButton } from "./audio-preview-button";
import {
  DeleteButton,
  EmptyMediaPreview,
  ErrorPreview,
} from "./media-preview-parts";
import { VideoPreviewButton } from "./video-preview-button";
import type {
  LocalMediaItem,
  MediaPreviewType,
  UploadedMediaItem,
} from "../types";

interface MediaPreviewItemProps {
  disabled: boolean;
  item: UploadedMediaItem;
  onDeleteClick?: (id: string) => void;
  previewType: MediaPreviewType;
}

interface LocalMediaPreviewItemProps {
  disabled: boolean;
  item: LocalMediaItem;
  onDeleteClick?: (fileName: string) => void;
  previewType: MediaPreviewType;
}

export const MediaPreviewItem: FC<MediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(item.id);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const previewUrl = getFilePreviewState.data?.preview_url;
  const canDelete = !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(item.id);
  };

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && previewUrl && previewType === "image" ? (
        <img
          src={previewUrl}
          alt="Uploaded item"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : null}

      {!isError && previewUrl && previewType === "video" ? (
        <VideoPreviewButton src={previewUrl} />
      ) : null}

      {!isError && previewUrl && previewType === "audio" ? (
        <AudioPreviewButton src={previewUrl} />
      ) : null}

      {isError && (
        <ErrorPreview label={t("common.error")} className="text-destructive" />
      )}

      {!isPreviewLoading && !isError && !previewUrl && (
        <EmptyMediaPreview previewType={previewType} />
      )}

      {isPreviewLoading && !previewUrl && (
        <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
      )}

      {canDelete && <DeleteButton onClick={handleDeleteClick} />}
    </div>
  );
};

export const LocalMediaPreviewItem: FC<LocalMediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const imageUrlRef = useRef<string | null>(null);
  const isUploading = item.status === FileManagerUploadStatus.UPLOADING;
  const isError = item.status === FileManagerUploadStatus.FAILED;
  const canDelete = isError && !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(item.file.name);
  };

  const revokeImageUrl = useCallback(() => {
    if (!imageUrlRef.current) return;

    URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
  }, []);

  const setImageElement = useCallback(
    (element: HTMLImageElement | null) => {
      revokeImageUrl();

      if (!element) return;

      const objectUrl = URL.createObjectURL(item.file);

      imageUrlRef.current = objectUrl;
      element.src = objectUrl;
    },
    [item.file, revokeImageUrl],
  );

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {previewType === "image" ? (
        <img
          ref={setImageElement}
          alt={item.file.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : null}

      {previewType === "video" ? <VideoPreviewButton file={item.file} /> : null}

      {previewType === "audio" ? <AudioPreviewButton file={item.file} /> : null}

      {isUploading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/45 text-white backdrop-blur-[1px]">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span className="text-[10px] font-medium whitespace-nowrap">
            {t("common.uploading")}
          </span>
        </div>
      )}

      {isError && (
        <div className="bg-background/85 absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 p-2 text-center backdrop-blur-[1px]">
          <AlertCircle className="text-destructive h-5 w-5" />
          <span className="text-destructive text-[10px] whitespace-normal">
            {t("common.error")}
          </span>
        </div>
      )}

      {canDelete && (
        <DeleteButton onClick={handleDeleteClick} variant="strong" />
      )}
    </div>
  );
};
