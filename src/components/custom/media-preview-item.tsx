import type { FC } from "react";
import { AlertCircle, Download, Image as ImageIcon, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";
import { useFilePreview } from "@/feature/file-manager";
import { downloadFile } from "@/utils";

type MediaType = "image" | "video";

interface MediaPreviewItemProps {
  fileId: string;
  index?: number;
  type: MediaType;
}

export const MediaPreviewItem: FC<MediaPreviewItemProps> = ({
  fileId,
  index = 0,
  type,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(fileId);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const mediaUrl = getFilePreviewState.data?.presigned_url;
  const mediaLabel =
    type === "image" ? t("common.image") : t("common.video");

  const handleDownload = () => {
    if (!mediaUrl) return;

    downloadFile(mediaUrl, `${type}-${fileId}`);
  };

  return (
    <Dialog>
      <div
        className={cn(
          "bg-background flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border",
          isError && "border-destructive/50 bg-destructive/5",
        )}
      >
        {!isError && mediaUrl ? (
          <DialogTrigger asChild>
            <button
              type="button"
              className="group relative h-full w-full cursor-zoom-in overflow-hidden text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={mediaLabel}
            >
              {type === "image" ? (
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  src={mediaUrl}
                  alt={`img-${index}`}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    src={mediaUrl}
                    preload="metadata"
                    muted
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                    <Video className="h-8 w-8 drop-shadow" />
                  </span>
                </>
              )}
            </button>
          </DialogTrigger>
        ) : null}

        {isError && (
          <ErrorPreview label={t("common.error")} className="text-destructive" />
        )}

        {!isPreviewLoading && !isError && !mediaUrl && (
          <EmptyMediaPreview type={type} />
        )}

        {isPreviewLoading && !mediaUrl && (
          <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
        )}
      </div>

      <DialogContent
        className="top-0 start-0 flex h-dvh max-h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 bg-background/95 p-3 ring-0 rtl:translate-x-0 sm:max-w-none"
        showCloseButton
      >
        <DialogTitle className="sr-only">{mediaLabel}</DialogTitle>
        <DialogDescription className="sr-only">
          {mediaLabel}
        </DialogDescription>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          {type === "image" ? (
            <img
              className="max-h-full max-w-full rounded-lg object-contain"
              src={mediaUrl}
              alt={`img-${index}`}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className="max-h-full max-w-full rounded-lg"
              src={mediaUrl}
              controls
              autoPlay
            />
          )}
        </div>

        <div className="flex w-full shrink-0 items-center justify-center pb-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownload}
            disabled={!mediaUrl}
          >
            <Download />
            {t("common.download")}
          </Button>
        </div>
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

const ErrorPreview: FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <div
    className={cn(
      "flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center",
      className,
    )}
  >
    <AlertCircle className="h-5 w-5" />
    <span className="text-[10px] whitespace-normal">{label}</span>
  </div>
);
