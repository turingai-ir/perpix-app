import { apiClient, type SchemaRequestTranscriptRequest } from "@/shared/api";
import { transcriptListSchema, transcriptSchema } from "../model/transcript";

/** One per file: its current transcript, else its newest failed attempt. */
export const listTranscripts = async (
  fileUuids: string[],
  signal?: AbortSignal,
) => {
  const { data } = await apiClient.GET("/api/v1/studio/transcripts", {
    params: { query: { file_uuid: fileUuids } },
    signal,
  });
  return transcriptListSchema.parse(data).items;
};

/** Reuses the current transcript unless its completed UUID was selected for a rebuild. */
export const requestTranscript = async (
  body: SchemaRequestTranscriptRequest,
) => {
  const { data } = await apiClient.POST("/api/v1/studio/transcripts", {
    body,
  });
  return transcriptSchema.parse(data);
};

export const getTranscript = async (uuid: string, signal?: AbortSignal) => {
  const { data } = await apiClient.GET(
    "/api/v1/studio/transcripts/{transcript_uuid}",
    { params: { path: { transcript_uuid: uuid } }, signal },
  );
  return transcriptSchema.parse(data);
};
