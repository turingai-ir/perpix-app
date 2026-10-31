import { useEffect, useState } from "react";
import { toast } from "sonner";

import { isMissingFilePreview, useFilePreview } from "@/features/file-manager";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { downloadFile } from "@/utils";

export function useVideoOutput(fileId: string) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState: preview } = useFilePreview(fileId);
  const isMissing = preview.isError && isMissingFilePreview(preview.error);
  const [checkedAt, setCheckedAt] = useState(Date.now);
  const [mediaAttempt, setMediaAttempt] = useState(0);
  const [failedMediaKey, setFailedMediaKey] = useState<string>();
  const expiresAt = Date.parse(preview.data?.expire_at ?? "");
  const expired = Number.isFinite(expiresAt) && expiresAt <= checkedAt;
  const previewUrl =
    expired || isMissing ? undefined : preview.data?.preview_url;
  const downloadUrl =
    expired || isMissing ? undefined : preview.data?.download_url;
  const isLoading = !previewUrl && (preview.isPending || preview.isFetching);
  const mediaKey = `${fileId}:${previewUrl ?? ""}:${mediaAttempt}`;
  const hasMediaError = failedMediaKey === mediaKey;

  useEffect(() => {
    if (!Number.isFinite(expiresAt) || expired) return;
    const timeout = window.setTimeout(
      () => setCheckedAt(Date.now()),
      Math.min(Math.max(0, expiresAt - Date.now() + 1), 2_147_483_647),
    );
    return () => window.clearTimeout(timeout);
  }, [expiresAt, expired, checkedAt]);

  const download = () => {
    if (!downloadUrl) return;
    if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      setCheckedAt(Date.now());
      return;
    }
    try {
      downloadFile(downloadUrl);
    } catch {
      toast.error(t("common.error"));
    }
  };

  const retry = async () => {
    if (isMissing || preview.isFetching) return;
    const result = await preview.refetch();
    // Remount failed native players even when the signed URL is unchanged.
    if (result.isSuccess) setMediaAttempt((attempt) => attempt + 1);
  };

  return {
    download,
    downloadUrl,
    hasMediaError,
    isMissing,
    isLoading,
    isRefreshing: preview.isFetching,
    mediaKey,
    onMediaError: () => setFailedMediaKey(mediaKey),
    previewUrl,
    retry,
  };
}
