/** A spoken word with its time, in milliseconds from the start of the file. */
export interface CaptionWord {
  text: string;
  startMs: number;
  endMs: number;
  /** Marked as a key word; the same as `role: "key"`. */
  emphasis?: boolean;
  /** The role this word is drawn in, set by hand or by a model; it beats the template's rules. */
  role?: string;
  /** An emoji shown over the word while it is on screen. */
  emoji?: string;
}

/** The words that are on screen together. */
export interface CaptionPage {
  words: CaptionWord[];
  startMs: number;
  endMs: number;
}

/** A pause this long ends a page by default, even if it has room for more words. */
export const DEFAULT_PAUSE_MS = 700;
/** How long a page lingers after its last word, unless the next page comes first. */
const HOLD_MS = 250;

/** Groups the words into pages of at most `wordsPerPage`, split at long pauses. */
export const buildPages = (
  words: readonly CaptionWord[],
  wordsPerPage: number,
  pauseMs: number = DEFAULT_PAUSE_MS,
): CaptionPage[] => {
  const pages: CaptionPage[] = [];
  let current: CaptionWord[] = [];
  const flush = () => {
    const first = current[0];
    const last = current[current.length - 1];
    if (first && last) {
      pages.push({ words: current, startMs: first.startMs, endMs: last.endMs });
    }
    current = [];
  };
  for (const word of words) {
    const previous = current[current.length - 1];
    if (
      current.length >= wordsPerPage ||
      (previous && word.startMs - previous.endMs > pauseMs)
    ) {
      flush();
    }
    current.push(word);
  }
  flush();
  return pages.map((page, index) => {
    const next = pages[index + 1];
    const limit = next ? next.startMs : Infinity;
    return { ...page, endMs: Math.min(page.endMs + HOLD_MS, limit) };
  });
};

/** The page on screen at a moment, if any. Pages are in time order. */
export const pageAt = (
  pages: readonly CaptionPage[],
  timeMs: number,
): { page: CaptionPage; index: number } | null => {
  let low = 0;
  let high = pages.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const page = pages[mid];
    if (!page) return null;
    if (timeMs < page.startMs) high = mid - 1;
    else if (timeMs >= page.endMs) low = mid + 1;
    else return { page, index: mid };
  }
  return null;
};

const RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
export const isRtl = (text: string) => RTL.test(text);
