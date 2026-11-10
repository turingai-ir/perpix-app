import { useEffect, useState } from "react";
import { toast } from "sonner";

import { isMissingFilePreview, useFilePreview } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { downloadFile } from "@/shared/utils";

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
  // Keep the URL the player loaded: the signed URL is refreshed before it
  // expires, and swapping it would remount <video> and restart playback.
  const [pinned, setPinned] = useState<{
    attempt: number;
    expiresAt: number;
    url: string;
  }>();
  const pinnedExpired =
    pinned !== undefined &&
    Number.isFinite(pinned.expiresAt) &&
    pinned.expiresAt <= checkedAt;
  if (
    previewUrl &&
    (!pinned || pinned.attempt !== mediaAttempt || pinnedExpired) &&
    pinned?.url !== previewUrl
  ) {
    setPinned({ attempt: mediaAttempt, expiresAt, url: previewUrl });
  }
  const playbackUrl = previewUrl ? (pinned?.url ?? previewUrl) : undefined;
  const isLoading = !previewUrl && (preview.isPending || preview.isFetching);
  const mediaKey = `${fileId}:${playbackUrl ?? ""}:${mediaAttempt}`;
  const hasMediaError = failedMediaKey === mediaKey;
  const nextExpiry = Math.min(
    expiresAt,
    pinned && !pinnedExpired ? pinned.expiresAt : Number.POSITIVE_INFINITY,
  );

  useEffect(() => {
    if (!Number.isFinite(nextExpiry) || nextExpiry <= checkedAt) return;
    const timeout = window.setTimeout(
      () => setCheckedAt(Date.now()),
      Math.min(Math.max(0, nextExpiry - Date.now() + 1), 2_147_483_647),
    );
    return () => window.clearTimeout(timeout);
  }, [nextExpiry, checkedAt]);

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
    previewUrl: playbackUrl,
    retry,
  };
}
