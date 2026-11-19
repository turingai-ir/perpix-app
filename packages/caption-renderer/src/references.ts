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

interface AnimatorPreset {
  title: string;
  /** What it does, in a few words, for the editor's list. */
  animator: Record<string, unknown>;
}

const word = { scope: "word" };
const letter = { scope: "char" };
const page = { scope: "page" };

/** Ready-made animators the editor adds with one click. */
export const ANIMATOR_PRESETS: Record<string, AnimatorPreset> = {
  fade_in: {
    title: "محو شدن (ورود)",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 200,
      ease: "power3.out",
      props: { opacity: [0, 1] },
    },
  },
  fade_out: {
    title: "محو شدن (خروج)",
    animator: {
      select: page,
      trigger: "exit",
      durationMs: 120,
      ease: "linear",
      props: { opacity: [1, 0] },
    },
  },
  pop_in: {
    title: "بالا آمدن با جهش",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 220,
      ease: "back.out",
      props: { opacity: [0, 1], scale: [0.6, 1] },
    },
  },
  zoom_punch: {
    title: "زوم ضربه‌ای",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 170,
      ease: "power3.out",
      props: { opacity: [0, 1], scale: [1.7, 1] },
    },
  },
  blur_in: {
    title: "ظاهر شدن از محو",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 320,
      ease: "power2.out",
      props: { opacity: [0, 1], blur: [18, 0] },
    },
  },
  slide_side: {
    title: "لغزیدن از کنار",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 260,
      ease: "power3.out",
      props: { opacity: [0, 1], x: [3, 0] },
    },
  },
  skew_in: {
    title: "کج وارد شدن",
    animator: {
      select: page,
      trigger: "enter",
      durationMs: 260,
      ease: "power3.out",
      props: { opacity: [0, 1], skewX: [-25, 0], x: [1.2, 0] },
    },
  },
  float: {
    title: "شناور ماندن",
    animator: {
      select: page,
      trigger: "loop",
      periodMs: 1800,
      ease: "sine.inOut",
      props: { y: [0, -0.1] },
    },
  },
  word_drop: {
    title: "افتادن کلمه‌ها",
    animator: {
      select: word,
      trigger: "enter",
      durationMs: 380,
      staggerMs: 60,
      ease: "bounce.out",
      props: { opacity: [0, 1], y: [-1.2, 0] },
    },
  },
  word_flip: {
    title: "چرخش کلمه‌ها",
    animator: {
      select: word,
      trigger: "enter",
      durationMs: 300,
      staggerMs: 90,
      ease: "back.out",
      props: { opacity: [0, 1], scaleX: [0, 1] },
    },
  },
  word_reveal: {
    title: "آشکار شدن کلمه (از اول)",
    animator: {
      select: word,
      trigger: "enter",
      from: "word",
      durationMs: 260,
      ease: "power2.out",
      props: { reveal: [0, 1] },
    },
  },
  word_tilt: {
    title: "کج و تصادفی",
    animator: {
      select: word,
      trigger: "enter",
      durationMs: 200,
      ease: "back.out",
      props: { opacity: [0, 1], scale: [0.5, 1] },
      jitter: { rotate: 7, x: 0, y: 0.06, scale: 0 },
      seed: 11,
    },
  },
  rubber: {
    title: "کش آمدن هنگام گفتن",
    animator: {
      select: word,
      trigger: "active",
      durationMs: 320,
      ease: "elastic.out",
      props: { scaleX: [1, 1.25], scaleY: [1, 0.85] },
    },
  },
  flash: {
    title: "چشمک رنگی هنگام گفتن",
    animator: {
      select: word,
      trigger: "active",
      durationMs: 220,
      ease: "power2.out",
      props: { tint: [1, 0] },
      tint: "#ffffff",
    },
  },
  glow_pulse: {
    title: "درخشش ضربانی کلمهٔ فعال",
    animator: {
      select: { scope: "word", states: ["active"] },
      trigger: "loop",
      periodMs: 600,
      ease: "sine.inOut",
      props: { glow: [0.4, 1] },
      tint: "#ffe066",
    },
  },
  shake: {
    title: "لرزش کلمهٔ فعال",
    animator: {
      select: { scope: "word", states: ["active"] },
      trigger: "loop",
      periodMs: 90,
      ease: "linear",
      props: { x: [-0.04, 0.04], rotate: [-2, 2] },
    },
  },
  letters_type: {
    title: "حروف: تایپ (لاتین)",
    animator: {
      select: letter,
      trigger: "enter",
      durationMs: 10,
      staggerMs: 45,
      ease: "linear",
      props: { opacity: [0, 1] },
    },
  },
  letters_bounce: {
    title: "حروف: جهش (لاتین)",
    animator: {
      select: letter,
      trigger: "enter",
      durationMs: 360,
      staggerMs: 35,
      ease: "bounce.out",
      props: { opacity: [0, 1], y: [-0.9, 0] },
    },
  },
  letters_wave: {
    title: "حروف: موج (لاتین)",
    animator: {
      select: letter,
      trigger: "loop",
      periodMs: 900,
      staggerMs: 70,
      ease: "sine.inOut",
      props: { y: [0, -0.16] },
    },
  },
  letters_pop: {
    title: "حروف: بزرگ شدن (لاتین)",
    animator: {
      select: letter,
      trigger: "enter",
      durationMs: 240,
      staggerMs: 40,
      ease: "back.out",
      props: { opacity: [0, 1], scale: [0, 1] },
    },
  },
};

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
  neon: make("نئون", {
    base: {
      fill: { color: "#ffffff" },
      stroke: { width: 0 },
      shadow: {
        enabled: true,
        color: "#ff4df0",
        blur: 18,
        offsetY: 0,
        opacity: 0.9,
      },
    },
    states: { upcoming: {}, active: { color: "#ffd1fb" }, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.fade_in?.animator,
      ANIMATOR_PRESETS.glow_pulse?.animator && {
        ...ANIMATOR_PRESETS.glow_pulse.animator,
        tint: "#ff4df0",
      },
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  typewriter: make("ماشین‌تحریر (لاتین)", {
    base: {
      font: { family: "Courier New", size: 64, weight: 700 },
      stroke: { width: 0 },
    },
    layout: { wordsPerPage: 5 },
    states: { upcoming: {}, active: {}, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.letters_type?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  blur_rise: make("ظاهر شدن از محو", {
    animators: [
      {
        select: page,
        trigger: "enter",
        durationMs: 340,
        ease: "power3.out",
        props: { opacity: [0, 1], blur: [20, 0], y: [0.4, 0] },
      },
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  glitch: make("گلیچ", {
    base: { font: { weight: 900 }, text: { uppercase: true } },
    states: { upcoming: {}, active: { color: "#00ffd5" }, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.skew_in?.animator,
      ANIMATOR_PRESETS.shake?.animator,
      ANIMATOR_PRESETS.flash?.animator && {
        ...ANIMATOR_PRESETS.flash.animator,
        tint: "#ff2d6f",
      },
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  flip_words: make("چرخش کلمه‌ها", {
    layout: { wordsPerPage: 4 },
    animators: [
      ANIMATOR_PRESETS.word_flip?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  letter_bounce: make("حروف جهنده (لاتین)", {
    base: { font: { weight: 900 }, text: { uppercase: true } },
    layout: { wordsPerPage: 3 },
    states: { upcoming: {}, active: { color: "#ffd400" }, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.letters_bounce?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  rubber_pop: make("کش‌دار", {
    states: { upcoming: {}, active: { color: "#7dffb2" }, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.word_drop?.animator,
      ANIMATOR_PRESETS.rubber?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  scribble: make("دایرهٔ دستی دور کلمهٔ کلیدی", {
    states: { upcoming: {}, active: {}, spoken: {} },
    roles: { key: { color: "#ffd400", scale: 1.1 } },
    roleRules: [{ role: "key", when: "longest" }],
    decorations: [
      {
        kind: "circle",
        select: { roles: ["key"], states: ["active", "spoken"] },
        color: "#ff4d6d",
        size: 5,
        reveal: "sweep",
      },
    ],
    animators: [
      ANIMATOR_PRESETS.pop_in?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  sparkle_hype: make("جرقه و درخشش", {
    states: { upcoming: {}, active: { color: "#ffe066" }, spoken: {} },
    decorations: [
      {
        kind: "sparkle",
        select: { states: ["active"] },
        color: "#fff3a0",
        count: 7,
      },
    ],
    animators: [
      ANIMATOR_PRESETS.pop_in?.animator,
      ANIMATOR_PRESETS.glow_pulse?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  rainbow: make("رنگین‌کمان", {
    base: {
      fill: {
        palette: ["#ff4d6d", "#ffd400", "#2bff88", "#00e5ff", "#c084fc"],
      },
      stroke: { width: 8 },
    },
    layout: { wordsPerPage: 4 },
    states: { upcoming: {}, active: {}, spoken: {} },
    animators: [
      ANIMATOR_PRESETS.word_drop?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  shine_gold: make("طلایی براق", {
    base: {
      font: { weight: 900 },
      fill: {
        color: "#ffd24a",
        gradient: { enabled: true, from: "#fff1a8", to: "#f5a300" },
      },
      stroke: { width: 7, color: "#3b2300" },
    },
    states: { upcoming: {}, active: {}, spoken: {} },
    decorations: [
      { kind: "shine", select: { states: ["active"] }, color: "#ffffff" },
    ],
    animators: [
      ANIMATOR_PRESETS.zoom_punch?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  progress_bar: make("نوار پیشرفت زیر کپشن", {
    base: { stroke: { width: 0 }, shadow: { enabled: false } },
    box: { enabled: true, opacity: 0.75, padding: 26, radius: 22 },
    states: { upcoming: {}, active: { color: "#ffd400" }, spoken: {} },
    decorations: [{ kind: "progress", color: "#ffd400", size: 6, radius: 3 }],
    animators: [
      ANIMATOR_PRESETS.fade_in?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  squiggle_line: make("خط موجی", {
    states: { upcoming: {}, active: {}, spoken: {} },
    decorations: [
      {
        kind: "squiggle",
        select: { states: ["active", "spoken"] },
        color: "#ff4d6d",
        size: 4,
        reveal: "sweep",
      },
    ],
    animators: [
      ANIMATOR_PRESETS.fade_in?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  frame_tech: make("قاب فناورانه", {
    base: {
      stroke: { width: 0 },
      shadow: {
        enabled: true,
        color: "#00e5ff",
        blur: 12,
        offsetY: 0,
        opacity: 0.6,
      },
    },
    states: { upcoming: {}, active: { color: "#00e5ff" }, spoken: {} },
    decorations: [
      {
        kind: "frame",
        select: { states: ["active"] },
        color: "#00e5ff",
        size: 3,
        radius: 6,
        reveal: "sweep",
      },
    ],
    animators: [
      ANIMATOR_PRESETS.slide_side?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
  strike_spoken: make("خط‌خوردن کلمه‌های گفته‌شده", {
    states: {
      upcoming: {},
      active: { color: "#ffd400" },
      spoken: { opacity: 0.55 },
    },
    decorations: [
      {
        kind: "strike",
        select: { states: ["spoken"] },
        color: "#ff4d6d",
        size: 5,
        reveal: "sweep",
      },
    ],
    animators: [
      ANIMATOR_PRESETS.fade_in?.animator,
      ANIMATOR_PRESETS.fade_out?.animator,
    ],
  }),
};
