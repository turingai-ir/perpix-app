import {
  FileManagerUploadStatus,
  resolveFileManagerContentTypes,
  type UserFileItem,
} from "@/feature/file-manager";

import type { LocalMediaItem, UploadedMediaItem } from "./types";

export type UserFileWithUuid = UserFileItem & { uuid: string };

export function getAcceptedContentTypes(accept: string) {
  return resolveFileManagerContentTypes(accept.split(","));
}

export function getUploadedItemIds(
  uploadedItems: readonly UploadedMediaItem[],
) {
  return uploadedItems.map((item) => item.id);
}

export function normalizeMediaIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );
  }

  return typeof value === "string" && value.length > 0 ? [value] : [];
}

export function toUploadedMediaItems(
  mediaIds: readonly string[],
): UploadedMediaItem[] {
  return mediaIds.map((id) => ({ id }));
}

export function toLocalMediaItems(
  uploads: Iterable<{ file: File; status: FileManagerUploadStatus }>,
): LocalMediaItem[] {
  return Array.from(uploads).map((upload) => ({
    file: upload.file,
    status: upload.status,
  }));
}

export function hasUploadingLocalItem(localItems: readonly LocalMediaItem[]) {
  return localItems.some(
    ({ status }) => status === FileManagerUploadStatus.UPLOADING,
  );
}

export function hasReachedMediaMaxItems(
  selectedIds: readonly string[],
  localItems: readonly LocalMediaItem[],
  maxItems: number | undefined,
) {
  return (
    maxItems !== undefined && selectedIds.length + localItems.length >= maxItems
  );
}

export function appendMediaId(
  currentIds: readonly string[],
  mediaId: string,
  maxItems: number | undefined,
) {
  if (currentIds.includes(mediaId)) return undefined;
  if (maxItems !== undefined && currentIds.length >= maxItems) return undefined;

  return [...currentIds, mediaId];
}

export function removeMediaId(currentIds: readonly string[], mediaId: string) {
  return currentIds.filter((id) => id !== mediaId);
}

export function getUserFilesWithUuid(
  files: readonly UserFileItem[] | undefined,
): UserFileWithUuid[] {
  return (files ?? []).filter(
    (file): file is UserFileWithUuid => typeof file.uuid === "string",
  );
}

export function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return "";

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
