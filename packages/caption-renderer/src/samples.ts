import type { CaptionConfig } from "./config";
import type { CaptionWord } from "./words";

const spoken = (sentence: string, startMs: number, perWordMs = 380): CaptionWord[] =>
  sentence.split(" ").map((text, index) => ({
    text,
    startMs: startMs + index * perWordMs,
    endMs: startMs + (index + 1) * perWordMs - 40,
  }));

/** Sample words for previewing a look, in Persian and in English. */
export const SAMPLE_WORDS: Record<"fa" | "en", CaptionWord[]> = {
  fa: [
    ...spoken("سلام به همه، امروز می‌خواهیم زیرنویس بسازیم", 300),
    ...spoken("خیلی ساده و سریع", 4000),
  ],
  en: [
    ...spoken("Hello everyone, today we are making captions", 300),
    ...spoken("simple and really fast", 4000),
  ],
};

export const sampleDurationMs = (words: readonly CaptionWord[]): number =>
  (words[words.length - 1]?.endMs ?? 0) + 600;

/** Starting points for a new template; each is a partial config. */
export const STARTER_TEMPLATES: Record<string, Partial<CaptionConfig>> = {
  karaoke: {
    colors: { text: "#ffffff", active: "#ffd400", stroke: "#000000" },
    animation: {
      entrance: "fade",
      entranceMs: 120,
      exit: "fade",
      exitMs: 100,
      wordEffect: "wipe",
      wordScale: 1,
      spokenStays: true,
    },
  },
  pop: {
    text: {
      uppercase: false,
      align: "center",
      lineHeight: 1.2,
      letterSpacing: 0,
      wordsPerPage: 3,
    },
    animation: {
      entrance: "pop",
      entranceMs: 200,
      exit: "none",
      exitMs: 0,
      wordEffect: "pop",
      wordScale: 1.25,
      spokenStays: false,
    },
  },
  boxed: {
    box: { enabled: true, color: "#000000", opacity: 0.7, padding: 28, radius: 24 },
    strokeWidth: 0,
    shadow: { enabled: false, color: "#000000", blur: 0, offsetX: 0, offsetY: 0, opacity: 0 },
    animation: {
      entrance: "slide-up",
      entranceMs: 250,
      exit: "fade",
      exitMs: 150,
      wordEffect: "color",
      wordScale: 1,
      spokenStays: false,
    },
  },
  word_by_word: {
    text: {
      uppercase: true,
      align: "center",
      lineHeight: 1.2,
      letterSpacing: 1,
      wordsPerPage: 5,
    },
    animation: {
      entrance: "words",
      entranceMs: 0,
      exit: "none",
      exitMs: 0,
      wordEffect: "color",
      wordScale: 1,
      spokenStays: false,
    },
  },
};
