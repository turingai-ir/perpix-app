import { useCallback, useEffect, useState } from "react";

import type { useGenerationPromptBox } from "@/features/generation/hooks";

/**
 * Visible file fields of the video form, and whether any of them is still
 * uploading. The studio stays busy until every reference has uploaded.
 */
export function useVideoReferenceUploads(
  studio: ReturnType<typeof useGenerationPromptBox>,
) {
  const { dynamicForm, setIsUploadingMedia } = studio;
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const fields = dynamicForm.orderedFieldNames.filter((name) => {
    const type = dynamicForm.getFieldMeta(name)?.inputType;
    return (
      dynamicForm.isFieldVisible(name) &&
      (type === "file" || type === "file-list")
    );
  });
  const reportUpload = useCallback((name: string, uploading: boolean) => {
    setUploads((current) =>
      current[name] === uploading ? current : { ...current, [name]: uploading },
    );
  }, []);
  const uploading = fields.some((name) => uploads[name]);
  useEffect(() => {
    setIsUploadingMedia(uploading);
  }, [uploading, setIsUploadingMedia]);
  useEffect(() => () => setIsUploadingMedia(false), [setIsUploadingMedia]);

  return { fields, reportUpload };
}
