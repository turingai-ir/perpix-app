/** The version of the caption `config` this package understands; a preset stores it as `schema_version`. */
export const CAPTION_CONFIG_SCHEMA_VERSION = 1;

export const ENTRANCES = [
  "none",
  "fade",
  "pop",
  "zoom",
  "slide-up",
  "bounce",
  "words",
] as const;
export type Entrance = (typeof ENTRANCES)[number];

export const EXITS = ["none", "fade"] as const;
export type Exit = (typeof EXITS)[number];

/** What the word being spoken does. `wipe` fills it as it is said, like karaoke. */
export const WORD_EFFECTS = ["none", "color", "pop", "wipe", "box"] as const;
export type WordEffect = (typeof WORD_EFFECTS)[number];

/** How a word arrives when the caption's entrance is `words`. */
export const WORD_ENTRANCES = ["fade", "pop", "slide-up"] as const;
export type WordEntrance = (typeof WORD_ENTRANCES)[number];

/** Which words are drawn as key words besides the ones marked by hand. */
export const AUTO_EMPHASIS = ["none", "longest", "numbers"] as const;
export type AutoEmphasis = (typeof AUTO_EMPHASIS)[number];

export const ANCHORS = ["top", "middle", "bottom"] as const;
export type Anchor = (typeof ANCHORS)[number];

export const ALIGNS = ["center", "left", "right"] as const;
export type Align = (typeof ALIGNS)[number];

/**
 * How a caption looks. Sizes are for a frame 1080 pixels high and scale with the
 * real frame, so the same config looks the same in a preview and in the export.
 * Positions are fractions of the frame.
 */
export interface CaptionConfig {
  font: { family: string; size: number; weight: number; italic: boolean };
  text: {
    uppercase: boolean;
    align: Align;
    lineHeight: number;
    letterSpacing: number;
    /** How many words are on screen together. */
    wordsPerPage: number;
  };
  layout: {
    anchor: Anchor;
    /** Distance from the anchor, as a fraction of the frame height. */
    offset: number;
    /** The widest a line may be, as a fraction of the frame width. */
    maxWidth: number;
  };
  colors: { text: string; active: string; stroke: string };
  /** A colour fade down each word, used instead of the plain text colour. */
  gradient: { enabled: boolean; from: string; to: string };
  strokeWidth: number;
  /** Key words: marked in the transcript, or picked by the `auto` rule. */
  emphasis: {
    auto: AutoEmphasis;
    color: string;
    /** An empty family keeps the caption's own. */
    family: string;
    weight: number;
    italic: boolean;
    uppercase: boolean;
    scale: number;
  };
  /** The pill that follows the spoken word with the `box` effect. */
  highlight: { color: string; padding: number; radius: number };
  emoji: { enabled: boolean; size: number };
  box: {
    enabled: boolean;
    color: string;
    opacity: number;
    padding: number;
    radius: number;
  };
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    opacity: number;
  };
  animation: {
    entrance: Entrance;
    entranceMs: number;
    exit: Exit;
    exitMs: number;
    wordEntrance: WordEntrance;
    wordEffect: WordEffect;
    /** How big the spoken word gets with the `pop` effect. */
    wordScale: number;
    /** Whether a word stays in the active colour once it has been said. */
    spokenStays: boolean;
  };
}

export const DEFAULT_CAPTION_CONFIG: CaptionConfig = {
  font: { family: "Vazirmatn", size: 72, weight: 800, italic: false },
  text: {
    uppercase: false,
    align: "center",
    lineHeight: 1.25,
    letterSpacing: 0,
    wordsPerPage: 4,
  },
  layout: { anchor: "bottom", offset: 0.12, maxWidth: 0.86 },
  colors: { text: "#ffffff", active: "#ffd400", stroke: "#000000" },
  gradient: { enabled: false, from: "#ffffff", to: "#9ad1ff" },
  strokeWidth: 6,
  emphasis: {
    auto: "none",
    color: "#ff4d6d",
    family: "",
    weight: 900,
    italic: false,
    uppercase: false,
    scale: 1.25,
  },
  highlight: { color: "#7c3aed", padding: 10, radius: 14 },
  emoji: { enabled: true, size: 0.9 },
  box: {
    enabled: false,
    color: "#000000",
    opacity: 0.6,
    padding: 24,
    radius: 20,
  },
  shadow: {
    enabled: true,
    color: "#000000",
    blur: 8,
    offsetX: 0,
    offsetY: 4,
    opacity: 0.6,
  },
  animation: {
    entrance: "pop",
    entranceMs: 220,
    exit: "fade",
    exitMs: 120,
    wordEntrance: "pop",
    wordEffect: "color",
    wordScale: 1.15,
    spokenStays: false,
  },
};

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const section = (value: unknown): Raw => (isRecord(value) ? value : {});

const num = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;

const bool = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const pick = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const color = (value: unknown, fallback: string) =>
  typeof value === "string" && HEX_COLOR.test(value) ? value : fallback;

const family = (value: unknown, fallback: string) =>
  typeof value === "string" && /^[\p{L}\p{N} _-]{1,64}$/u.test(value)
    ? value
    : fallback;

/**
 * Reads a stored config into a complete one. Anything missing, out of range or
 * of an unknown kind falls back to the default, so a preset saved by an older or
 * newer version never breaks the renderer and never throws.
 */
export const normalizeCaptionConfig = (raw: unknown): CaptionConfig => {
  const d = DEFAULT_CAPTION_CONFIG;
  const root = section(raw);
  const font = section(root.font);
  const text = section(root.text);
  const layout = section(root.layout);
  const colors = section(root.colors);
  const box = section(root.box);
  const shadow = section(root.shadow);
  const animation = section(root.animation);
  const gradient = section(root.gradient);
  const emphasis = section(root.emphasis);
  const highlight = section(root.highlight);
  const emoji = section(root.emoji);
  return {
    font: {
      family: family(font.family, d.font.family),
      size: num(font.size, d.font.size, 16, 240),
      weight: Math.round(num(font.weight, d.font.weight, 100, 900) / 100) * 100,
      italic: bool(font.italic, d.font.italic),
    },
    text: {
      uppercase: bool(text.uppercase, d.text.uppercase),
      align: pick(text.align, ALIGNS, d.text.align),
      lineHeight: num(text.lineHeight, d.text.lineHeight, 0.8, 2.5),
      letterSpacing: num(text.letterSpacing, d.text.letterSpacing, -5, 30),
      wordsPerPage: Math.round(
        num(text.wordsPerPage, d.text.wordsPerPage, 1, 12),
      ),
    },
    layout: {
      anchor: pick(layout.anchor, ANCHORS, d.layout.anchor),
      offset: num(layout.offset, d.layout.offset, 0, 0.45),
      maxWidth: num(layout.maxWidth, d.layout.maxWidth, 0.3, 1),
    },
    colors: {
      text: color(colors.text, d.colors.text),
      active: color(colors.active, d.colors.active),
      stroke: color(colors.stroke, d.colors.stroke),
    },
    gradient: {
      enabled: bool(gradient.enabled, d.gradient.enabled),
      from: color(gradient.from, d.gradient.from),
      to: color(gradient.to, d.gradient.to),
    },
    strokeWidth: num(root.strokeWidth, d.strokeWidth, 0, 40),
    emphasis: {
      auto: pick(emphasis.auto, AUTO_EMPHASIS, d.emphasis.auto),
      color: color(emphasis.color, d.emphasis.color),
      family:
        emphasis.family === ""
          ? ""
          : family(emphasis.family, d.emphasis.family),
      weight:
        Math.round(num(emphasis.weight, d.emphasis.weight, 100, 900) / 100) *
        100,
      italic: bool(emphasis.italic, d.emphasis.italic),
      uppercase: bool(emphasis.uppercase, d.emphasis.uppercase),
      scale: num(emphasis.scale, d.emphasis.scale, 0.8, 2),
    },
    highlight: {
      color: color(highlight.color, d.highlight.color),
      padding: num(highlight.padding, d.highlight.padding, 0, 60),
      radius: num(highlight.radius, d.highlight.radius, 0, 60),
    },
    emoji: {
      enabled: bool(emoji.enabled, d.emoji.enabled),
      size: num(emoji.size, d.emoji.size, 0.4, 2),
    },
    box: {
      enabled: bool(box.enabled, d.box.enabled),
      color: color(box.color, d.box.color),
      opacity: num(box.opacity, d.box.opacity, 0, 1),
      padding: num(box.padding, d.box.padding, 0, 120),
      radius: num(box.radius, d.box.radius, 0, 120),
    },
    shadow: {
      enabled: bool(shadow.enabled, d.shadow.enabled),
      color: color(shadow.color, d.shadow.color),
      blur: num(shadow.blur, d.shadow.blur, 0, 60),
      offsetX: num(shadow.offsetX, d.shadow.offsetX, -60, 60),
      offsetY: num(shadow.offsetY, d.shadow.offsetY, -60, 60),
      opacity: num(shadow.opacity, d.shadow.opacity, 0, 1),
    },
    animation: {
      entrance: pick(animation.entrance, ENTRANCES, d.animation.entrance),
      entranceMs: num(animation.entranceMs, d.animation.entranceMs, 0, 2000),
      exit: pick(animation.exit, EXITS, d.animation.exit),
      exitMs: num(animation.exitMs, d.animation.exitMs, 0, 2000),
      wordEntrance: pick(
        animation.wordEntrance,
        WORD_ENTRANCES,
        d.animation.wordEntrance,
      ),
      wordEffect: pick(
        animation.wordEffect,
        WORD_EFFECTS,
        d.animation.wordEffect,
      ),
      wordScale: num(animation.wordScale, d.animation.wordScale, 1, 2),
      spokenStays: bool(animation.spokenStays, d.animation.spokenStays),
    },
  };
};
