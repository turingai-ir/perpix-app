import { useFileTime } from "./use-file-time";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { loadPreview } from "../services/preview-queue";
import { previewKey, type FilePreviewUrls } from "../model/contracts";
import { canRetryFileRequest } from "../model/file-error";

function options(id: string, enabled: boolean) {
  return {
    queryKey: previewKey(id),
    queryFn: () => loadPreview(id),
    enabled: enabled && !!id,
    gcTime: 300_000,
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
      state: { data: FilePreviewUrls | undefined; error: unknown };
    }) => {
      if (
        !query.state.data ||
        (query.state.error && !canRetryFileRequest(query.state.error))
      )
        return false;
      return query.state.data.expire_at
        ? Math.max(
            5_000,
            Date.parse(query.state.data.expire_at) - Date.now() - 30_000,
          )
        : 30_000;
    },
    refetchOnWindowFocus: true,
    retry: (count: number, error: unknown) =>
      count < 2 && canRetryFileRequest(error),
  };
}
function available(data: FilePreviewUrls | undefined, error: unknown) {
  return (
    !!data &&
    !(error && !canRetryFileRequest(error)) &&
    (!data.expire_at || Date.parse(data.expire_at) > Date.now())
  );
}
export function useFilePreview(id: string | undefined, enabled = true) {
  useFileTime(enabled);
  const result = useQuery(options(id ?? "", enabled));
  return {
    getFilePreviewState: {
      ...result,
      data: available(result.data, result.error) ? result.data : undefined,
    },
  };
}
export function useFilesPreviews(ids: readonly string[], enabled = true) {
  useFileTime(enabled);
  const unique = [...new Set(ids.filter(Boolean))];
  const results = useQueries({
    queries: unique.map((id) => options(id, enabled)),
  });
  const data: Record<string, FilePreviewUrls> = {};
  results.forEach((result, i) => {
    if (result.data && available(result.data, result.error))
      data[unique[i]] = result.data;
  });
  return {
    getFilesPreviewsState: {
      data,
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
      refetch: () => Promise.all(results.map((result) => result.refetch())),
    },
  };
}
export function useVisibleFilePreview(id: string) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback(
    (element: HTMLElement | null) => setNode(element),
    [],
  );
  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return { ref, visible, ...useFilePreview(id, visible) };
}
