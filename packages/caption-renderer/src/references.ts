import { normalizeTemplate } from "./normalize";
import type { CaptionTemplate } from "./template";

const FADE_OUT = {
  select: { scope: "page" },
  trigger: "exit",
  durationMs: 120,
  ease: "linear",
  props: { opacity: [1, 0] },
};

const PAGE_FADE_IN = {
  select: { scope: "page" },
  trigger: "enter",
  durationMs: 140,
  ease: "power3.out",
  props: { opacity: [0, 1] },
};

const popActive = (scale: number, extra: Record<string, unknown> = {}) => ({
  select: { scope: "word" },
  trigger: "active",
  durationMs: 160,
  ease: "back.out",
  props: { scale: [1, scale] },
  ...extra,
});

interface Reference {
  /** Shown in the editor's list. */
  title: string;
  template: CaptionTemplate;
}

const make = (title: string, raw: Record<string, unknown>): Reference => ({
  title,
  template: normalizeTemplate({ version: 2, ...raw }),
});

/**
 * Starting points for a new template, each a different look built from the same
 * parts. Every one only says what differs from the default.
 */
export const REFERENCE_TEMPLATES: Record<string, Reference> = {
  classic: make("کلاسیک", {}),
  karaoke: make("کاراوکه", {
    animators: [PAGE_FADE_IN, FADE_OUT],
    decorations: [
      {
        kind: "wipe",
        select: { states: ["active", "spoken"] },
        color: "#ffd400",
        reveal: "sweep",
      },
    ],
    states: { upcoming: {}, active: {}, spoken: {} },
  }),
  hormozi: make("هورموزی", {
    base: {
      font: { size: 84, weight: 900 },
      text: { uppercase: true, lineHeight: 1.15 },
      stroke: { width: 9 },
    },
    layout: { wordsPerPage: 3, anchor: "middle", offset: 0.1 },
    states: { upcoming: {}, active: { color: "#2bff88" }, spoken: {} },
    roles: { key: { color: "#ffd400", scale: 1.15 } },
    roleRules: [{ role: "key", when: "longest" }],
    animators: [
      {
        select: { scope: "page" },
        trigger: "enter",
        durationMs: 140,
        ease: "power2.out",
        props: { opacity: [0, 1], scale: [0.88, 1] },
      },
      popActive(1.12),
      FADE_OUT,
    ],
  }),
  mrbeast: make("مستر بیست", {
    base: {
      font: { size: 84, weight: 900, italic: true },
      text: { uppercase: true },
      stroke: { width: 11 },
    },
    layout: { wordsPerPage: 3 },
    states: { upcoming: {}, active: { color: "#00e5ff" }, spoken: {} },
    animators: [
      PAGE_FADE_IN,
      {
        select: { scope: "word" },
        trigger: "active",
        durationMs: 220,
        ease: "elastic.out",
        props: { scale: [1, 1.28], rotate: [0, -5] },
      },
      FADE_OUT,
    ],
  }),
  ali: make("مینیمال با زیرخط", {
    base: {
      font: { size: 64, weight: 600 },
      stroke: { width: 0 },
      shadow: { blur: 14, offsetY: 2, opacity: 0.5 },
    },
    layout: { wordsPerPage: 5 },
    states: { upcoming: {}, active: { color: "#ffffff" }, spoken: {} },
    decorations: [
      {
        kind: "underline",
        select: { states: ["active"] },
        color: "#ffffff",
        size: 5,
        radius: 3,
        reveal: "sweep",
      },
    ],
    animators: [
      {
        select: { scope: "page" },
        trigger: "enter",
        durationMs: 240,
        ease: "power3.out",
        props: { opacity: [0, 1], y: [0.25, 0] },
      },
      FADE_OUT,
    ],
  }),
  two_word_pop: make("دو کلمه با قرص زرد", {
    base: { stroke: { width: 0 }, shadow: { enabled: false } },
    layout: { wordsPerPage: 2 },
    states: { upcoming: {}, active: { color: "#111111" }, spoken: {} },
    decorations: [
      {
        kind: "pill",
        select: { states: ["active"] },
        color: "#ffd400",
        size: 16,
        radius: 20,
        reveal: "fade",
      },
    ],
    animators: [PAGE_FADE_IN, popActive(1.08), FADE_OUT],
  }),
  word_by_word: make("کلمه به کلمه", {
    base: { text: { uppercase: true, letterSpacing: 1 } },
    layout: { wordsPerPage: 5 },
    states: { upcoming: {}, active: {}, spoken: {} },
    animators: [
      {
        select: { scope: "word" },
        trigger: "enter",
        from: "word",
        durationMs: 220,
        ease: "power3.out",
        props: { opacity: [0, 1], y: [0.5, 0] },
      },
      FADE_OUT,
    ],
  }),
  boxed: make("جعبه‌ای", {
    base: { stroke: { width: 0 }, shadow: { enabled: false } },
    box: { enabled: true, opacity: 0.7, padding: 28, radius: 24 },
    states: { upcoming: {}, active: { color: "#ffd400" }, spoken: {} },
    animators: [
      {
        select: { scope: "page" },
        trigger: "enter",
        durationMs: 250,
        ease: "power3.out",
        props: { opacity: [0, 1], y: [0.35, 0] },
      },
      FADE_OUT,
    ],
  }),
  key_words: make("کلمات کلیدی درشت", {
    layout: { wordsPerPage: 5 },
    states: { upcoming: {}, active: {}, spoken: {} },
    roles: {
      key: { color: "#ff4d6d", scale: 1.35, weight: 900, uppercase: true },
    },
    roleRules: [{ role: "key", when: "longest" }],
    animators: [
      {
        select: { scope: "page" },
        trigger: "enter",
        durationMs: 220,
        ease: "power3.out",
        props: { opacity: [0, 1], y: [0.3, 0] },
      },
      {
        select: { scope: "word", roles: ["key"] },
        trigger: "enter",
        from: "word",
        durationMs: 260,
        ease: "back.out",
        props: { opacity: [0, 1], scale: [0.4, 1] },
        jitter: { rotate: 4, x: 0, y: 0, scale: 0 },
        seed: 3,
      },
      FADE_OUT,
    ],
  }),
  marker: make("ماژیک هایلایت", {
    base: { stroke: { width: 0 }, shadow: { enabled: false } },
    layout: { wordsPerPage: 4 },
    states: {
      upcoming: {},
      active: { color: "#111111" },
      spoken: { color: "#111111" },
    },
    decorations: [
      {
        kind: "marker",
        select: { states: ["active", "spoken"] },
        color: "#ffe44d",
        size: 0,
        radius: 6,
        reveal: "sweep",
      },
    ],
    animators: [PAGE_FADE_IN, FADE_OUT],
  }),
  wave: make("موج", {
    states: { upcoming: {}, active: { color: "#7dd3fc" }, spoken: {} },
    animators: [
      PAGE_FADE_IN,
      {
        select: { scope: "word" },
        trigger: "loop",
        durationMs: 0,
        periodMs: 1000,
        staggerMs: 90,
        ease: "sine.inOut",
        props: { y: [0, -0.12] },
      },
      FADE_OUT,
    ],
  }),
};
