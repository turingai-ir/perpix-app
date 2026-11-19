import { normalizeCaptionConfig, type CaptionConfig } from "./legacy";
import type { Raw } from "./parse";

const REFERENCE_HEIGHT = 1080;

/**
 * A version 1 config as the equivalent version 2 one (raw, to be normalised).
 * Version 1 measured the block's slide in frame heights, version 2 measures it
 * in font sizes, hence the conversion.
 */
export const legacyToTemplate = (input: Raw): Raw => {
  const old: CaptionConfig = normalizeCaptionConfig(input);
  const { animation, emphasis, highlight } = old;
  const inFontSizes = (frameHeights: number) =>
    (frameHeights * REFERENCE_HEIGHT) / old.font.size;

  const animators: Raw[] = [];
  const page = { select: { scope: "page" } };
  const entered = (extra: Raw) =>
    animators.push({
      ...page,
      trigger: "enter",
      durationMs: animation.entranceMs,
      ...extra,
    });
  switch (animation.entrance) {
    case "fade":
      entered({ ease: "power3.out", props: { opacity: [0, 1] } });
      break;
    case "pop":
      entered({
        ease: "back.out",
        props: { opacity: [0, 1], scale: [0.6, 1] },
      });
      break;
    case "zoom":
      entered({
        ease: "power3.out",
        props: { opacity: [0, 1], scale: [1.5, 1] },
      });
      break;
    case "slide-up":
      entered({
        ease: "power3.out",
        props: { opacity: [0, 1], y: [inFontSizes(0.08), 0] },
      });
      break;
    case "bounce":
      entered({
        ease: "bounce.out",
        props: { opacity: [0, 1], y: [-inFontSizes(0.12), 0] },
      });
      break;
    case "words": {
      const word = {
        select: { scope: "word" },
        trigger: "enter",
        from: "word",
        durationMs: 220,
      };
      if (animation.wordEntrance === "fade") {
        animators.push({
          ...word,
          ease: "power3.out",
          props: { opacity: [0, 1] },
        });
      } else if (animation.wordEntrance === "pop") {
        animators.push({
          ...word,
          ease: "back.out",
          props: { opacity: [0, 1], scale: [0.5, 1] },
        });
      } else {
        animators.push({
          ...word,
          ease: "power3.out",
          props: { opacity: [0, 1], y: [0.5, 0] },
        });
      }
      break;
    }
    case "none":
      break;
  }
  if (animation.exit === "fade" && animation.exitMs > 0) {
    animators.push({
      ...page,
      trigger: "exit",
      durationMs: animation.exitMs,
      ease: "linear",
      props: { opacity: [1, 0] },
    });
  }
  if (animation.wordEffect === "pop") {
    animators.push({
      select: { scope: "word" },
      trigger: "active",
      durationMs: 140,
      ease: "back.out",
      props: { scale: [1, animation.wordScale] },
    });
  }

  const decorations: Raw[] = [];
  if (animation.wordEffect === "wipe") {
    decorations.push({
      kind: "wipe",
      select: {
        states: animation.spokenStays ? ["active", "spoken"] : ["active"],
      },
      color: old.colors.active,
      reveal: "sweep",
    });
  } else if (animation.wordEffect === "box") {
    decorations.push({
      kind: "pill",
      select: { states: ["active"] },
      color: highlight.color,
      size: highlight.padding,
      radius: highlight.radius,
      reveal: "fade",
    });
  }

  const recolors =
    animation.wordEffect === "color" ||
    animation.wordEffect === "pop" ||
    animation.wordEffect === "box";
  const states: Raw = {
    upcoming: {},
    active: recolors ? { color: old.colors.active } : {},
    spoken:
      recolors && animation.spokenStays ? { color: old.colors.active } : {},
  };

  return {
    version: 2,
    base: {
      font: old.font,
      text: {
        uppercase: old.text.uppercase,
        align: old.text.align,
        lineHeight: old.text.lineHeight,
        letterSpacing: old.text.letterSpacing,
      },
      fill: { color: old.colors.text, gradient: old.gradient },
      stroke: { width: old.strokeWidth, color: old.colors.stroke },
      shadow: old.shadow,
    },
    layout: {
      anchor: old.layout.anchor,
      offset: old.layout.offset,
      maxWidth: old.layout.maxWidth,
      wordsPerPage: old.text.wordsPerPage,
    },
    box: old.box,
    states,
    roles: {
      key: {
        color: emphasis.color,
        family: emphasis.family || undefined,
        weight: emphasis.weight,
        italic: emphasis.italic,
        uppercase: emphasis.uppercase,
        scale: emphasis.scale,
      },
    },
    roleRules:
      emphasis.auto === "longest"
        ? [{ role: "key", when: "longest" }]
        : emphasis.auto === "numbers"
          ? [{ role: "key", when: "number" }]
          : [],
    animators,
    decorations,
    emoji: old.emoji,
  };
};
