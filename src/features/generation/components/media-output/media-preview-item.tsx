import type { FC } from "react";
import { Download, Image as ImageIcon, Video } from "lucide-react";
import { useNavigate } from "react-router";

import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { APP_I18_KEYS } from "@/shared/i18n";
import { MediaUnavailableState } from "./media-unavailable-state";
import { useMediaPreview } from "../../hooks/use-media-preview";

type MediaType = "image" | "video";

interface MediaPreviewItemProps {
  alt?: string;
  aspectRatio?: string;
  fileId: string;
  fit?: "cover" | "contain";
  index?: number;
  type: MediaType;
  compact?: boolean;
  showRetentionInfo?: boolean;
  onMissingChange?: (missing: boolean) => void;
  onMissingAction?: () => void;
  missingActionLabel?: string;
}

export const MediaPreviewItem: FC<MediaPreviewItemProps> = ({
  alt,
  aspectRatio = "1 / 1",
  fileId,
  fit = "cover",
  index,
  type,
  compact = false,
  showRetentionInfo = false,
  onMissingChange,
  onMissingAction,
  missingActionLabel,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const {
    downloadUrl,
    handleDownload,
    isDownloading,
    isError,
    isMissing,
    isPreviewLoading,
    isRefreshing,
    markMediaFailed,
    mediaUrl,
    retryPreview,
  } = useMediaPreview(fileId, onMissingChange);
  const mediaLabel = type === "image" ? t("common.image") : t("common.video");
  const conciseDescription = alt?.trim();
  const previewLabel =
    index === undefined && conciseDescription && conciseDescription.length <= 80
      ? t("common.mediaPreview.described", {
          mediaType: mediaLabel,
          description: conciseDescription,
        })
      : t("common.mediaPreview.indexed", {
          mediaType: mediaLabel,
          index: (index ?? 0) + 1,
        });
  return (
    <Dialog>
      <div
        className={cn(
          "bg-background flex w-full items-center justify-center overflow-hidden rounded-lg border",
          isError && !isMissing && "border-destructive/50 bg-destructive/5",
        )}
        style={{ aspectRatio }}
      >
        {!isError && mediaUrl ? (
          <DialogTrigger
            render={
              <button
                type="button"
                className="group focus-visible:ring-ring/50 relative h-full w-full cursor-zoom-in overflow-hidden text-start outline-none focus-visible:ring-3"
                aria-label={previewLabel}
              />
            }
          >
            {type === "image" ? (
              <img
                className={cn(
                  "h-full w-full motion-safe:transition-transform motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02]",
                  fit === "contain" ? "object-contain" : "object-cover",
                )}
                src={mediaUrl}
                alt={alt ?? `${mediaLabel} ${(index ?? 0) + 1}`}
                onError={() => markMediaFailed(mediaUrl)}
              />
            ) : (
              <>
                {}
                <video
                  className={cn(
                    "h-full w-full motion-safe:transition-transform motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02]",
                    fit === "contain" ? "object-contain" : "object-cover",
                  )}
                  src={mediaUrl}
                  preload="metadata"
                  muted
                  onError={() => markMediaFailed(mediaUrl)}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                  <Video className="h-8 w-8 drop-shadow" />
                </span>
              </>
            )}
          </DialogTrigger>
        ) : null}

        {isError && (
          <MediaUnavailableState
            kind={isMissing ? "missing" : "temporary"}
            compact={compact}
            showRetentionInfo={showRetentionInfo}
            onAction={onMissingAction}
            actionLabel={missingActionLabel}
            onRetry={() => void retryPreview()}
            isRefreshing={isRefreshing}
          />
        )}

        {!isPreviewLoading && !isError && !mediaUrl && (
          <EmptyMediaPreview type={type} />
        )}

        {isPreviewLoading && !mediaUrl && (
          <Skeleton className="h-full w-full overflow-hidden rounded-lg motion-reduce:animate-none" />
        )}
      </div>

      <DialogContent
        className="bg-background/95 inset-s-0 top-0 flex h-dvh max-h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-3 ring-0 sm:max-w-none rtl:translate-x-0"
        showCloseButton
      >
        <DialogTitle className="sr-only">{mediaLabel}</DialogTitle>
        <DialogDescription className="sr-only">{mediaLabel}</DialogDescription>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          {isError ? (
            <MediaUnavailableState
              kind={isMissing ? "missing" : "temporary"}
              showRetentionInfo={showRetentionInfo}
              onAction={onMissingAction}
              actionLabel={missingActionLabel}
              onRetry={() => void retryPreview()}
              isRefreshing={isRefreshing}
            />
          ) : type === "image" ? (
            <img
              className="max-h-full max-w-full rounded-lg object-contain"
              src={mediaUrl}
              alt={alt ?? `${mediaLabel} ${(index ?? 0) + 1}`}
              onError={() => markMediaFailed(mediaUrl)}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className="max-h-full max-w-full rounded-lg"
              src={mediaUrl}
              controls
              autoPlay
              onError={() => markMediaFailed(mediaUrl)}
            />
          )}
        </div>

        {!isError && (
          <div className="flex w-full shrink-0 items-center justify-center gap-3 pb-2">
            {type === "image" && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="h-11 gap-2 px-5 text-base"
                onClick={() => navigate(`/editor/${fileId}`)}
              >
                <ImageIcon className="h-4 w-4 text-emerald-500" />
                <span>{t("pages.editor.edit")}</span>
              </Button>
            )}
            <a
              href={downloadUrl ?? "#"}
              download
              aria-disabled={!downloadUrl || isDownloading}
              onClick={handleDownload}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-11 px-5 text-base",
                cn(
                  (!downloadUrl || isDownloading) &&
                    "pointer-events-none opacity-50",
                ),
              )}
            >
              <Download />
              {t("common.download")}
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const EmptyMediaPreview: FC<{ type: MediaType }> = ({ type }) => {
  const Icon = type === "image" ? ImageIcon : Video;

  return (
    <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-1">
      <Icon className="h-6 w-6 opacity-40" />
    </div>
  );
};
