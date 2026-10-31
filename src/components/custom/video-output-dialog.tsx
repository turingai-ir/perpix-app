import { Download, X } from "lucide-react";

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
import { MediaUnavailableState } from "./media-unavailable-state";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  previewUrl?: string;
  downloadUrl?: string;
  onDownload: () => void;
  hasMediaError: boolean;
  isMissing: boolean;
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
  isMissing,
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
      <div
        className={cn(
          styles.screen,
          (!previewUrl || hasMediaError) && styles.unavailableScreen,
        )}
      >
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
          <MediaUnavailableState
            kind={isMissing ? "missing" : "temporary"}
            showRetentionInfo
            actionTo="/generation/video"
            actionLabel={t("pages.generation.mediaUnavailable.newVideo")}
            onRetry={onRetry}
            isRefreshing={isRefreshing}
          />
        )}
      </div>
      {!isMissing && (
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
      )}
    </DialogContent>
  );
}
