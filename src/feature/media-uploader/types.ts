import type { FileManagerUploadStatus } from "@/feature/file-manager";

export type MediaPreviewType = "audio" | "image" | "video";

export interface UploadedMediaItem {
  id: string;
}

export interface LocalMediaItem {
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
  onFileSelect?: (file: File) => void | Promise<string | void>;
  onUploadedFileSelect?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  onLocalDeleteClick?: (fileName: string) => void;
}
