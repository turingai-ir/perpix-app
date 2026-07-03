import { FILE_MANAGER_ALLOWED_CONTENT_TYPES } from "@/feature/file-manager";

import type {
  GalleryContentTypes,
  GalleryFile,
  GalleryFilterItem,
  GalleryMediaType,
} from "./types";

export const galleryContentTypes: GalleryContentTypes = {
  all: FILE_MANAGER_ALLOWED_CONTENT_TYPES,
  image: ["image/jpeg", "image/png"],
  video: ["video/mp4"],
  audio: ["audio/mp3", "audio/mpeg", "audio/wav", "audio/wave", "audio/x-wav"],
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

export function getGalleryFiles(pages: unknown): GalleryFile[] {
  if (!Array.isArray(pages)) return [];

  return pages.flatMap((page) => {
    if (!page || typeof page !== "object") return [];

    const files = (page as { files?: unknown }).files;
    if (!Array.isArray(files)) return [];

    return files.filter(
      (file): file is GalleryFile =>
        typeof file === "object" &&
        file !== null &&
        typeof (file as { uuid?: unknown }).uuid === "string",
    );
  });
}
