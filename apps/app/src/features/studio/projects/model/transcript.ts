import { z } from "zod";
import type { SchemaStudioTranscriptLanguage } from "@/shared/api";

export const transcriptSummarySchema = z.object({
  uuid: z.string(),
  file_uuid: z.string(),
  status: z.enum(["PROCESSING", "COMPLETED", "FAILED"]),
  language: z.string().nullable(),
  duration_ms: z.number().nullable(),
  failure_message: z.string().nullable(),
  created_at: z.string(),
  expire_at: z.string(),
});
export type TranscriptSummary = z.infer<typeof transcriptSummarySchema>;

export const transcriptListSchema = z.object({
  items: z.array(transcriptSummarySchema),
});

export const transcriptWordSchema = z.object({
  text: z.string(),
  start_ms: z.number(),
  end_ms: z.number(),
  speaker: z.string().nullable(),
});

export const transcriptSchema = transcriptSummarySchema.extend({
  words: z.array(transcriptWordSchema),
  text: z.string(),
});
export type Transcript = z.infer<typeof transcriptSchema>;

/** How often a transcript that is still being made is read again. */
export const TRANSCRIPT_POLL_MS = 3_000;

export const SPEECH_LANGUAGES = [
  "auto",
  "en",
  "fa",
] as const satisfies readonly SchemaStudioTranscriptLanguage[];
