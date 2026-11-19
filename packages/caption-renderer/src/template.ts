/** The version of the caption `config` this package writes; a preset stores it as `schema_version`. */
export const CAPTION_CONFIG_SCHEMA_VERSION = 2;

export const MAX_ROLES = 7;
export const MAX_ROLE_RULES = 8;
export const MAX_ANIMATORS = 24;
export const MAX_DECORATIONS = 8;
export const MAX_PALETTE = 6;

export const ANCHORS = ["top", "middle", "bottom"] as const;
export type Anchor = (typeof ANCHORS)[number];
export const ALIGNS = ["center", "left", "right"] as const;
export type Align = (typeof ALIGNS)[number];
export const SAFE_ZONES = ["none", "reels"] as const;
export type SafeZone = (typeof SAFE_ZONES)[number];

export const WORD_STATES = ["upcoming", "active", "spoken"] as const;
export type WordStateName = (typeof WORD_STATES)[number];

export const SCOPES = ["page", "line", "word", "char"] as const;
export type Scope = (typeof SCOPES)[number];
export const POSITIONS = ["any", "first", "last", "odd", "even"] as const;
export type Position = (typeof POSITIONS)[number];

export const TRIGGERS = ["enter", "exit", "active", "loop"] as const;
export type Trigger = (typeof TRIGGERS)[number];
export const FROM = ["page", "word"] as const;
export type From = (typeof FROM)[number];
export const AFTER = ["revert", "keep"] as const;
export type After = (typeof AFTER)[number];

export const EASES = [
  "linear",
  "power2.out",
  "power3.out",
  "power2.inOut",
  "back.out",
  "bounce.out",
  "elastic.out",
  "expo.out",
  "sine.inOut",
] as const;
export type EaseName = (typeof EASES)[number];

export const PROPS = [
  "opacity",
  "scale",
  "scaleX",
  "scaleY",
  "x",
  "y",
  "rotate",
  "skewX",
  "blur",
  "reveal",
  "tint",
  "glow",
] as const;
export type PropName = (typeof PROPS)[number];

export const DECORATION_KINDS = [
  "pill",
  "underline",
  "marker",
  "wipe",
  "frame",
  "strike",
  "squiggle",
  "circle",
  "sparkle",
  "shine",
  "progress",
] as const;
export type DecorationKind = (typeof DECORATION_KINDS)[number];
export const REVEALS = ["fade", "sweep"] as const;
export type Reveal = (typeof REVEALS)[number];

export const RULE_WHEN = ["number", "longest", "last"] as const;
export type RuleWhen = (typeof RULE_WHEN)[number];

export interface Selector {
  scope: Scope;
  /** Empty means every role. */
  roles: string[];
  /** Empty means every state; only words have a state. */
  states: WordStateName[];
  position: Position;
}

export type Range = [number, number];

export interface Animator {
  select: Selector;
  trigger: Trigger;
  from: From;
  durationMs: number;
  delayMs: number;
  staggerMs: number;
  ease: EaseName;
  /**
   * Each is [from, to]. Opacity, scale, scaleX, scaleY and reveal multiply; x
   * and y (in font sizes), rotate and skewX (degrees), blur (px) and glow add;
   * tint (0 to 1) mixes the text colour toward `tint`.
   * `reveal` (0 to 1) uncovers a word from its start and applies to words only.
   */
  props: Partial<Record<PropName, Range>>;
  jitter: { rotate: number; x: number; y: number; scale: number };
  /** The colour `tint` mixes toward and the colour of `glow`. */
  tint: string;
  seed: number;
  after: After;
  periodMs: number;
}

export interface Decoration {
  kind: DecorationKind;
  select: { roles: string[]; states: WordStateName[] };
  color: string;
  /** Thickness of an underline or marker, or the padding of a pill, in px for a 1080-high frame. */
  size: number;
  radius: number;
  reveal: Reveal;
  /** How many stars a `sparkle` throws. */
  count: number;
}

/** What a role or a state changes about a word. Missing keys change nothing. */
export interface RoleStyle {
  color?: string;
  scale?: number;
  weight?: number;
  italic?: boolean;
  family?: string;
  uppercase?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface StateStyle {
  color?: string;
  opacity?: number;
  scale?: number;
  strokeColor?: string;
}

export interface RoleRule {
  role: string;
  when: RuleWhen;
}

/**
 * How a caption looks. Sizes are for a frame 1080 pixels high and scale with the
 * real frame; positions are fractions of the frame.
 */
export interface CaptionTemplate {
  version: 2;
  base: {
    font: { family: string; size: number; weight: number; italic: boolean };
    text: {
      uppercase: boolean;
      align: Align;
      lineHeight: number;
      letterSpacing: number;
    };
    fill: {
      color: string;
      gradient: { enabled: boolean; from: string; to: string };
      /** Colours the words take in turn, when a word has no colour of its own. */
      palette: string[];
    };
    stroke: { width: number; color: string };
    shadow: {
      enabled: boolean;
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
      opacity: number;
    };
  };
  layout: {
    anchor: Anchor;
    offset: number;
    maxWidth: number;
    wordsPerPage: number;
    pauseMs: number;
    safeZone: SafeZone;
  };
  box: {
    enabled: boolean;
    color: string;
    opacity: number;
    padding: number;
    radius: number;
  };
  states: Record<WordStateName, StateStyle>;
  roles: Record<string, RoleStyle>;
  roleRules: RoleRule[];
  animators: Animator[];
  decorations: Decoration[];
  emoji: { enabled: boolean; size: number };
}

export const DEFAULT_SELECTOR: Selector = {
  scope: "page",
  roles: [],
  states: [],
  position: "any",
};

export const DEFAULT_ANIMATOR: Animator = {
  select: { ...DEFAULT_SELECTOR },
  trigger: "enter",
  from: "page",
  durationMs: 220,
  delayMs: 0,
  staggerMs: 0,
  ease: "power3.out",
  props: { opacity: [0, 1] },
  jitter: { rotate: 0, x: 0, y: 0, scale: 0 },
  tint: "#ffffff",
  seed: 1,
  after: "revert",
  periodMs: 1200,
};

export const DEFAULT_DECORATION: Decoration = {
  kind: "pill",
  select: { roles: [], states: ["active"] },
  color: "#7c3aed",
  size: 10,
  radius: 14,
  reveal: "fade",
  count: 6,
};

export const DEFAULT_TEMPLATE: CaptionTemplate = {
  version: 2,
  base: {
    font: { family: "Vazirmatn", size: 72, weight: 800, italic: false },
    text: {
      uppercase: false,
      align: "center",
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    fill: {
      color: "#ffffff",
      gradient: { enabled: false, from: "#ffffff", to: "#9ad1ff" },
      palette: [],
    },
    stroke: { width: 6, color: "#000000" },
    shadow: {
      enabled: true,
      color: "#000000",
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      opacity: 0.6,
    },
  },
  layout: {
    anchor: "bottom",
    offset: 0.12,
    maxWidth: 0.86,
    wordsPerPage: 4,
    pauseMs: 700,
    safeZone: "none",
  },
  box: {
    enabled: false,
    color: "#000000",
    opacity: 0.6,
    padding: 24,
    radius: 20,
  },
  states: { upcoming: {}, active: { color: "#ffd400" }, spoken: {} },
  roles: {},
  roleRules: [],
  animators: [
    {
      ...DEFAULT_ANIMATOR,
      durationMs: 220,
      ease: "back.out",
      props: { opacity: [0, 1], scale: [0.6, 1] },
    },
    {
      ...DEFAULT_ANIMATOR,
      trigger: "exit",
      durationMs: 120,
      ease: "linear",
      props: { opacity: [1, 0] },
    },
  ],
  decorations: [],
  emoji: { enabled: true, size: 0.9 },
};
