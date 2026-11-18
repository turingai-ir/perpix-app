import { useReactQueryApi } from "@/hooks";
import type { AdminSort, FilesRow } from "../model/types";

export interface UseFilesListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  sizeMinBytes?: number;
  sizeMaxBytes?: number;
  resourceUuid?: string;
  userUuid?: string;
  search?: string;
  contentType?: string;
  isPublic?: boolean;
  expired?: boolean;
}

export type FilesRowItem = FilesRow;

export function useFilesList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  sizeMinBytes,
  sizeMaxBytes,
  resourceUuid,
  userUuid,
  search,
  contentType,
  isPublic,
  expired,
}: UseFilesListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    size_min_bytes: sizeMinBytes,
    size_max_bytes: sizeMaxBytes,
    resource_uuid: resourceUuid || undefined,
    user_uuid: userUuid || undefined,
    search: search || undefined,
    content_type: contentType || undefined,
    is_public: isPublic,
    expired,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/files",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    files: (data?.items ?? []) as unknown as FilesRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
