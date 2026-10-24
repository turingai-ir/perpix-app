import { useQueries, useQuery } from "@tanstack/react-query";
import { requestPreview } from "../services/previews";
import { isTemporary } from "../model/errors";
import { previewKey, type FilePreviewUrls } from "../model/types";
import { useFileClock } from "./use-file-clock";

const freshness = (data: FilePreviewUrls | undefined) => {
  if (!data?.expire_at) return 30_000;
  return Math.max(0, Date.parse(data.expire_at) - Date.now() - 30_000);
};
function previewOptions(id: string, enabled: boolean) {
  return {
    queryKey: previewKey(id),
    queryFn: () => requestPreview(id),
    enabled: enabled && !!id,
    gcTime: 5 * 60_000,
    staleTime: (query: {
      state: { data: FilePreviewUrls | undefined; dataUpdatedAt: number };
    }) =>
      query.state.data?.expire_at
        ? Math.max(
            0,
            Date.parse(query.state.data.expire_at) -
              query.state.dataUpdatedAt -
              30_000,
          )
        : 30_000,
    refetchInterval: (query: {
      state: {
        data: FilePreviewUrls | undefined;
        status: string;
        error: unknown;
      };
    }) =>
      (query.state.status === "error" && !isTemporary(query.state.error)) ||
      !query.state.data
        ? false
        : Math.max(5_000, freshness(query.state.data)),
    refetchOnWindowFocus: true,
    retry: (count: number, error: unknown) => count < 2 && isTemporary(error),
  };
}
export function useFilePreview(fileUuid: string | undefined, enabled = true) {
  const state = useQuery(previewOptions(fileUuid ?? "", enabled));
  const now = useFileClock();
  const expired =
    state.data?.expire_at && Date.parse(state.data.expire_at) <= now;
  const unavailable = state.isError && !isTemporary(state.error);
  return {
    getFilePreviewState: {
      ...state,
      data: expired || unavailable ? undefined : state.data,
    },
  };
}
export function useFilesPreviews(fileUuids: readonly string[], enabled = true) {
  const now = useFileClock();
  const ids = Array.from(new Set(fileUuids.filter(Boolean)));
  const results = useQueries({
    queries: ids.map((id) => previewOptions(id, enabled)),
  });
  const data: Record<string, FilePreviewUrls> = {};
  results.forEach((result, i) => {
    const expired =
      result.data?.expire_at && Date.parse(result.data.expire_at) <= now;
    if (
      result.data &&
      !expired &&
      !(result.isError && !isTemporary(result.error))
    )
      data[ids[i]] = result.data;
  });
  return {
    getFilesPreviewsState: {
      data,
      isError: results.some((result) => result.isError),
      isPending: results.some((result) => result.isPending),
      refetch: () => Promise.all(results.map((result) => result.refetch())),
    },
  };
}
