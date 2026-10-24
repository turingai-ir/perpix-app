import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppTranslate } from "@/hooks";
import { sessionStore } from "@/features/auth/session";
import { transferFile } from "../services/transfers";
import { uploadKey } from "../services/upload-session";
import { validateUpload } from "../services/validate-upload";
import {
  fileError,
  requireConnection,
  responseError,
  UserFileError,
} from "../model/file-error";
import { userFilesKey } from "../model/contracts";
import { useUploadState } from "./upload-state";

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
      transferFile(file, key),
    networkMode: "always",
    retry: false,
  });
  async function requestUpload(file: File): Promise<string> {
    const key = uploadKey(scope, file),
      cycle = sessionStore.getCycle();
    if (active.current.has(key))
      throw new Error(t("common.validationErrors.duplicateFile"));
    active.current.add(key);
    try {
      requireConnection();
      await validateUpload(
        file,
        options.allowedFileTypes ?? ["image/jpeg", "image/png", "image/webp"],
      );
      state.start(key, file);
      const id = await mutation.mutateAsync({ file, key });
      if (cycle !== sessionStore.getCycle()) throw responseError(401);
      state.removePendingUpload(key);
      void client.invalidateQueries({ queryKey: userFilesKey });
      return id;
    } catch (error) {
      const typed = fileError(error);
      if (cycle === sessionStore.getCycle()) {
        state.fail(key, file, typed.key);
        if (typed.key.endsWith(".unknownUpload"))
          void client.invalidateQueries({ queryKey: userFilesKey });
      }
      throw new UserFileError(t(typed.key), error);
    } finally {
      active.current.delete(key);
    }
  }
  return {
    requestUpload,
    pendingUploads: state.pendingUploads,
    removePendingUpload: state.removePendingUpload,
  };
}
