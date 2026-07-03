import { useAtom } from "jotai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  pendingUploadsGroupedAtom,
  FileManagerUploadStatus,
  type PendingFile,
} from "./state";
import type { FileManagerAllowedContentType } from "./content-types";

import { useReactQueryApi } from "@/hook/app";
import { APP_I18_KEYS } from "@/services/i18";
import { useAppTranslate } from "@/hook";
import { apiClient } from "@/services/api";
import type { SchemaFileManagerUploadFileResponse } from "@/services/api/api";

export const userFilesPageLimit = 20;

const maxSizeMb = 100;
const maxSize = maxSizeMb * 1024 * 1024;
const fiveMb = 5 * 1024 * 1024;
const minImageDimension = 300;
const defaultAllowedFileTypes = ["image/png", "image/jpeg"];

function isAllowedFileType(
  fileType: string,
  allowedFileTypes: readonly string[],
) {
  return allowedFileTypes.some((allowedFileType) => {
    if (allowedFileType.endsWith("/*")) {
      return fileType.startsWith(allowedFileType.slice(0, -1));
    }

    return allowedFileType === fileType;
  });
}

const readImageDimensions = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      image.onload = null;
      image.onerror = null;
    };

    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image;

      cleanup();
      resolve({ width, height });
    };

    image.onerror = () => {
      cleanup();
      reject(new Error());
    };

    image.src = objectUrl;
  });

interface UseFileManagerOptions {
  allowedFileTypes?: string[];
}

interface UseInfiniteUserFilesOptions {
  contentTypes: readonly FileManagerAllowedContentType[];
  enabled?: boolean;
  limit?: number;
}

export const useFileManager = (
  requestId: string,
  options: UseFileManagerOptions = {},
) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { useMutation } = useReactQueryApi();
  const allowedFileTypes = options.allowedFileTypes ?? defaultAllowedFileTypes;

  const [allPendingUploads, setAllPendingUploads] = useAtom(
    pendingUploadsGroupedAtom,
  );

  const simpleUpload = useMutation("post", "/file-manager/simple-upload");
  const initiateMultipartUpload = useMutation(
    "post",
    "/file-manager/multipart/initiate",
  );
  const presignMultipartPart = useMutation(
    "post",
    "/file-manager/multipart/presign-part",
  );
  const completeMultipartUpload = useMutation(
    "post",
    "/file-manager/multipart/complete",
  );

  const pendingUploads = useMemo(
    () => allPendingUploads.get(requestId) || new Map<string, PendingFile>(),
    [allPendingUploads, requestId],
  );

  const removePendingUpload = (fileName: string) => {
    setAllPendingUploads((prev) => {
      const group = prev.get(requestId);
      if (!group) return prev;

      const next = new Map(prev);
      const nextGroup = new Map(group);

      nextGroup.delete(fileName);
      if (nextGroup.size === 0) {
        next.delete(requestId);
      } else {
        next.set(requestId, nextGroup);
      }

      return next;
    });
  };

  const failPendingUpload = (file: File) => {
    setAllPendingUploads((prev) => {
      const group = prev.get(requestId);
      if (!group) return prev;

      const next = new Map(prev);
      const nextGroup = new Map(group);

      nextGroup.set(file.name, {
        file,
        name: file.name,
        status: FileManagerUploadStatus.FAILED,
      });

      next.set(requestId, nextGroup);
      return next;
    });
  };

  const uploadSimpleFile = async (file: File) => {
    return simpleUpload.mutateAsync({
      body: { file: file as any },
      bodySerializer: (body) => {
        const file = body?.file as unknown as File;
        const formData = new FormData();
        formData.append("file", file, file.name);
        return formData;
      },
    });
  };

  const uploadMultipartFile = async (
    file: File,
    meta: Record<string, unknown> = {},
  ) => {
    const initiate = await initiateMultipartUpload.mutateAsync({
      body: {
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
        meta,
      },
    });

    const { upload_id, object_name, uuid, chunk_size, parts_count } = initiate;
    const uploadedParts: { part_number: number; etag: string }[] = [];

    for (let partNumber = 1; partNumber <= parts_count; partNumber += 1) {
      const start = (partNumber - 1) * chunk_size;
      const end = Math.min(start + chunk_size, file.size);
      const chunk = file.slice(start, end);

      const presign = await presignMultipartPart.mutateAsync({
        body: {
          upload_id,
          object_name,
          part_number: partNumber,
        },
      });

      const uploadRes = await fetch(presign.presigned_url, {
        method: "PUT",
        body: chunk,
      });

      if (!uploadRes.ok) {
        throw new Error(t("common.uploadErrors.partFailed"));
      }

      const etag = uploadRes.headers.get("ETag");

      if (!etag) {
        throw new Error(t("common.uploadErrors.etagMissing"));
      }

      uploadedParts.push({
        part_number: partNumber,
        etag,
      });
    }

    return completeMultipartUpload.mutateAsync({
      body: {
        upload_id,
        object_name,
        file_uuid: uuid,
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
        meta,
        parts: uploadedParts,
      },
    });
  };

  const requestUpload = async (file: File): Promise<string> => {
    const uploadErrorMessage = t("common.errorOnUploading");

    if (file.size > maxSize) {
      throw new Error(t("common.validationErrors.maxSize", { maxSizeMb }));
    }
    if (!isAllowedFileType(file.type, allowedFileTypes)) {
      throw new Error(t("common.validationErrors.invalidFileFormat"));
    }
    if (file.type.startsWith("image/")) {
      const { width, height } = await readImageDimensions(file).catch(() => {
        throw new Error(t("common.validationErrors.imageDimensionsUnreadable"));
      });

      if (width < minImageDimension || height < minImageDimension) {
        throw new Error(t("common.validationErrors.imageTooSmall"));
      }
    }
    if (pendingUploads.get(file.name)) {
      throw new Error(t("common.validationErrors.duplicateFile"));
    }

    setAllPendingUploads((prev) => {
      const next = new Map(prev);
      const group = new Map(next.get(requestId));

      group.set(file.name, {
        file,
        name: file.name,
        status: FileManagerUploadStatus.UPLOADING,
      });

      next.set(requestId, group);
      return next;
    });

    try {
      const res =
        file.size > fiveMb
          ? await uploadMultipartFile(file, { source: "web" })
          : await uploadSimpleFile(file);

      const uuid = res.uuid;

      if (!uuid) {
        failPendingUpload(file);
        throw new Error(uploadErrorMessage);
      }

      removePendingUpload(file.name);

      return uuid;
    } catch (e) {
      failPendingUpload(file);
      throw e instanceof Error ? e : new Error(uploadErrorMessage);
    }
  };

  return {
    requestUpload,
    removePendingUpload,
    pendingUploads,
  };
};

export const useFilePreview = (
  fileUuid: string | undefined,
  enabled = true,
) => {
  const getFilePreviewState = useQuery({
    queryKey: ["file-manager", "files", "presigned-urls", fileUuid],
    enabled: enabled && !!fileUuid,
    queryFn: async () => {
      const previewUrls = await fetchFilePreviewUrls([fileUuid ?? ""]);
      const filePreviewUrls = previewUrls[fileUuid ?? ""];

      if (!filePreviewUrls) {
        throw new Error("Failed to fetch file preview URL");
      }

      return filePreviewUrls;
    },
  });

  return { getFilePreviewState };
};

export type FilePreviewUrls = FilePreviewUrlsResponse;

type FilePreviewUrlsResponse = {
  download_url: string;
  preview_url: string;
};

const presignedUrlsBatchSize = 20;

const chunkFileUuids = (fileUuids: readonly string[]) => {
  const chunks: string[][] = [];

  for (
    let index = 0;
    index < fileUuids.length;
    index += presignedUrlsBatchSize
  ) {
    chunks.push(fileUuids.slice(index, index + presignedUrlsBatchSize));
  }

  return chunks;
};

const fetchFilePreviewUrls = async (fileUuids: readonly string[]) => {
  const responses = await Promise.all(
    chunkFileUuids(fileUuids).map(async (chunk) => {
      const { data, error, response } = await apiClient.POST(
        "/file-manager/files/presigned-urls" as never,
        {
          body: {
            file_uuids: chunk,
          },
        } as never,
      );

      if (error || !response.ok || !data) {
        throw new Error("Failed to fetch file preview URLs");
      }

      return data as {
        files?: readonly {
          file_uuid: string;
          preview_url: string;
          download_url: string;
        }[];
      };
    }),
  );

  return responses.reduce<Record<string, FilePreviewUrlsResponse>>(
    (previewUrlsByFileUuid, currentResponse) => {
      currentResponse.files?.forEach((file) => {
        previewUrlsByFileUuid[file.file_uuid] = {
          download_url: file.download_url,
          preview_url: file.preview_url,
        };
      });

      return previewUrlsByFileUuid;
    },
    {},
  );
};

export const useFilesPreviews = (
  fileUuids: readonly string[],
  enabled = true,
) => {
  const safeFileUuids = useMemo(
    () => Array.from(new Set(fileUuids.filter(Boolean))).sort(),
    [fileUuids],
  );

  const getFilesPreviewsState = useQuery({
    queryKey: ["file-manager", "files", "presigned-urls", safeFileUuids],
    enabled: enabled && safeFileUuids.length > 0,
    queryFn: () => fetchFilePreviewUrls(safeFileUuids),
  });

  return { getFilesPreviewsState };
};

export type UserFileItem = SchemaFileManagerUploadFileResponse;

export const useDeleteUserFile = () => {
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const userFilesQueryKey = queryOptions(
    "get",
    "/file-manager/user-files",
  ).queryKey;

  const deleteFileState = useMutation({
    mutationFn: async (fileUuid: string) => {
      const { error, response } = await apiClient.DELETE(
        "/file-manager/files/{file_uuid}" as never,
        {
          params: {
            path: {
              file_uuid: fileUuid,
            },
          },
        } as never,
      );

      if (error || !response.ok) {
        throw new Error("Failed to delete file");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userFilesQueryKey });
    },
  });

  return { deleteFileState };
};

export const useInfiniteUserFiles = ({
  contentTypes,
  enabled = true,
  limit = userFilesPageLimit,
}: UseInfiniteUserFilesOptions) => {
  const { useInfiniteQuery } = useReactQueryApi();

  const getUserFilesState = useInfiniteQuery(
    "get",
    "/file-manager/user-files",
    {
      params: {
        query: {
          content_types: contentTypes,
          limit,
          offset: 0,
        },
      },
    },
    {
      enabled: enabled && contentTypes.length > 0,
      initialPageParam: 0,
      pageParamName: "offset",
      getNextPageParam: (lastPage, _pages, lastPageParam) =>
        lastPage?.has_next ? Number(lastPageParam ?? 0) + limit : undefined,
    },
  );

  return { getUserFilesState };
};
