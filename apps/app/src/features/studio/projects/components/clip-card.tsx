import type { FC } from "react";
import { AlertCircle, Check, Loader2, RotateCw, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { formatDuration, type Clip } from "../model/clips";
import type { TranscriptSummary } from "../model/transcript";

interface ClipCardProps {
  clip: Clip;
  index: number;
  transcript: TranscriptSummary | undefined;
  requesting: boolean;
  loadingStatus: boolean;
  onReloadStatus?: () => void;
  onRetry: (clip: Clip) => void;
  onChooseLanguage: (replaceUuid?: string) => void;
  onRemove: (clip: Clip) => void;
}

const SubtitleStatus: FC<{
  transcript: TranscriptSummary | undefined;
  requesting: boolean;
  loadingStatus: boolean;
  onReloadStatus?: () => void;
  onRetry: () => void;
}> = ({ transcript, requesting, loadingStatus, onReloadStatus, onRetry }) => {
  const { t } = useAppTranslate();

  if (!requesting && transcript?.status === "COMPLETED") {
    return (
      <span className="flex items-center gap-1 text-xs text-success">
        <Check className="size-3.5" aria-hidden />
        {t("features.studio.clips.subtitle.ready")}
      </span>
    );
  }
  const processing = requesting || transcript?.status === "PROCESSING";
  if (processing || loadingStatus) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
        {t(
          processing
            ? "features.studio.clips.subtitle.processing"
            : "features.studio.clips.subtitle.checking",
        )}
      </span>
    );
  }
  const failed = transcript?.status === "FAILED";
  const status = onReloadStatus
    ? "statusUnavailable"
    : failed
      ? "failed"
      : "notStarted";
  const action = onReloadStatus || failed ? "retry" : "request";
  return (
    <span className="flex items-center gap-1 text-xs">
      {(failed || onReloadStatus) && (
        <AlertCircle className="size-3.5 text-destructive" aria-hidden />
      )}
      {t(`features.studio.clips.subtitle.${status}`)}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={onReloadStatus ?? onRetry}
      >
        <RotateCw className="size-3" aria-hidden />
        {t(`features.studio.clips.subtitle.${action}`)}
      </Button>
    </span>
  );
};

export const ClipCard: FC<ClipCardProps> = ({
  clip,
  index,
  transcript,
  requesting,
  loadingStatus,
  onReloadStatus,
  onRetry,
  onChooseLanguage,
  onRemove,
}) => {
  const { t } = useAppTranslate();
  return (
    <li className="flex items-center gap-3 rounded-2xl border bg-card p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
        {(index + 1).toLocaleString("fa-IR")}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-semibold">{clip.name}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{formatDuration(clip.duration_ms)}</span>
          <SubtitleStatus
            transcript={transcript}
            requesting={requesting}
            loadingStatus={loadingStatus}
            onReloadStatus={onReloadStatus}
            onRetry={() => onRetry(clip)}
          />
          {!requesting &&
            !loadingStatus &&
            !onReloadStatus &&
            transcript?.status !== "PROCESSING" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onChooseLanguage(
                    transcript?.status === "COMPLETED"
                      ? transcript.uuid
                      : undefined,
                  )
                }
              >
                {t("features.studio.clips.language.title")}
              </Button>
            )}
        </span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 rounded-full"
        aria-label={t("features.studio.clips.remove", { name: clip.name })}
        onClick={() => onRemove(clip)}
      >
        <Trash2 className="size-5" />
      </Button>
    </li>
  );
};
