import type { FC } from "react";

import { cn } from "@/shared/lib/utils";
import { formatDuration } from "../../projects/model/clips";
import type { Timeline } from "../model/timeline";

interface TimelineStripProps {
  timeline: Timeline;
  timeMs: number;
  onSeek: (ms: number) => void;
}

/**
 * The clips as blocks in the order and proportion they play, with the
 * playhead on top. The strip reads left to right like every video timeline,
 * whatever the page direction. Tapping a block moves the playhead there.
 */
export const TimelineStrip: FC<TimelineStripProps> = ({
  timeline,
  timeMs,
  onSeek,
}) => {
  const { segments, durationMs } = timeline;
  const percent = (ms: number) => `${(ms / durationMs) * 100}%`;
  const current = segments.findIndex(
    (segment) =>
      timeMs < segment.endMs || segment === segments[segments.length - 1],
  );

  return (
    <div
      dir="ltr"
      className="relative mx-4 my-2 h-14 shrink-0 lg:mx-6 lg:my-3 lg:h-20"
    >
      {segments.map((segment, index) => (
        <button
          key={segment.clip.id}
          type="button"
          data-testid="timeline-clip"
          aria-current={index === current ? "true" : undefined}
          aria-label={`${segment.clip.name} ${formatDuration(segment.endMs - segment.startMs)}`}
          onClick={() => onSeek(segment.startMs)}
          style={{
            left: percent(segment.startMs),
            width: percent(segment.endMs - segment.startMs),
          }}
          className={cn(
            "absolute inset-y-0 cursor-pointer overflow-hidden border-s-2 border-background px-1.5 text-start text-xs transition-colors first:rounded-s-lg last:rounded-e-lg focus-visible:ring-2 focus-visible:outline-none",
            index === current
              ? "bg-primary/30 text-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <span className="block truncate">{segment.clip.name}</span>
        </button>
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground"
        style={{ left: percent(Math.min(timeMs, durationMs)) }}
      />
    </div>
  );
};
