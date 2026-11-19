import { apiClient } from "@/shared/api";
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

/** Asks for a transcript; for a file that already has one, this returns it. */
export const requestTranscript = async (fileUuid: string) => {
  const { data } = await apiClient.POST("/api/v1/studio/transcripts", {
    body: { file_uuid: fileUuid },
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
