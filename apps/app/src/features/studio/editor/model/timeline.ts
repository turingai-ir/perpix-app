import type { CaptionWord } from "@perpix/caption-renderer";
import type { Clip } from "../../projects/model/clips";

/** A clip placed on the project's timeline: where it starts and ends in the output, in order. */
export interface Segment {
  clip: Clip;
  startMs: number;
  endMs: number;
}

export interface Timeline {
  segments: Segment[];
  durationMs: number;
}

/** The part of its file a clip plays, in milliseconds. */
export const clipLength = (clip: Clip): number =>
  Math.max(0, clip.source_out_ms - clip.source_in_ms);

/** Clips played one after another; each starts where the one before it ends. */
export const buildTimeline = (clips: readonly Clip[]): Timeline => {
  let at = 0;
  const segments = clips
    .filter((clip) => clipLength(clip) > 0)
    .map((clip) => {
      const segment = { clip, startMs: at, endMs: at + clipLength(clip) };
      at = segment.endMs;
      return segment;
    });
  return { segments, durationMs: at };
};

/** Which segment a timeline moment falls in and how far into its clip's source that is; clamped to the ends. */
export const locate = (
  timeline: Timeline,
  timeMs: number,
): { index: number; sourceMs: number } | null => {
  const { segments, durationMs } = timeline;
  if (segments.length === 0) return null;
  const at = Math.min(Math.max(0, timeMs), durationMs);
  const found = segments.findIndex((segment) => at < segment.endMs);
  const index = found === -1 ? segments.length - 1 : found;
  const segment = segments[index];
  return {
    index,
    sourceMs: Math.min(
      segment.clip.source_out_ms,
      segment.clip.source_in_ms + (at - segment.startMs),
    ),
  };
};

export interface SourceWord {
  text: string;
  start_ms: number;
  end_ms: number;
}

export const wordOverlapsClip = (word: SourceWord, clip: Clip): boolean =>
  word.end_ms > clip.source_in_ms && word.start_ms < clip.source_out_ms;

/**
 * The words of every clip on the timeline's clock. A word is kept for the
 * part of it that falls inside the clip, so a cut never leaves a stray word,
 * and the raw transcript is never changed.
 */
export const timelineWords = (
  timeline: Timeline,
  wordsByFile: ReadonlyMap<string, readonly SourceWord[]>,
): CaptionWord[] =>
  timeline.segments
    .flatMap(({ clip, startMs }) =>
      (wordsByFile.get(clip.file_uuid) ?? []).flatMap((word) => {
        if (!wordOverlapsClip(word, clip)) return [];
        const from = Math.max(word.start_ms, clip.source_in_ms);
        const to = Math.min(word.end_ms, clip.source_out_ms);
        return [
          {
            text: word.text,
            startMs: startMs + from - clip.source_in_ms,
            endMs: startMs + to - clip.source_in_ms,
          },
        ];
      }),
    )
    .sort((a, b) => a.startMs - b.startMs);
