import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { projectErrorKey } from "../model/project-error";
import { TRANSCRIPT_POLL_MS } from "../model/transcript";
import { listTranscripts, requestTranscript } from "../services/transcripts";

const transcriptsKey = (files: string[]) =>
  ["studio", "transcripts", ...files] as const;
const requestTranscriptKey = ["studio", "request-transcript"] as const;

export function usePendingTranscriptFiles() {
  return useMutationState({
    filters: { mutationKey: requestTranscriptKey, status: "pending" },
    select: (mutation) => {
      const request = mutation.state.variables;
      return typeof request === "object" &&
        request !== null &&
        "file_uuid" in request
        ? request.file_uuid
        : undefined;
    },
  });
}

/** The transcripts of these files, read again every few seconds while any is still being made. */
export function useTranscripts(fileUuids: string[]) {
  return useQuery({
    queryKey: transcriptsKey(fileUuids),
    queryFn: ({ signal }) => listTranscripts(fileUuids, signal),
    enabled: fileUuids.length > 0,
    refetchInterval: (query) =>
      query.state.data?.some((item) => item.status === "PROCESSING")
        ? TRANSCRIPT_POLL_MS
        : false,
  });
}

export function useRequestTranscript() {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  return useMutation({
    mutationKey: requestTranscriptKey,
    mutationFn: requestTranscript,
    onError: (error) => {
      const key = projectErrorKey(error);
      if (key) toast.error(t(key));
    },
    onSettled: () =>
      client.invalidateQueries({ queryKey: ["studio", "transcripts"] }),
  });
}
