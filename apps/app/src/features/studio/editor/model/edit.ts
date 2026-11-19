import type { Clip } from "../../projects/model/clips";

/** No piece shorter than this is left behind by a cut; it would be a flash on screen. */
export const MIN_CLIP_MS = 300;

/** The clips after an edit, and where the playhead goes: into which clip and how far into it. */
export interface Edit {
  clips: Clip[];
  focusIndex: number;
  focusOffsetMs: number;
}

const replaceAt = (clips: readonly Clip[], index: number, ...with_: Clip[]) => [
  ...clips.slice(0, index),
  ...with_,
  ...clips.slice(index + 1),
];

const length = (clip: Clip) => clip.source_out_ms - clip.source_in_ms;

/** Cuts the clip in two at a moment of its source; null when either half would be too short. */
export const splitAt = (
  clips: readonly Clip[],
  index: number,
  sourceMs: number,
  makeId: () => string = () => crypto.randomUUID(),
): Edit | null => {
  const clip = clips[index];
  if (
    !clip ||
    sourceMs - clip.source_in_ms < MIN_CLIP_MS ||
    clip.source_out_ms - sourceMs < MIN_CLIP_MS
  )
    return null;
  return {
    clips: replaceAt(
      clips,
      index,
      { ...clip, source_out_ms: sourceMs },
      { ...clip, id: makeId(), source_in_ms: sourceMs },
    ),
    focusIndex: index + 1,
    focusOffsetMs: 0,
  };
};

/** Drops everything of the clip before a moment of its source. */
export const trimStart = (
  clips: readonly Clip[],
  index: number,
  sourceMs: number,
): Edit | null => {
  const clip = clips[index];
  if (!clip || sourceMs <= clip.source_in_ms) return null;
  if (clip.source_out_ms - sourceMs < MIN_CLIP_MS) return null;
  return {
    clips: replaceAt(clips, index, { ...clip, source_in_ms: sourceMs }),
    focusIndex: index,
    focusOffsetMs: 0,
  };
};

/** Drops everything of the clip after a moment of its source. */
export const trimEnd = (
  clips: readonly Clip[],
  index: number,
  sourceMs: number,
): Edit | null => {
  const clip = clips[index];
  if (!clip || sourceMs >= clip.source_out_ms) return null;
  if (sourceMs - clip.source_in_ms < MIN_CLIP_MS) return null;
  const next = { ...clip, source_out_ms: sourceMs };
  return {
    clips: replaceAt(clips, index, next),
    focusIndex: index,
    focusOffsetMs: Math.max(0, length(next) - 1),
  };
};

export const removeAt = (
  clips: readonly Clip[],
  index: number,
): Edit | null => {
  if (!clips[index]) return null;
  const rest = replaceAt(clips, index);
  return {
    clips: rest,
    focusIndex: Math.max(0, Math.min(index, rest.length - 1)),
    focusOffsetMs: 0,
  };
};

/** Moves the clip one place earlier (-1) or later (+1), keeping the playhead inside it. */
export const moveBy = (
  clips: readonly Clip[],
  index: number,
  delta: -1 | 1,
  offsetMs: number,
): Edit | null => {
  const target = index + delta;
  if (!clips[index] || target < 0 || target >= clips.length) return null;
  const next = [...clips];
  [next[index], next[target]] = [next[target], next[index]];
  return { clips: next, focusIndex: target, focusOffsetMs: offsetMs };
};
