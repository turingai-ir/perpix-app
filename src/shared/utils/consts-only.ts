//////////////////////////////////////////////////////////////////////
export const LANGUAGES = {
  ENGLISH: "en",
  FARSI: "fa",
} as const;
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
//////////////////////////////////////////////////////////////////////

//
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;
export type Theme = (typeof THEMES)[keyof typeof THEMES];

// SIZES

export const APP_LAYOUT_SIDEBAR_WIDTH = "18rem";
