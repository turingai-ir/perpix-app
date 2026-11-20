import type { Clip } from "../../projects/model/clips";
import type { Transcript } from "../../projects/model/transcript";
import { wordOverlapsClip } from "./timeline";

interface PhraseCorrection {
  text: string;
  wordCount: number;
}

type CaptionCorrection = string | PhraseCorrection;
export type CaptionCorrections = Record<string, CaptionCorrection>;

export const captionWordKey = (transcriptUuid: string, index: number) =>
  `${transcriptUuid}:${index}`;

export function readCaptionCorrections(
  document: Record<string, unknown>,
): CaptionCorrections {
  const value = document.caption_corrections;
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries: [string, unknown][] = Object.entries(value);
  return Object.fromEntries(
    entries.filter((entry): entry is [string, CaptionCorrection] =>
      isCaptionCorrection(entry[1]),
    ),
  );
}

function isCaptionCorrection(value: unknown): value is CaptionCorrection {
  if (typeof value === "string") return Boolean(value.trim());
  return Boolean(
    value &&
    typeof value === "object" &&
    "text" in value &&
    typeof value.text === "string" &&
    value.text.trim() &&
    "wordCount" in value &&
    typeof value.wordCount === "number" &&
    Number.isSafeInteger(value.wordCount) &&
    value.wordCount > 1,
  );
}

export function writeCaptionCorrections(
  document: Record<string, unknown>,
  corrections: CaptionCorrections,
): Record<string, unknown> {
  const next = { ...document };
  if (Object.keys(corrections).length) next.caption_corrections = corrections;
  else delete next.caption_corrections;
  return next;
}

export function updateCaptionCorrection(
  corrections: CaptionCorrections,
  key: string,
  text: string | null,
): CaptionCorrections {
  const existing = corrections[key];
  if (
    (typeof existing === "object" ? existing.text : (existing ?? null)) === text
  ) {
    return corrections;
  }
  const next = { ...corrections };
  if (text === null) delete next[key];
  else next[key] = typeof existing === "object" ? { ...existing, text } : text;
  return next;
}

export interface EditableCaptionWord {
  key: string;
  sourceMs: number;
  endMs: number;
  original: string;
  text: string;
}

export function correctedSourceWords(
  transcript: Transcript,
  corrections: CaptionCorrections,
) {
  const words = transcript.words;
  const corrected = [];
  for (let index = 0; index < words.length;) {
    const word = words[index];
    const key = captionWordKey(transcript.uuid, index);
    const correction = corrections[key];
    const length =
      typeof correction === "object" &&
      correction.wordCount <= words.length - index
        ? correction.wordCount
        : 1;
    const original =
      length === 1
        ? word.text
        : words
            .slice(index, index + length)
            .map((source) => source.text)
            .join(" ");
    corrected.push({
      ...word,
      key,
      index,
      length,
      original,
      text:
        typeof correction === "string"
          ? correction
          : length > 1 && correction
            ? correction.text
            : original,
      end_ms: length === 1 ? word.end_ms : words[index + length - 1].end_ms,
    });
    index += length;
  }
  return corrected;
}

export function editableCaptionWords(
  transcript: Transcript,
  clip: Clip,
  corrections: CaptionCorrections,
): EditableCaptionWord[] {
  return correctedSourceWords(transcript, corrections).flatMap((word) => {
    if (!wordOverlapsClip(word, clip)) return [];
    return {
      key: word.key,
      sourceMs: Math.max(word.start_ms, clip.source_in_ms),
      endMs: Math.min(word.end_ms, clip.source_out_ms),
      original: word.original,
      text: word.text,
    };
  });
}
