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
