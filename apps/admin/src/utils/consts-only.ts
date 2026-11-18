//////////////////////////////////////////////////////////////////////
export const DIRECTIONS = {
  LTR: "ltr",
  RTL: "rtl",
} as const;
export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
export const SUPPORTED_DIRECTIONS = Object.values(DIRECTIONS) as Direction[];
//////////////////////////////////////////////////////////////////////
export const LANGUAGES = {
  ENGLISH: "en",
  FARSI: "fa",
} as const;
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export const SUPPORTED_LANGUAGES = Object.values(LANGUAGES) as Language[];
//////////////////////////////////////////////////////////////////////
export const LOCALES = {
  "en-US": "en-US",
  "fa-IR": "fa-IR",
} as const;
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];
export const SUPPORTED_LOCALES = Object.values(LOCALES) as Locale[];
//////////////////////////////////////////////////////////////////////
export const CURRENCIES = {
  IRR: "IRR",
  TOMAN: "TOMAN",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AED: "AED",
} as const;
export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];
export const SUPPORTED_CURRENCIES = Object.values(CURRENCIES) as Currency[];

//
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;
export type Theme = (typeof THEMES)[keyof typeof THEMES];
export const SUPPORTED_THEMES = Object.values(THEMES) as Theme[];

// SIZES

export const APP_LAYOUT_SIDEBAR_WIDTH = "18rem";
