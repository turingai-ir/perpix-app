import { useAtom } from "jotai";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  filesPreviewAtom,
  pendingUploadsGroupedAtom,
  FileManagerPendingUploadStatus,
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

  const [filesPreview, setFilesPreview] = useAtom(filesPreviewAtom);
  const [allPendingUploads, setAllPendingUploads] = useAtom(
    pendingUploadsGroupedAtom,
  );

  const simpleUpload = useMutation("post", "/file-manager/simple-upload");
  const getFileUrl = useMutation(
    "get",
    "/file-manager/files/{file_uuid}/download",
  );

  const pendingUploads = useMemo(
    () => allPendingUploads.get(requestId) || new Map<string, PendingFile>(),
    [allPendingUploads, requestId],
  );

  const getFilePreview = async (fileUuid: string) => {
    const cachedUrl = filesPreview.get(fileUuid);
    if (cachedUrl) return cachedUrl;

    const res = await getFileUrl.mutateAsync({
      params: { path: { file_uuid: fileUuid } },
    });

    setFilesPreview((prev) => {
      const next = new Map(prev);
      next.set(fileUuid, res.presigned_url);
      return next;
    });

    return res.presigned_url;
  };

  const requestUpload = async (file: File) => {
    if (file.size > maxSize) {
      toast.error(String(t("common.validationErrors.maxSize", { maxSizeMb })));
      return Promise.reject(
        Error(t("common.validationErrors.maxSize", { maxSizeMb })),
      );
    }
    if (!allowedFileTypes.includes(file.type)) {
      toast.error(String(t("common.validationErrors.invalidFileFormat")));
      return Promise.reject(t("common.validationErrors.invalidFileFormat"));
    }
    if (pendingUploads.get(file.name)) {
      toast.error(String(t("common.validationErrors.duplicateFile")));
      return Promise.reject(t("common.validationErrors.duplicateFile"));
    }

    setAllPendingUploads((prev) => {
      const next = new Map(prev);
      const group = new Map(next.get(requestId));

      group.set(file.name, {
        file,
        name: file.name,
        status: FileManagerPendingUploadStatus.UPLOADING,
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
              status: FileManagerPendingUploadStatus.FAILED,
            });

            next.set(requestId, nextGroup);
            return next;
          });
          return Promise.reject(Error());
        }

        await getFilePreview(uuid);
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
            status: FileManagerPendingUploadStatus.FAILED,
          });

          next.set(requestId, nextGroup);
          return next;
        });
        return Promise.reject(Error());
      }
    }
  };

  return {
    requestUpload,
    pendingUploads,
    getFilePreview,
    filesPreview,
  };
};
