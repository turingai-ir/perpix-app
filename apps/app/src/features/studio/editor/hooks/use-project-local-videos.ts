import { useEffect, useMemo, useState } from "react";
import {
  useQueries,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  fingerprintVideo,
  loadLocalVideo,
  saveLocalVideo,
} from "../../projects/services/local-video";
import type { Clip, LocalVideoSource } from "../../projects/model/clips";

const localVideoKey = (projectUuid: string, id: string) =>
  ["studio", "local-video", projectUuid, id] as const;

const combineVideos = (
  results: readonly UseQueryResult<{ id: string; file: Blob | null }>[],
) => ({
  files: Object.fromEntries(
    results.flatMap(({ data }) =>
      data?.file ? [[data.id, data.file] as const] : [],
    ),
  ),
  pending: results.some((result) => result.isPending),
});

export function useProjectLocalVideos(
  projectUuid: string,
  clips: readonly Clip[],
) {
  const client = useQueryClient();
  const sources = useMemo(
    () =>
      new Map(
        clips.flatMap(({ local_source: source }) =>
          source ? [[source.id, source] as const] : [],
        ),
      ),
    [clips],
  );
  const { files, pending } = useQueries({
    queries: [...sources.values()].map((source) => ({
      queryKey: localVideoKey(projectUuid, source.id),
      queryFn: async () => ({
        id: source.id,
        file: await loadLocalVideo(projectUuid, source),
      }),
      staleTime: 0,
      retry: false,
    })),
    combine: combineVideos,
  });
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    const next = Object.fromEntries(
      Object.entries(files).map(([id, blob]) => [
        id,
        URL.createObjectURL(blob),
      ]),
    );
    let active = true;
    queueMicrotask(() => {
      if (active) setUrls(next);
    });
    return () => {
      active = false;
      Object.values(next).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const relink = async (
    source: LocalVideoSource,
    file: File,
  ): Promise<boolean> => {
    if (
      file.size !== source.size ||
      (await fingerprintVideo(file)) !== source.fingerprint
    )
      return false;
    await saveLocalVideo(projectUuid, source.id, file);
    client.setQueryData(localVideoKey(projectUuid, source.id), {
      id: source.id,
      file: await loadLocalVideo(projectUuid, source),
    });
    return true;
  };

  return { files, urls, pending, relink };
}
