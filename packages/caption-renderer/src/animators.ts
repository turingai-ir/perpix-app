import gsap from "gsap";
import type {
  Animator,
  CaptionTemplate,
  EaseName,
  Selector,
  WordStateName,
} from "./template";
import type { CaptionPage, CaptionWord } from "./words";

/**
 * Easings come from GSAP, but nothing here is played by it: every value is
 * computed from the time it is given. That lets the export render any frame, in
 * any order, and get the same picture as the preview.
 */
const easings = new Map<EaseName, (progress: number) => number>();
const ease = (name: EaseName) => {
  let fn = easings.get(name);
  if (!fn) {
    fn = gsap.parseEase(name);
    easings.set(name, fn);
  }
  return fn;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

/** A number in [-1, 1] that depends only on the seed and the index. */
export const seeded = (seed: number, index: number, salt = 0): number => {
  let h = (seed * 374761393 + index * 668265263 + salt * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return ((h >>> 0) / 4294967295) * 2 - 1;
};

export interface Transform {
  opacity: number;
  scale: number;
  scaleX: number;
  scaleY: number;
  /** In font sizes. */
  x: number;
  y: number;
  /** In degrees. */
  rotate: number;
  skewX: number;
  /** In px for a 1080-high frame. */
  blur: number;
  /** How much of a word is uncovered, from its start. */
  reveal: number;
  /** How far the text colour is mixed toward `tintColor`. */
  tint: number;
  tintColor: string;
  glow: number;
}

export const identity = (): Transform => ({
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
  rotate: 0,
  skewX: 0,
  blur: 0,
  reveal: 1,
  tint: 0,
  tintColor: "#ffffff",
  glow: 0,
});

/** Two transforms applied one after the other, such as a word's and its letter's. */
export const combine = (a: Transform, b: Transform): Transform => ({
  opacity: a.opacity * b.opacity,
  scale: a.scale * b.scale,
  scaleX: a.scaleX * b.scaleX,
  scaleY: a.scaleY * b.scaleY,
  x: a.x + b.x,
  y: a.y + b.y,
  rotate: a.rotate + b.rotate,
  skewX: a.skewX + b.skewX,
  blur: a.blur + b.blur,
  reveal: a.reveal * b.reveal,
  tint: Math.max(a.tint, b.tint),
  tintColor: b.tint > a.tint ? b.tintColor : a.tintColor,
  glow: a.glow + b.glow,
});

/** What an animator needs to know about the thing it moves. */
export interface Unit {
  scope: "page" | "line" | "word" | "char";
  /** Position within the page (words) or the block (lines). */
  index: number;
  count: number;
  role: string;
  /** The word, for a word or one of its letters. */
  word?: CaptionWord;
  /** Seeds a word's jitter; unique within the page. */
  seedIndex: number;
}

export const wordStateAt = (
  word: CaptionWord,
  timeMs: number,
): WordStateName =>
  timeMs < word.startMs
    ? "upcoming"
    : timeMs >= word.endMs
      ? "spoken"
      : "active";

export const matches = (
  select: Selector,
  unit: Unit,
  timeMs: number,
): boolean => {
  if (select.scope !== unit.scope) return false;
  if (select.roles.length > 0 && !select.roles.includes(unit.role))
    return false;
  if (select.states.length > 0) {
    if (!unit.word) return false;
    if (!select.states.includes(wordStateAt(unit.word, timeMs))) return false;
  }
  switch (select.position) {
    case "first":
      return unit.index === 0;
    case "last":
      return unit.index === unit.count - 1;
    case "odd":
      return unit.index % 2 === 0;
    case "even":
      return unit.index % 2 === 1;
    case "any":
      return true;
  }
};

const progressOf = (
  animator: Animator,
  unit: Unit,
  page: Pick<CaptionPage, "startMs" | "endMs">,
  timeMs: number,
): { progress: number; engaged: boolean } | null => {
  const { trigger, durationMs, delayMs, staggerMs } = animator;
  const length = Math.max(1, durationMs);
  switch (trigger) {
    case "enter": {
      const base =
        animator.from === "word" && unit.word
          ? unit.word.startMs
          : page.startMs;
      const stagger = animator.from === "page" ? unit.index * staggerMs : 0;
      const start = base + delayMs + stagger;
      return {
        progress: clamp01((timeMs - start) / length),
        engaged: timeMs >= start,
      };
    }
    case "exit": {
      const start =
        page.endMs -
        length -
        delayMs -
        (unit.count - 1 - unit.index) * staggerMs;
      return {
        progress: clamp01((timeMs - start) / length),
        engaged: timeMs >= start,
      };
    }
    case "active": {
      if (!unit.word) return null;
      const start = unit.word.startMs + delayMs;
      const over = timeMs >= unit.word.endMs;
      if (timeMs < start || (over && animator.after === "revert")) return null;
      return { progress: clamp01((timeMs - start) / length), engaged: true };
    }
    case "loop": {
      const phase =
        (timeMs - page.startMs + unit.index * staggerMs) / animator.periodMs;
      return {
        progress: 0.5 - 0.5 * Math.cos(2 * Math.PI * phase),
        engaged: true,
      };
    }
  }
};

/**
 * What every animator of the template does to one unit at one moment. Opacity
 * and scale multiply, position and rotation add.
 */
export const evaluate = (
  template: CaptionTemplate,
  unit: Unit,
  page: Pick<CaptionPage, "startMs" | "endMs">,
  timeMs: number,
): Transform => {
  const result = identity();
  for (const animator of template.animators) {
    if (
      animator.trigger === "active" &&
      unit.scope !== "word" &&
      unit.scope !== "char"
    )
      continue;
    // The state the selector asks about is the word's, not the animator's own.
    const select =
      animator.trigger === "active"
        ? { ...animator.select, states: [] }
        : animator.select;
    if (!matches(select, unit, timeMs)) continue;
    const step = progressOf(animator, unit, page, timeMs);
    if (!step) continue;
    const eased = ease(animator.ease)(step.progress);
    const { props, jitter, seed } = animator;
    const at = (range: [number, number]) => lerp(range[0], range[1], eased);
    if (props.opacity) result.opacity *= at(props.opacity);
    if (props.scale) result.scale *= at(props.scale);
    if (props.scaleX) result.scaleX *= at(props.scaleX);
    if (props.scaleY) result.scaleY *= at(props.scaleY);
    if (props.x) result.x += at(props.x);
    if (props.y) result.y += at(props.y);
    if (props.rotate) result.rotate += at(props.rotate);
    if (props.skewX) result.skewX += at(props.skewX);
    if (props.blur) result.blur += at(props.blur);
    if (props.reveal) result.reveal *= at(props.reveal);
    if (props.glow) result.glow += at(props.glow);
    if (props.tint) {
      const amount = at(props.tint);
      if (amount >= result.tint) {
        result.tint = amount;
        result.tintColor = animator.tint;
      }
    }
    if (step.engaged) {
      const i = unit.seedIndex;
      result.rotate += jitter.rotate * seeded(seed, i, 1);
      result.x += jitter.x * seeded(seed, i, 2);
      result.y += jitter.y * seeded(seed, i, 3);
      result.scale *= 1 + jitter.scale * seeded(seed, i, 4);
    }
  }
  return result;
};

/** How far the highlight of a word has come, from 0 (not started) to 1. */
export const stateProgress = (
  word: CaptionWord,
  timeMs: number,
  kind: "wipe" | "quick",
): number => {
  if (timeMs < word.startMs) return 0;
  if (timeMs >= word.endMs) return 1;
  const length = kind === "wipe" ? Math.max(1, word.endMs - word.startMs) : 120;
  return clamp01((timeMs - word.startMs) / length);
};

/** The emoji over a word: it pops in as the word starts and stays with the page. */
export const emojiState = (word: CaptionWord, timeMs: number) => {
  const shown = clamp01((timeMs - word.startMs) / 220);
  return {
    opacity: clamp01(shown * 3),
    scale: lerp(0.3, 1, ease("back.out")(shown)),
  };
};
