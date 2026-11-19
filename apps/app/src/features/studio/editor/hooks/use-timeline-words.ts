import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { CaptionWord } from "@perpix/caption-renderer";
import type { TranscriptSummary } from "../../projects/model/transcript";
import { getTranscript } from "../../projects/services/transcripts";
import {
  timelineWords,
  type SourceWord,
  type Timeline,
} from "../model/timeline";

/**
 * The caption words of the whole timeline. A transcript's words are read once
 * it is done and never change, so they are kept for good.
 */
export function useTimelineWords(
  timeline: Timeline,
  summaries: readonly TranscriptSummary[] | undefined,
): { words: CaptionWord[]; pending: boolean } {
  const done = (summaries ?? []).filter((item) => item.status === "COMPLETED");
  const results = useQueries({
    queries: done.map((item) => ({
      queryKey: ["studio", "transcript", item.uuid],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getTranscript(item.uuid, signal),
      staleTime: Infinity,
    })),
  });

  // One stable key per set of loaded transcripts, so the words are rebuilt only when the data changes.
  const key = results.map((result) => result.data?.uuid ?? "").join("|");
  const words = useMemo(() => {
    const byFile = new Map<string, readonly SourceWord[]>();
    results.forEach((result) => {
      if (result.data) byFile.set(result.data.file_uuid, result.data.words);
    });
    return timelineWords(timeline, byFile);
    // `key` stands for `results`, whose identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, key]);

  return {
    words,
    pending:
      results.some((result) => result.isPending) ||
      (summaries ?? []).some((item) => item.status === "PROCESSING"),
  };
}
