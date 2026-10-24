import { z } from "zod";
import type { SchemaFileManagerUploadFileResponse } from "@/services/api/api";

export type UserFileItem = SchemaFileManagerUploadFileResponse;
export const previewSchema = z.object({
  file_uuid: z.string().min(1),
  preview_url: z.string().url(),
  download_url: z.string().url(),
  expire_at: z.string().datetime({ offset: true }).optional(),
});
export const previewsSchema = z.object({ files: z.array(previewSchema) });
export type FilePreviewUrls = z.infer<typeof previewSchema>;
export const fileResponseSchema = z.object({ uuid: z.string().min(1) });
export const userFileSchema = z.object({
  uuid: z.string().nullable().optional(),
  file_name: z.string(),
  file_size: z.number().nonnegative(),
  content_type: z.string(),
  is_public: z.boolean(),
  meta: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  expire_at: z.string().nullable().optional(),
  media_metadata: z
    .object({
      kind: z.enum(["image", "video", "audio"]),
      width: z.number().positive().nullable().optional(),
      height: z.number().positive().nullable().optional(),
      duration_seconds: z.number().nonnegative().nullable().optional(),
    })
    .nullable()
    .optional(),
});
export const userFilesSchema = z.object({
  files: z.array(userFileSchema),
  has_next: z.boolean(),
});
export const FILE_QUERY_KEY = ["file-manager"] as const;
export const userFilesKey = [...FILE_QUERY_KEY, "user-files"] as const;
export const previewKey = (id: string) => [...FILE_QUERY_KEY, "preview", id];

export enum FileManagerUploadStatus {
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  FAILED = "FAILED",
}
export interface PendingFile {
  id: string;
  file: File;
  name: string;
  status: FileManagerUploadStatus;
  errorKey?: string;
}
