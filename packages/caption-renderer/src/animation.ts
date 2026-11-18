import gsap from "gsap";
import type { CaptionConfig } from "./config";
import type { CaptionPage, CaptionWord } from "./words";

/**
 * Easings come from GSAP, but nothing here is played by it: every value is
 * computed from the time it is given. That is what lets the export render any
 * frame, in any order, and get the same picture as the preview.
 */
const ease = (name: string) => gsap.parseEase(name);
const OUT_BACK = ease("back.out(2)");
const OUT_BOUNCE = ease("bounce.out");
const OUT_CUBIC = ease("power3.out");

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

/** How the whole caption block looks at a moment. `dy` is a fraction of the frame height. */
export interface BlockState {
  opacity: number;
  scale: number;
  dy: number;
}

export const blockState = (
  config: CaptionConfig,
  page: CaptionPage,
  timeMs: number,
): BlockState => {
  const { entrance, entranceMs, exit, exitMs } = config.animation;
  const entered = entranceMs > 0 ? clamp01((timeMs - page.startMs) / entranceMs) : 1;
  const state: BlockState = { opacity: 1, scale: 1, dy: 0 };
  switch (entrance) {
    case "fade":
      state.opacity = OUT_CUBIC(entered);
      break;
    case "pop":
      state.opacity = clamp01(entered * 3);
      state.scale = lerp(0.6, 1, OUT_BACK(entered));
      break;
    case "zoom":
      state.opacity = OUT_CUBIC(entered);
      state.scale = lerp(1.5, 1, OUT_CUBIC(entered));
      break;
    case "slide-up":
      state.opacity = OUT_CUBIC(entered);
      state.dy = lerp(0.08, 0, OUT_CUBIC(entered));
      break;
    case "bounce":
      state.opacity = clamp01(entered * 4);
      state.dy = lerp(-0.12, 0, OUT_BOUNCE(entered));
      break;
    case "words":
    case "none":
      break;
  }
  if (exit === "fade" && exitMs > 0) {
    const leaving = clamp01(1 - (page.endMs - timeMs) / exitMs);
    state.opacity *= 1 - leaving;
  }
  return state;
};

/** How one word looks at a moment. `wipe` is how much of it is in the active colour. */
export interface WordState {
  opacity: number;
  scale: number;
  active: boolean;
  wipe: number;
}

const POP_MS = 140;

export const wordState = (
  config: CaptionConfig,
  word: CaptionWord,
  timeMs: number,
): WordState => {
  const { entrance, wordEffect, wordScale, spokenStays } = config.animation;
  const spoken = timeMs >= word.endMs;
  const speaking = timeMs >= word.startMs && !spoken;
  const state: WordState = { opacity: 1, scale: 1, active: false, wipe: 0 };

  if (entrance === "words") {
    state.opacity = timeMs >= word.startMs ? 1 : 0;
  }
  if (wordEffect === "none") return state;

  const lit = speaking || (spoken && spokenStays);
  if (wordEffect === "wipe") {
    const length = Math.max(1, word.endMs - word.startMs);
    state.wipe = spoken ? (spokenStays ? 1 : 0) : speaking ? clamp01((timeMs - word.startMs) / length) : 0;
    return state;
  }
  state.active = lit;
  if (wordEffect === "pop" && speaking) {
    const progress = clamp01((timeMs - word.startMs) / POP_MS);
    state.scale = lerp(1, wordScale, OUT_BACK(progress));
  }
  return state;
};
