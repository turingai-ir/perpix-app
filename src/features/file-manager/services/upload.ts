import { z } from "zod";
import { apiClient } from "@/services/api/client";
import {
  FileManagerError,
  httpError,
  isTemporary,
  requireOnline,
  toFileManagerError,
} from "../model/errors";
import { simpleUpload, completeUpload } from "./transport";
import { retryTemporary } from "./retry";
import {
  getCompletion,
  saveCompletion,
  removeCompletion,
} from "./upload-session";
import { sessionStore } from "@/features/auth/session";

const initiationSchema = z.object({
  upload_id: z.string().min(1),
  object_name: z.string().min(1),
  uuid: z.string().min(1),
  chunk_size: z.number().int().positive(),
  parts_count: z.number().int().positive().max(10_000),
});
export async function uploadFile(file: File, recoveryKey: string) {
  requireOnline();
  const saved = getCompletion(recoveryKey);
  if (saved) return finishUpload(recoveryKey, saved);
  if (file.size <= 5 * 1024 * 1024) {
    try {
      return await simpleUpload(file);
    } catch (error) {
      if (isTemporary(error))
        throw new FileManagerError("features.fileManager.errors.unknownUpload");
      throw toFileManagerError(error);
    }
  }
  return multipartUpload(file, recoveryKey);
}
async function multipartUpload(file: File, recoveryKey: string) {
  const cycle = sessionStore.getCycle();
  const { data, response } = await apiClient.POST(
    "/api/v1/file-manager/multipart/initiate",
    {
      body: {
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
        meta: { source: "web" },
      },
    },
  );
  if (!response.ok) throw httpError(response.status);
  const operation = initiationSchema.parse(data);
  if (Math.ceil(file.size / operation.chunk_size) !== operation.parts_count) {
    throw new FileManagerError("features.fileManager.errors.invalid");
  }
  const parts: { part_number: number; etag: string }[] = [];
  for (let part = 1; part <= operation.parts_count; part++) {
    if (cycle !== sessionStore.getCycle())
      throw new FileManagerError("features.fileManager.errors.unauthorized");
    const etag = await retryTemporary(() => uploadPart(file, operation, part));
    parts.push({ part_number: part, etag });
  }
  const body = {
    upload_id: operation.upload_id,
    object_name: operation.object_name,
    file_uuid: operation.uuid,
    file_name: file.name,
    file_size: file.size,
    content_type: file.type,
    meta: { source: "web" },
    parts,
  };
  if (cycle !== sessionStore.getCycle())
    throw new FileManagerError("features.fileManager.errors.unauthorized");
  saveCompletion(recoveryKey, body);
  return finishUpload(recoveryKey, body);
}
async function uploadPart(
  file: File,
  operation: z.infer<typeof initiationSchema>,
  part: number,
) {
  requireOnline();
  const { data, response } = await apiClient.POST(
    "/api/v1/file-manager/multipart/presign-part",
    {
      body: {
        upload_id: operation.upload_id,
        object_name: operation.object_name,
        part_number: part,
      },
    },
  );
  if (!response.ok) throw httpError(response.status);
  const { presigned_url } = z.object({ presigned_url: z.url() }).parse(data);
  const start = (part - 1) * operation.chunk_size;
  const result = await fetch(presigned_url, {
    method: "PUT",
    body: file.slice(start, start + operation.chunk_size),
    signal: AbortSignal.timeout(120_000),
  });
  if (!result.ok) throw httpError(result.status);
  const etag = result.headers.get("ETag");
  if (!etag) throw new FileManagerError("common.uploadErrors.etagMissing");
  return etag;
}
async function finishUpload(
  key: string,
  body: Parameters<typeof completeUpload>[0],
) {
  try {
    const uuid = await retryTemporary(() => completeUpload(body));
    removeCompletion(key);
    return uuid;
  } catch (error) {
    if (!isTemporary(error)) removeCompletion(key);
    throw toFileManagerError(error);
  }
}
