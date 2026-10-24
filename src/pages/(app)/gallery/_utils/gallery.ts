import { FILE_MANAGER_ALLOWED_CONTENT_TYPES } from "@/feature/file-manager";
import { getUserFilesWithUuid } from "@/feature/media-uploader";

import type {
  GalleryContentTypes,
  GalleryFilterItem,
  GalleryMediaType,
} from "./types";

export const galleryContentTypes: GalleryContentTypes = {
  all: FILE_MANAGER_ALLOWED_CONTENT_TYPES,
  image: FILE_MANAGER_ALLOWED_CONTENT_TYPES.filter((type) =>
    type.startsWith("image/"),
  ),
  video: FILE_MANAGER_ALLOWED_CONTENT_TYPES.filter((type) =>
    type.startsWith("video/"),
  ),
  audio: FILE_MANAGER_ALLOWED_CONTENT_TYPES.filter((type) =>
    type.startsWith("audio/"),
  ),
};

export function getGalleryFilters(
  t: (key: string) => string,
): GalleryFilterItem[] {
  return [
    { key: "all", label: t("pages.gallery.filters.all") },
    { key: "image", label: t("pages.gallery.filters.image") },
    { key: "video", label: t("pages.gallery.filters.video") },
    { key: "audio", label: t("pages.gallery.filters.audio") },
  ];
}

export function getGalleryMediaType(contentType: string): GalleryMediaType {
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("audio/")) return "audio";
  return "image";
}

export function getGalleryFiles(pages: unknown) {
  if (!Array.isArray(pages)) return [];

  return getUserFilesWithUuid(
    pages.flatMap((page) =>
      page && typeof page === "object" && Array.isArray(page.files)
        ? page.files
        : [],
    ),
  );
}
