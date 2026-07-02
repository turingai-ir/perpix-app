import { useAtom } from "jotai";
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
import type { SchemaFileManagerUploadFileResponse } from "@/services/api/api";

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

interface UseUserFilesOptions {
  contentTypes: readonly FileManagerAllowedContentType[];
  enabled?: boolean;
  limit?: number;
  offset?: number;
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
      return Promise.reject(
        Error(t("common.validationErrors.maxSize", { maxSizeMb })),
      );
    }
    if (!isAllowedFileType(file.type, allowedFileTypes)) {
      return Promise.reject(
        Error(t("common.validationErrors.invalidFileFormat")),
      );
    }
    if (file.type.startsWith("image/")) {
      const { width, height } = await readImageDimensions(file).catch(() => {
        throw new Error(t("common.validationErrors.imageDimensionsUnreadable"));
      });

      if (width < minImageDimension || height < minImageDimension) {
        return Promise.reject(
          Error(t("common.validationErrors.imageTooSmall")),
        );
      }
    }
    if (pendingUploads.get(file.name)) {
      return Promise.reject(Error(t("common.validationErrors.duplicateFile")));
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
        return Promise.reject(Error(uploadErrorMessage));
      }

      removePendingUpload(file.name);

      return Promise.resolve(uuid);
    } catch (e) {
      failPendingUpload(file);
      return Promise.reject(e instanceof Error ? e : Error(uploadErrorMessage));
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
  const { useQuery } = useReactQueryApi();
  const getFilePreviewState = useQuery(
    "get",
    "/file-manager/files/{file_uuid}/presigned-urls",
    {
      params: {
        path: {
          file_uuid: fileUuid ?? "",
        },
      },
    },
    { enabled: enabled && !!fileUuid },
  );

  return { getFilePreviewState };
};

export type UserFileItem = SchemaFileManagerUploadFileResponse;

export const useUserFiles = ({
  contentTypes,
  enabled = true,
  limit = 50,
  offset = 0,
}: UseUserFilesOptions) => {
  const { useQuery } = useReactQueryApi();

  const getUserFilesState = useQuery(
    "get",
    "/file-manager/user-files",
    {
      params: {
        query: {
          content_types: contentTypes,
          limit,
          offset,
        },
      },
    },
    {
      enabled: enabled && contentTypes.length > 0,
    },
  );

  return { getUserFilesState };
};
