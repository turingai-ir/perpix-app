import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserFiles } from "../services/files";
import type { FileManagerAllowedContentType } from "../model/content-types";
import { userFilesKey } from "../model/types";

export const userFilesPageLimit = 20;
export function useInfiniteUserFiles({
  contentTypes,
  enabled = true,
  limit = userFilesPageLimit,
}: {
  contentTypes: readonly FileManagerAllowedContentType[];
  enabled?: boolean;
  limit?: number;
}) {
  const types = [...new Set(contentTypes)].sort();
  const getUserFilesState = useInfiniteQuery({
    queryKey: [...userFilesKey, { contentTypes: types, limit }],
    queryFn: ({ pageParam, signal }) =>
      fetchUserFiles(types, pageParam, limit, signal),
    initialPageParam: 0,
    enabled: enabled && types.length > 0,
    getNextPageParam: (last, _pages, offset) =>
      last.has_next ? offset + limit : undefined,
    staleTime: 30_000,
  });
  return { getUserFilesState };
}
