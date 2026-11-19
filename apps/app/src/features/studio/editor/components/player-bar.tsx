import type { FC } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { formatDuration } from "../../projects/model/clips";

interface PlayerBarProps {
  timeMs: number;
  durationMs: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (ms: number) => void;
}

/** Play/pause, the time, and a scrub bar, sized for a thumb. */
export const PlayerBar: FC<PlayerBarProps> = ({
  timeMs,
  durationMs,
  playing,
  onToggle,
  onSeek,
}) => {
  const { t } = useAppTranslate();
  return (
    <div className="flex shrink-0 items-center gap-3 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Button
        size="icon"
        className="size-12 shrink-0 rounded-full"
        aria-label={
          playing
            ? t("features.studio.editor.pause")
            : t("features.studio.editor.play")
        }
        onClick={onToggle}
      >
        {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
      </Button>
      <input
        type="range"
        min={0}
        max={durationMs}
        step={10}
        value={Math.min(timeMs, durationMs)}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label={t("features.studio.editor.seek")}
        className="accent-primary h-11 min-w-0 flex-1 cursor-pointer"
        dir="ltr"
      />
      <span className="text-muted-foreground w-20 shrink-0 text-end text-xs tabular-nums">
        {formatDuration(timeMs)} / {formatDuration(durationMs)}
      </span>
    </div>
  );
};
