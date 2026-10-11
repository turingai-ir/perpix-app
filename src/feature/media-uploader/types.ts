import type { FileManagerUploadStatus } from "@/feature/file-manager";

export type MediaPreviewType = "audio" | "image" | "video";
export type MediaUploadPresentation = "default" | "composer" | "video-dock";

export interface UploadedMediaItem {
  id: string;
}

export interface LocalMediaItem {
  id: string;
  errorKey?: string;
  file: File;
  status: FileManagerUploadStatus;
}

export interface MediaUploadStripProps {
  uploadedItems: UploadedMediaItem[];
  localItems: LocalMediaItem[];
  label?: string;
  showPlaceholder?: boolean;
  accept?: string;
  disabled?: boolean;
  previewType?: MediaPreviewType;
  presentation?: MediaUploadPresentation;
  maxItems?: number;
  onFileSelect?: (file: File) => void | Promise<string | void>;
  onUploadedFileSelect?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  onLocalDeleteClick?: (fileName: string) => void;
}
