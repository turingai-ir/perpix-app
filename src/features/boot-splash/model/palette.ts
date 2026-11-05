/** Colour spectrum of the PerPix logo: magenta → violet → blue → cyan. */
export const BRAND_SPECTRUM = {
  magenta: "#e02bd6",
  violet: "#8b3df0",
  blue: "#2d7bff",
  cyan: "#35c8ff",
  night: "#08090d",
} as const;

export interface FighterColors {
  base: string;
  tip: string;
  glow: string;
}

/** Left fighter carries the logo's first P, right fighter the second. */
export const FIGHTER_COLORS: Record<"left" | "right", FighterColors> = {
  left: {
    base: BRAND_SPECTRUM.violet,
    tip: BRAND_SPECTRUM.magenta,
    glow: BRAND_SPECTRUM.magenta,
  },
  right: {
    base: BRAND_SPECTRUM.blue,
    tip: BRAND_SPECTRUM.cyan,
    glow: BRAND_SPECTRUM.cyan,
  },
};
