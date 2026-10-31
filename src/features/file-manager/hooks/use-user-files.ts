import { useInfiniteQuery } from "@tanstack/react-query";
import { loadUserFiles } from "../services/user-files";
import { userFilesKey } from "../model/contracts";
import { canRetryFileRequest } from "../model/file-error";

export const userFilesPageLimit = 20;
export function useInfiniteUserFiles({
  contentTypes,
  enabled = true,
  limit = userFilesPageLimit,
}: {
  contentTypes: readonly string[];
  enabled?: boolean;
  limit?: number;
}) {
  const types = [...new Set(contentTypes)].sort();
  const getUserFilesState = useInfiniteQuery({
    queryKey: [...userFilesKey, { contentTypes: types, limit }],
    queryFn: ({ pageParam, signal }) =>
      loadUserFiles(types, pageParam, limit, signal),
    initialPageParam: 0,
    enabled: enabled && types.length > 0,
    staleTime: 30_000,
    getNextPageParam: (page, _pages, offset) =>
      page.has_next ? offset + limit : undefined,
    retry: (count, error) => count < 1 && canRetryFileRequest(error),
  });
  return { getUserFilesState };
}
