import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { projectErrorKey } from "../model/project-error";
import { TRANSCRIPT_POLL_MS } from "../model/transcript";
import { listTranscripts, requestTranscript } from "../services/transcripts";

const transcriptsKey = (files: string[]) =>
  ["studio", "transcripts", ...files] as const;

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
    mutationFn: requestTranscript,
    onError: (error) => {
      const key = projectErrorKey(error);
      if (key) toast.error(t(key));
    },
    onSettled: () =>
      client.invalidateQueries({ queryKey: ["studio", "transcripts"] }),
  });
}
