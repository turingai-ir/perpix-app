import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { toast } from "sonner";

import * as store from "./store";

import { useFileManager, useReplaceUserFile } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export function useEditorSaveActions(fileUuid?: string) {
  const { t } = useAppTranslate();
  const { requestUpload } = useFileManager("image-editor");
  const { replaceFileState } = useReplaceUserFile();
  const setSaving = useSetAtom(store.savingAtom);

  const handleSave = useCallback(
    (dataUrl: string) => {
      const link = document.createElement("a");
      link.download = `perpix-edited-${Date.now()}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t("pages.editor.uploaderSuccess"));
    },
    [t],
  );

  const handleSaveToGallery = useCallback(
    async (dataUrl: string) => {
      setSaving(true);
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `perpix-edited-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        if (fileUuid) {
          await replaceFileState.mutateAsync({ fileUuid, file });
        } else {
          await requestUpload(file);
        }

        toast.success(t("pages.editor.saveToGallerySuccess"));
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("pages.editor.saveToGalleryError");
        toast.error(errorMessage);
      } finally {
        setSaving(false);
      }
    },
    [fileUuid, replaceFileState, requestUpload, setSaving, t],
  );

  return { handleSave, handleSaveToGallery };
}
