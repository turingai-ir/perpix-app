import { DEFAULT_PAUSE_MS } from "@perpix/caption-renderer";
import type { Transcript } from "../../projects/model/transcript";
import {
  captionWordKey,
  correctedSourceWords,
  type CaptionCorrections,
} from "./caption-corrections";
import type { Timeline } from "./timeline";

export interface CaptionMatch {
  key: string;
  transcriptUuid: string;
  index: number;
  wordCount: number;
  clipName: string;
  timelineMs: number;
  before: string;
  phrase: string;
  after: string;
}

const leadingPunctuation = /^[\p{P}\s]+/u;
const trailingPunctuation = /[\p{P}\s]+$/u;

function searchable(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "")
    .split(/\s+/u)
    .map((token) =>
      token.replace(leadingPunctuation, "").replace(trailingPunctuation, ""),
    )
    .filter(Boolean)
    .join(" ");
}

export function findCaptionMatches(
  timeline: Timeline,
  transcriptsByFile: Readonly<Record<string, Transcript>>,
  corrections: CaptionCorrections,
  query: string,
): CaptionMatch[] {
  const needle = searchable(query);
  if (!needle) return [];
  const matches: CaptionMatch[] = [];
  for (const transcript of Object.values(transcriptsByFile)) {
    const segments = timeline.segments.filter(
      ({ clip }) => clip.file_uuid === transcript.file_uuid,
    );
    if (!segments.length) continue;
    const words = correctedSourceWords(transcript, corrections);
    const tokens = words.map(({ text }) => searchable(text));
    for (let start = 0; start < words.length; start++) {
      const first = words[start];
      let phrase = tokens[start];
      if (!phrase) continue;
      let end = start;
      while (needle.startsWith(`${phrase} `) && end + 1 < words.length) {
        const next = words[end + 1];
        if (
          !tokens[end + 1] ||
          next.speaker !== first.speaker ||
          next.start_ms - words[end].end_ms > DEFAULT_PAUSE_MS
        )
          break;
        phrase += ` ${tokens[++end]}`;
      }
      if (phrase !== needle) continue;
      const last = words[end];
      const segment = segments.find(
        ({ clip }) =>
          first.start_ms >= clip.source_in_ms &&
          last.end_ms <= clip.source_out_ms,
      );
      if (!segment) continue;
      matches.push({
        key: first.key,
        transcriptUuid: transcript.uuid,
        index: first.index,
        wordCount: last.index + last.length - first.index,
        clipName: segment.clip.name,
        timelineMs:
          segment.startMs + first.start_ms - segment.clip.source_in_ms,
        before: words
          .slice(Math.max(0, start - 3), start)
          .map(({ text }) => text)
          .join(" "),
        phrase: words
          .slice(start, end + 1)
          .map(({ text }) => text)
          .join(" "),
        after: words
          .slice(end + 1, end + 4)
          .map(({ text }) => text)
          .join(" "),
      });
      start = end;
    }
  }
  return matches.sort((a, b) => a.timelineMs - b.timelineMs);
}

export function applyCaptionMatches(
  corrections: CaptionCorrections,
  matches: readonly CaptionMatch[],
  replacement: string,
): CaptionCorrections {
  const trimmed = replacement.trim();
  if (!matches.length || !trimmed) return corrections;
  const next = { ...corrections };
  for (const match of matches) {
    const text = replacementForMatch(match, trimmed);
    for (let offset = 1; offset < match.wordCount; offset++) {
      delete next[captionWordKey(match.transcriptUuid, match.index + offset)];
    }
    next[match.key] =
      match.wordCount === 1 ? text : { text, wordCount: match.wordCount };
  }
  return next;
}

export function replacementForMatch(
  match: CaptionMatch,
  replacement: string,
): string {
  const text = replacement.trim();
  if (!text) return match.phrase;
  const prefix = match.phrase.match(leadingPunctuation)?.[0] ?? "";
  const suffix = match.phrase.match(trailingPunctuation)?.[0] ?? "";
  return `${text.startsWith(prefix) ? "" : prefix}${text}${text.endsWith(suffix) ? "" : suffix}`;
}
