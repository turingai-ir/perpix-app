import { Download, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "./video-output.module.css";

interface Props {
  label: string;
  previewUrl?: string;
  downloadUrl?: string;
  onDownload: () => void;
  hasMediaError: boolean;
  isRefreshing: boolean;
  mediaKey: string;
  onMediaError: () => void;
  onRetry: () => void;
}

export function VideoOutputDialog({
  label,
  previewUrl,
  downloadUrl,
  onDownload,
  hasMediaError,
  isRefreshing,
  mediaKey,
  onMediaError,
  onRetry,
}: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <DialogContent
      showCloseButton={false}
      className={`${styles.dialog} flex max-h-[calc(100dvh-2rem)] flex-col sm:max-w-5xl`}
    >
      <div className={`${styles.header} shrink-0`}>
        <DialogTitle>{label}</DialogTitle>
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            aria-label={t("pages.generation.video.output.close")}
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>
      </div>
      <DialogDescription className="sr-only">
        {t("pages.generation.video.output.preview")}
      </DialogDescription>
      <div className={styles.screen}>
        {previewUrl && !hasMediaError ? (
          // Generated video responses do not provide caption tracks.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            key={mediaKey}
            onError={onMediaError}
            aria-label={label}
            src={previewUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-4">
            <p role="status" className={styles.error}>
              {t("pages.generation.video.output.loadError")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 gap-2"
              disabled={isRefreshing}
              onClick={onRetry}
            >
              <RefreshCw aria-hidden="true" />
              {t("pages.generation.video.output.retry")}
            </Button>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <p className={styles.hint}>
          {t("pages.generation.video.output.screeningHint")}
        </p>
        <Button
          type="button"
          className="min-h-11 shrink-0 gap-2 self-center"
          disabled={!downloadUrl}
          onClick={onDownload}
        >
          <Download aria-hidden="true" />
          {t("common.download")}
        </Button>
      </div>
    </DialogContent>
  );
}
