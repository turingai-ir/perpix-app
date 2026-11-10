import { useRef } from "react";
import { Check, Clapperboard, Download, Expand } from "lucide-react";

import { useVideoOutput } from "../../hooks/use-video-output";
import { VideoOutputDialog } from "./video-output-dialog";
import {
  VideoOutputActions,
  VideoOutputBadge,
  VideoOutputFooter,
  VideoOutputHeader,
  VideoOutputHint,
  VideoOutputScreen,
  VideoOutputTitle,
} from "./video-output-parts";

import { Button } from "@/shared/ui/button";
import { Dialog, DialogTrigger } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { MediaUnavailableState } from "./media-unavailable-state";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

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
    isMissing,
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
      <div
        role="group"
        aria-label={label}
        className="border-border bg-background min-w-0 overflow-hidden rounded-2xl border shadow-[0_12px_30px] shadow-black/10"
      >
        <VideoOutputHeader>
          <VideoOutputTitle>
            <Clapperboard aria-hidden="true" />
            {label}
          </VideoOutputTitle>
          {previewUrl && !hasMediaError ? (
            <VideoOutputBadge>
              <Check aria-hidden="true" />
              {t("pages.generation.video.output.ready")}
            </VideoOutputBadge>
          ) : null}
        </VideoOutputHeader>
        <VideoOutputScreen unavailable={!previewUrl || hasMediaError}>
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
            <Skeleton className="h-48 max-h-[55dvh] w-full motion-reduce:animate-none" />
          ) : null}
          {!isLoading && (!previewUrl || hasMediaError) ? (
            <MediaUnavailableState
              kind={isMissing ? "missing" : "temporary"}
              showRetentionInfo
              actionTo="/generation/video"
              actionLabel={t("pages.generation.mediaUnavailable.newVideo")}
              onRetry={retry}
              isRefreshing={isRefreshing}
            />
          ) : null}
        </VideoOutputScreen>
        {!isMissing && (
          <VideoOutputFooter>
            {previewUrl && !hasMediaError ? (
              <VideoOutputHint>
                {t("pages.generation.video.output.hint")}
              </VideoOutputHint>
            ) : null}
            <VideoOutputActions>
              <Button
                type="button"
                className="min-h-11 gap-2"
                disabled={!downloadUrl}
                onClick={download}
              >
                <Download aria-hidden="true" />
                {t("common.download")}
              </Button>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-11 gap-2"
                    disabled={!previewUrl}
                  />
                }
              >
                <Expand aria-hidden="true" />
                {t("pages.generation.video.output.preview")}
              </DialogTrigger>
            </VideoOutputActions>
          </VideoOutputFooter>
        )}
      </div>
      <VideoOutputDialog
        label={label}
        previewUrl={previewUrl}
        downloadUrl={downloadUrl}
        onDownload={download}
        hasMediaError={hasMediaError}
        isMissing={isMissing}
        isRefreshing={isRefreshing}
        mediaKey={mediaKey}
        onMediaError={onMediaError}
        onRetry={retry}
      />
    </Dialog>
  );
}
