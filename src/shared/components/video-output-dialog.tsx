import { Download, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import {
  VideoOutputFooter,
  VideoOutputHeader,
  VideoOutputHint,
  VideoOutputScreen,
} from "./video-output-parts";
import { MediaUnavailableState } from "./media-unavailable-state";

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
      className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl"
    >
      <VideoOutputHeader className="shrink-0">
        <DialogTitle>{label}</DialogTitle>
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              aria-label={t("pages.generation.video.output.close")}
            />
          }
        >
          <X aria-hidden="true" />
        </DialogClose>
      </VideoOutputHeader>
      <DialogDescription className="sr-only">
        {t("pages.generation.video.output.preview")}
      </DialogDescription>
      <VideoOutputScreen inDialog unavailable={!previewUrl || hasMediaError}>
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
      </VideoOutputScreen>
      {!isMissing && (
        <VideoOutputFooter>
          <VideoOutputHint>
            {t("pages.generation.video.output.screeningHint")}
          </VideoOutputHint>
          <Button
            type="button"
            className="min-h-11 shrink-0 gap-2 self-center"
            disabled={!downloadUrl}
            onClick={onDownload}
          >
            <Download aria-hidden="true" />
            {t("common.download")}
          </Button>
        </VideoOutputFooter>
      )}
    </DialogContent>
  );
}
