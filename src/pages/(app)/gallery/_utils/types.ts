import type {
  FileManagerAllowedContentType,
  UserFileItem,
} from "@/feature/file-manager";

export type GalleryFilter = "all" | "image" | "video" | "audio";
export type GalleryMediaType = Exclude<GalleryFilter, "all">;
export type GalleryFile = UserFileItem & { uuid: string };

export type GalleryFilterItem = {
  key: GalleryFilter;
  label: string;
};

export type GalleryContentTypes = Record<
  GalleryFilter,
  readonly FileManagerAllowedContentType[]
>;
