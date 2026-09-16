import { AlertCircle, LoaderCircle } from "lucide-react";
import { useCallback, useRef, type FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileManagerUploadStatus,
  useFilePreview,
} from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
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
  presentation?: "default" | "composer";
  index?: number;
}

interface LocalMediaPreviewItemProps {
  disabled: boolean;
  item: LocalMediaItem;
  onDeleteClick?: (fileName: string) => void;
  previewType: MediaPreviewType;
  presentation?: "default" | "composer";
}

export const MediaPreviewItem: FC<MediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  presentation = "default",
  index,
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
        "group bg-background relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        presentation === "composer" ? "size-20" : "size-24",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && previewUrl && previewType === "image" ? (
        presentation === "composer" ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="focus-visible:ring-primary/60 size-full overflow-hidden rounded-lg outline-none focus-visible:ring-2"
                aria-label={t("features.mediaUploader.composer.preview", {
                  index,
                })}
              >
                <img
                  src={previewUrl}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl p-3 sm:p-4">
              <DialogTitle className="sr-only">
                {t("features.mediaUploader.composer.preview", { index })}
              </DialogTitle>
              <img
                src={previewUrl}
                alt={t("features.mediaUploader.composer.preview", { index })}
                className="mx-auto max-h-[75dvh] max-w-full rounded-lg object-contain"
              />
            </DialogContent>
          </Dialog>
        ) : (
          <img
            src={previewUrl}
            alt="Uploaded item"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )
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

      {canDelete && (
        <DeleteButton
          onClick={handleDeleteClick}
          label={
            presentation === "composer"
              ? t("features.mediaUploader.composer.remove", { index })
              : undefined
          }
        />
      )}
    </div>
  );
};

export const LocalMediaPreviewItem: FC<LocalMediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  presentation = "default",
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
        "group bg-background relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        presentation === "composer" ? "size-20" : "size-24",
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
