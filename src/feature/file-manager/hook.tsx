import { useAtom } from "jotai";
import { useMemo } from "react";

import {
  pendingUploadsGroupedAtom,
  FileManagerUploadStatus,
  type PendingFile,
} from "./state";

import { useReactQueryApi } from "@/hook/app";
import { APP_I18_KEYS } from "@/services/i18";
import { useAppTranslate } from "@/hook";

const maxSizeMb = 50;
const maxSize = maxSizeMb * 1024 * 1024;
const FiveMb = 5 * 1024 * 1024;
const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

export const useFileManager = (requestId: string) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { useMutation } = useReactQueryApi();

  const [allPendingUploads, setAllPendingUploads] = useAtom(
    pendingUploadsGroupedAtom,
  );

  const simpleUpload = useMutation("post", "/file-manager/simple-upload");

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

  const requestUpload = async (file: File): Promise<string> => {
    if (file.size > maxSize) {
      return Promise.reject(
        Error(t("common.validationErrors.maxSize", { maxSizeMb })),
      );
    }
    if (!allowedFileTypes.includes(file.type)) {
      return Promise.reject(t("common.validationErrors.invalidFileFormat"));
    }
    if (pendingUploads.get(file.name)) {
      return Promise.reject(t("common.validationErrors.duplicateFile"));
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

    if (file.size < FiveMb) {
      try {
        const res = await simpleUpload.mutateAsync({
          body: { file: file as any },
          bodySerializer: (body) => {
            const file = body?.file as unknown as File;
            const formData = new FormData();
            formData.append("file", file, file.name);
            return formData;
          },
        });

        setAllPendingUploads((prev) => {
          const group = prev.get(requestId);
          if (!group) return prev;

          const next = new Map(prev);
          const nextGroup = new Map(group);

          nextGroup.delete(file.name);
          if (nextGroup.size === 0) {
            next.delete(requestId);
          } else {
            next.set(requestId, nextGroup);
          }

          return next;
        });

        const uuid = res.uuid;

        if (!uuid) {
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
          return Promise.reject(t("common.errorOnUploading"));
        }

        return Promise.resolve(uuid);
      } catch (e) {
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
        return Promise.reject(t("common.errorOnUploading"));
      }
    }

    return Promise.reject(t("common.errorOnUploading"));
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
    "/file-manager/files/{file_uuid}/download",
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
