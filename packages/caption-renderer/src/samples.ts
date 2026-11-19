import type { CaptionConfig } from "./config";
import type { CaptionWord } from "./words";

const spoken = (
  sentence: string,
  startMs: number,
  perWordMs = 380,
): CaptionWord[] =>
  sentence.split(" ").map((text, index) => ({
    text,
    startMs: startMs + index * perWordMs,
    endMs: startMs + (index + 1) * perWordMs - 40,
  }));

/** Marks words of a sample as key words and gives some an emoji. */
const marked = (
  words: CaptionWord[],
  marks: Record<number, Partial<CaptionWord>>,
): CaptionWord[] => words.map((word, index) => ({ ...word, ...marks[index] }));

/** Sample words for previewing a look, in Persian and in English. */
export const SAMPLE_WORDS: Record<"fa" | "en", CaptionWord[]> = {
  fa: marked(
    [
      ...spoken("سلام به همه، امروز می‌خواهیم زیرنویس بسازیم", 300),
      ...spoken("خیلی ساده و سریع", 4000),
    ],
    {
      0: { emoji: "👋" },
      5: { emphasis: true },
      9: { emphasis: true, emoji: "🚀" },
    },
  ),
  en: marked(
    [
      ...spoken("Hello everyone, today we are making captions", 300),
      ...spoken("simple and really fast", 4000),
    ],
    {
      0: { emoji: "👋" },
      5: { emphasis: true },
      9: { emphasis: true, emoji: "🚀" },
    },
  ),
};

export const sampleDurationMs = (words: readonly CaptionWord[]): number =>
  (words[words.length - 1]?.endMs ?? 0) + 600;

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/** Starting points for a new template; each only says what differs from the default. */
export const STARTER_TEMPLATES: Record<string, DeepPartial<CaptionConfig>> = {
  karaoke: {
    animation: {
      entrance: "fade",
      entranceMs: 120,
      wordEffect: "wipe",
      spokenStays: true,
    },
  },
  pop: {
    text: { wordsPerPage: 3, lineHeight: 1.2 },
    animation: { entrance: "pop", wordEffect: "pop", wordScale: 1.25 },
  },
  highlighter: {
    text: { wordsPerPage: 4 },
    strokeWidth: 0,
    shadow: { enabled: false },
    colors: { text: "#ffffff", active: "#ffffff" },
    highlight: { color: "#7c3aed", padding: 12, radius: 16 },
    emphasis: { auto: "longest", color: "#ffd400", scale: 1.2, weight: 900 },
    animation: { entrance: "words", wordEntrance: "pop", wordEffect: "box" },
  },
  key_words: {
    text: { wordsPerPage: 5 },
    emphasis: {
      auto: "longest",
      color: "#ff4d6d",
      scale: 1.35,
      weight: 900,
      uppercase: true,
    },
    animation: { entrance: "slide-up", wordEffect: "none" },
  },
  gradient: {
    gradient: { enabled: true, from: "#ffffff", to: "#7dd3fc" },
    animation: { entrance: "zoom", wordEffect: "pop", wordScale: 1.12 },
  },
  boxed: {
    box: { enabled: true, opacity: 0.7, padding: 28, radius: 24 },
    strokeWidth: 0,
    shadow: { enabled: false },
    animation: { entrance: "slide-up", entranceMs: 250, wordEffect: "color" },
  },
  word_by_word: {
    text: { uppercase: true, wordsPerPage: 5, letterSpacing: 1 },
    animation: { entrance: "words", wordEntrance: "slide-up", exit: "none" },
  },
};
