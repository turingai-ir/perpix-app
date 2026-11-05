export const FILE_MANAGER_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
] as const;
import { z } from "zod";
import type { SchemaFileManagerUploadFileResponse } from "@/services/api/api";

export const mediaFactsSchema = z.object({
  kind: z.enum(["image", "video", "audio"]),
  width: z.number().positive().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  duration_seconds: z.number().nonnegative().nullable().optional(),
});
export type MediaFacts = z.infer<typeof mediaFactsSchema>;
export type UserFileItem = SchemaFileManagerUploadFileResponse & {
  media_metadata?: MediaFacts | null;
};
export const previewListSchema = z.object({
  files: z.array(
    z.object({
      file_uuid: z.string().min(1),
      preview_url: z.string().url(),
      download_url: z.string().url(),
      expire_at: z.string().datetime({ offset: true }).nullable().optional(),
    }),
  ),
});
export type FilePreviewUrls = z.infer<
  typeof previewListSchema
>["files"][number];
export const fileIdSchema = z.object({ uuid: z.string().min(1) });
export const userFilesSchema = z.object({
  files: z.array(
    z.object({
      file_name: z.string(),
      file_size: z.number().nonnegative(),
      content_type: z.string(),
      uuid: z.string().nullable().optional(),
      is_public: z.boolean().default(false),
      meta: z.record(z.string(), z.unknown()).optional(),
      media_metadata: mediaFactsSchema.nullable().optional(),
      created_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      expire_at: z.string().nullable().optional(),
    }),
  ),
  has_next: z.boolean(),
});
export const userFilesKey = ["get", "/api/v1/file-manager/user-files"] as const;
export const previewKey = (id: string) => ["file-manager", "preview", id];
export function canUseFileForGeneration(file: UserFileItem) {
  return (
    !file.expire_at || Date.parse(file.expire_at) > Date.now() + 60 * 60_000
  );
}
