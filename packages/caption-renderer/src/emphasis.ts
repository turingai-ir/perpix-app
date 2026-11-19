import type { CaptionConfig } from "./config";
import type { CaptionPage, CaptionWord } from "./words";

const letters = (text: string) => text.replace(/[^\p{L}\p{N}]/gu, "");

/**
 * Whether a word is a key word: marked in the transcript, or picked by the
 * template's rule. `longest` takes the longest word of each page, which is
 * a cheap stand-in for "the one that matters" until a smarter picker marks them.
 */
export const isEmphasized = (
  word: CaptionWord,
  page: CaptionPage,
  config: CaptionConfig,
): boolean => {
  if (word.emphasis) return true;
  const { auto } = config.emphasis;
  if (auto === "numbers") return /\p{N}/u.test(word.text);
  if (auto === "longest" && page.words.length > 1) {
    let longest = page.words[0];
    for (const candidate of page.words) {
      if (
        longest &&
        letters(candidate.text).length > letters(longest.text).length
      ) {
        longest = candidate;
      }
    }
    return longest === word;
  }
  return false;
};
