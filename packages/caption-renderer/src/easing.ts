import type { EaseName } from "./template";

const BACK = 1.70158;
const ELASTIC_PERIOD = 0.3;
const ELASTIC_SHIFT = (ELASTIC_PERIOD / (2 * Math.PI)) * Math.asin(1);

const bounceOut = (t: number): number => {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) {
    const u = t - 1.5 / 2.75;
    return 7.5625 * u * u + 0.75;
  }
  if (t < 2.5 / 2.75) {
    const u = t - 2.25 / 2.75;
    return 7.5625 * u * u + 0.9375;
  }
  const u = t - 2.625 / 2.75;
  return 7.5625 * u * u + 0.984375;
};

/**
 * The curves the templates may name, as pure functions of progress in [0, 1].
 * They follow GSAP's definitions of the same names, so a template looks the
 * same as when it was designed against GSAP, but nothing is played: every
 * value is computed from the time it is given, which lets the export render
 * any frame in any order and match the preview.
 */
export const EASINGS: Record<EaseName, (progress: number) => number> = {
  linear: (t) => t,
  "power2.out": (t) => 1 - (1 - t) ** 3,
  "power3.out": (t) => 1 - (1 - t) ** 4,
  "power2.inOut": (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  "back.out": (t) => {
    const u = t - 1;
    return u * u * ((BACK + 1) * u + BACK) + 1;
  },
  "bounce.out": bounceOut,
  "elastic.out": (t) =>
    t === 0 || t === 1
      ? t
      : 2 ** (-10 * t) *
          Math.sin(((t - ELASTIC_SHIFT) * (2 * Math.PI)) / ELASTIC_PERIOD) +
        1,
  "expo.out": (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
  "sine.inOut": (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};
