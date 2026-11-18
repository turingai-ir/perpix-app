import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";

import { isMissingFilePreview, useFilePreview } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { downloadFile } from "@/shared/utils";

/**
 * Signed preview of a generated file. An URL that expired before mount is not
 * shown; a media element that fails to load marks only that URL as failed.
 */
export function useMediaPreview(
  fileId: string,
  onMissingChange?: (missing: boolean) => void,
) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isDownloading, setIsDownloading] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string>();
  const [mountedAt] = useState(Date.now);
  const { getFilePreviewState } = useFilePreview(fileId);

  const expireAt = getFilePreviewState.data?.expire_at
    ? Date.parse(getFilePreviewState.data.expire_at)
    : Number.NaN;
  const isExpired = Number.isFinite(expireAt) && expireAt <= mountedAt;
  const isPreviewLoading =
    getFilePreviewState.isPending ||
    (isExpired && getFilePreviewState.isFetching);
  const isMissing =
    getFilePreviewState.isError &&
    isMissingFilePreview(getFilePreviewState.error);
  const mediaUrl = isExpired
    ? undefined
    : getFilePreviewState.data?.preview_url;
  const downloadUrl = isExpired
    ? undefined
    : getFilePreviewState.data?.download_url;
  const isMediaError = !!mediaUrl && failedUrl === mediaUrl;
  const isError = getFilePreviewState.isError || isMediaError;

  useEffect(() => onMissingChange?.(isMissing), [isMissing, onMissingChange]);

  const retryPreview = async () => {
    const result = await getFilePreviewState.refetch();
    if (result.isSuccess) setFailedUrl(undefined);
  };

  const handleDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || isDownloading) return;

    event.preventDefault();

    try {
      setIsDownloading(true);
      downloadFile(downloadUrl);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadUrl,
    handleDownload,
    isDownloading,
    isError,
    isMissing,
    isPreviewLoading,
    isRefreshing: getFilePreviewState.isFetching,
    markMediaFailed: setFailedUrl,
    mediaUrl,
    retryPreview,
  };
}
