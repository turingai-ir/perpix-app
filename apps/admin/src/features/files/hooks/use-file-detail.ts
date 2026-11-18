import { useReactQueryApi } from "@/hooks";

export function useFileDetail(fileUuid: string) {
  const api = useReactQueryApi();

  const fileQuery = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/files/{file_uuid}",
    {
      params: {
        path: {
          file_uuid: fileUuid,
        },
      },
    },
    {
      enabled: Boolean(fileUuid),
    },
  );

  const presignedUrlsQuery = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/files/{file_uuid}/presigned-urls",
    {
      params: {
        path: {
          file_uuid: fileUuid,
        },
      },
    },
    {
      enabled: Boolean(fileUuid),
    },
  );

  return {
    file: fileQuery.data,
    presignedUrls: presignedUrlsQuery.data,
    isLoading: fileQuery.isLoading || presignedUrlsQuery.isLoading,
    error: fileQuery.error || presignedUrlsQuery.error,
    refetch: () => {
      void fileQuery.refetch();
      void presignedUrlsQuery.refetch();
    },
  };
}
