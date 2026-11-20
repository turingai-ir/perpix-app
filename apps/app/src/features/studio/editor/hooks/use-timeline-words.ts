import { useMemo } from "react";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import type {
  Transcript,
  TranscriptSummary,
} from "../../projects/model/transcript";
import { getTranscript } from "../../projects/services/transcripts";
import {
  correctedSourceWords,
  type CaptionCorrections,
} from "../model/caption-corrections";
import {
  timelineWords,
  type SourceWord,
  type Timeline,
} from "../model/timeline";

const combineTranscripts = (
  results: readonly UseQueryResult<Transcript>[],
) => ({
  byFile: Object.fromEntries(
    results.flatMap(({ data }) =>
      data ? [[data.file_uuid, data] as const] : [],
    ),
  ),
  loading: results.some((result) => result.isPending),
});

/**
 * The caption words of the whole timeline. A transcript's words are read once
 * it is done and never change, so they are kept for good.
 */
export function useTimelineWords(
  timeline: Timeline,
  summaries: readonly TranscriptSummary[] | undefined,
  corrections: CaptionCorrections,
) {
  const done = (summaries ?? []).filter((item) => item.status === "COMPLETED");
  const { byFile: rawByFile, loading } = useQueries({
    queries: done.map((item) => ({
      queryKey: ["studio", "transcript", item.uuid],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getTranscript(item.uuid, signal),
      staleTime: Infinity,
    })),
    combine: combineTranscripts,
  });

  const byFile = useMemo(() => {
    const offsets = new Map(
      timeline.segments.map(({ clip }) => [
        clip.file_uuid,
        clip.local_source?.audio_start_ms ?? 0,
      ]),
    );
    return Object.fromEntries(
      Object.entries(rawByFile).map(([id, transcript]) => {
        const offset = offsets.get(id) ?? 0;
        if (!offset) return [id, transcript] as const;
        return [
          id,
          {
            ...transcript,
            words: transcript.words.map((word) => ({
              ...word,
              start_ms: word.start_ms + offset,
              end_ms: word.end_ms + offset,
            })),
          },
        ] as const;
      }),
    );
  }, [rawByFile, timeline]);

  const words = useMemo(() => {
    const sources = new Map<string, readonly SourceWord[]>();
    for (const transcript of Object.values(byFile)) {
      sources.set(
        transcript.file_uuid,
        correctedSourceWords(transcript, corrections),
      );
    }
    return timelineWords(timeline, sources);
  }, [timeline, byFile, corrections]);

  return {
    words,
    transcriptsByFile: byFile,
    pending:
      loading || (summaries ?? []).some((item) => item.status === "PROCESSING"),
  };
}
