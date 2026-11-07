import { APP_KEYS } from "@/shared/utils/app-keys";
import {
  LANGUAGES,
  THEMES,
  type Language,
  type Theme,
} from "@/shared/utils/consts-only";
import { atomWithSyncStorage, createSyncJotaiStorage } from "@/shared/lib/jotai";

// const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

interface globalAtom {
  theme: Theme;
  language: Language;
}

export const globalAtom = atomWithSyncStorage<globalAtom>(
  APP_KEYS.LOCAL_STORAGE.GLOBAL_JOTAI_ATOM,
  {
    // theme: isDarkMode ? THEMES.DARK : THEMES.LIGHT,
    theme: THEMES.DARK,
    language: LANGUAGES.FARSI,
  },
  createSyncJotaiStorage(),
);
