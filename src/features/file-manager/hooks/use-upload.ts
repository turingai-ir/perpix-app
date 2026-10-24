import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppTranslate } from "@/hooks/i18";
import { sessionStore } from "@/features/auth/session";
import { uploadFile } from "../services/upload";
import { fileUploadKey } from "../services/upload-session";
import { validateFile } from "../services/validation";
import {
  FileManagerError,
  requireOnline,
  toFileManagerError,
  UserFileError,
} from "../model/errors";
import { useUploadState } from "./use-upload-state";
import { userFilesKey } from "../model/types";

export function useFileManager(
  scope: string,
  options: { allowedFileTypes?: string[] } = {},
) {
  const { t } = useAppTranslate();
  const client = useQueryClient();
  const state = useUploadState(scope);
  const active = useRef(new Set<string>());
  const mutation = useMutation({
    mutationFn: ({ file, key }: { file: File; key: string }) =>
      uploadFile(file, key),
    retry: false,
    networkMode: "always",
  });
  const requestUpload = async (file: File): Promise<string> => {
    const cycle = sessionStore.getCycle();
    const key = fileUploadKey(scope, file);
    if (active.current.has(key))
      throw new Error(t("common.validationErrors.duplicateFile"));
    active.current.add(key);
    try {
      requireOnline();
      await validateFile(
        file,
        options.allowedFileTypes ?? ["image/jpeg", "image/png", "image/webp"],
      );
      state.start(key, file);
      const uuid = await mutation.mutateAsync({ file, key });
      if (sessionStore.getCycle() !== cycle)
        throw new FileManagerError("features.fileManager.errors.unauthorized");
      state.removePendingUpload(key);
      await client.invalidateQueries({ queryKey: userFilesKey });
      return uuid;
    } catch (error) {
      const typed = toFileManagerError(error);
      if (sessionStore.getCycle() === cycle) state.fail(key, file, typed.key);
      if (
        sessionStore.getCycle() === cycle &&
        typed.key.endsWith(".unknownUpload")
      )
        void client.invalidateQueries({ queryKey: userFilesKey });
      throw new UserFileError(t(typed.key), error);
    } finally {
      active.current.delete(key);
    }
  };
  return {
    requestUpload,
    pendingUploads: state.pendingUploads,
    removePendingUpload: state.removePendingUpload,
  };
}
