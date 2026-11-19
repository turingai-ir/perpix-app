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
  retrying: boolean;
  onRetry: (clip: Clip) => void;
  onRemove: (clip: Clip) => void;
}

const SubtitleStatus: FC<{
  transcript: TranscriptSummary | undefined;
  retrying: boolean;
  onRetry: () => void;
}> = ({ transcript, retrying, onRetry }) => {
  const { t } = useAppTranslate();

  if (transcript?.status === "COMPLETED") {
    return (
      <span className="text-success flex items-center gap-1 text-xs">
        <Check className="size-3.5" aria-hidden />
        {t("features.studio.clips.subtitle.ready")}
      </span>
    );
  }
  if (transcript?.status === "FAILED") {
    return (
      <span className="text-destructive flex items-center gap-1 text-xs">
        <AlertCircle className="size-3.5" aria-hidden />
        {t("features.studio.clips.subtitle.failed")}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          disabled={retrying}
          onClick={onRetry}
        >
          <RotateCw className="size-3" aria-hidden />
          {t("features.studio.clips.subtitle.retry")}
        </Button>
      </span>
    );
  }
  return (
    <span className="text-muted-foreground flex items-center gap-1 text-xs">
      <Loader2 className="size-3.5 animate-spin" aria-hidden />
      {t("features.studio.clips.subtitle.processing")}
    </span>
  );
};

export const ClipCard: FC<ClipCardProps> = ({
  clip,
  index,
  transcript,
  retrying,
  onRetry,
  onRemove,
}) => {
  const { t } = useAppTranslate();
  return (
    <li className="bg-card flex items-center gap-3 rounded-2xl border p-3">
      <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
        {(index + 1).toLocaleString("fa-IR")}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-semibold">{clip.name}</span>
        <span className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>{formatDuration(clip.duration_ms)}</span>
          <SubtitleStatus
            transcript={transcript}
            retrying={retrying}
            onRetry={() => onRetry(clip)}
          />
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
