import { useRef } from "react";
import { Check, Clapperboard, Download, Expand, RefreshCw } from "lucide-react";

import { useVideoOutput } from "./use-video-output";
import { VideoOutputDialog } from "./video-output-dialog";
import styles from "./video-output.module.css";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface Props {
  fileId: string;
  index?: number;
}

export function VideoOutputItem({ fileId, index = 0 }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const {
    download,
    downloadUrl,
    hasMediaError,
    isLoading,
    isRefreshing,
    mediaKey,
    onMediaError,
    previewUrl,
    retry,
  } = useVideoOutput(fileId);
  const player = useRef<HTMLVideoElement>(null);
  const label = `${t("common.video")} ${index + 1}`;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) player.current?.pause();
      }}
    >
      <div role="group" aria-label={label} className={styles.output}>
        <div className={styles.header}>
          <span className={styles.title}>
            <Clapperboard aria-hidden="true" />
            {label}
          </span>
          {previewUrl && !hasMediaError ? (
            <span className={styles.badge}>
              <Check aria-hidden="true" />
              {t("pages.generation.video.output.ready")}
            </span>
          ) : null}
        </div>
        <div className={styles.screen}>
          {previewUrl && !hasMediaError ? (
            // Generated videos do not include a captions track in the file contract.
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              key={mediaKey}
              ref={player}
              onError={onMediaError}
              aria-label={label}
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
            />
          ) : null}
          {isLoading ? (
            <Skeleton className="h-48 max-h-[55dvh] w-full" />
          ) : null}
          {!isLoading && (!previewUrl || hasMediaError) ? (
            <p role="status" className={styles.error}>
              {t("pages.generation.video.output.loadError")}
            </p>
          ) : null}
        </div>
        <div className={styles.footer}>
          {previewUrl && !hasMediaError ? (
            <p className={styles.hint}>
              {t("pages.generation.video.output.hint")}
            </p>
          ) : null}
          <div className={styles.actions}>
            <Button
              type="button"
              className="min-h-11 gap-2"
              disabled={!downloadUrl}
              onClick={download}
            >
              <Download aria-hidden="true" />
              {t("common.download")}
            </Button>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 gap-2"
                disabled={!previewUrl}
              >
                <Expand aria-hidden="true" />
                {t("pages.generation.video.output.preview")}
              </Button>
            </DialogTrigger>
            {!isLoading && (!previewUrl || hasMediaError) ? (
              <Button
                type="button"
                variant="outline"
                className="min-h-11 gap-2"
                disabled={isRefreshing}
                onClick={retry}
              >
                <RefreshCw aria-hidden="true" />
                {t("pages.generation.video.output.retry")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <VideoOutputDialog
        label={label}
        previewUrl={previewUrl}
        downloadUrl={downloadUrl}
        onDownload={download}
        hasMediaError={hasMediaError}
        isRefreshing={isRefreshing}
        mediaKey={mediaKey}
        onMediaError={onMediaError}
        onRetry={retry}
      />
    </Dialog>
  );
}
