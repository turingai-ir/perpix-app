import { z } from "zod";
import { apiClient } from "@/services/api";
import { sessionStore } from "@/features/auth/session";
import { fileIdSchema } from "../model/contracts";
import {
  FileError,
  canRetryFileRequest,
  requireConnection,
  responseError,
} from "../model/file-error";
import { retryFileRequest } from "./retry-request";
import {
  getCompletion,
  saveCompletion,
  forgetCompletion,
} from "./upload-session";

const initiation = z.object({
  upload_id: z.string().min(1),
  object_name: z.string().min(1),
  uuid: z.string().min(1),
  chunk_size: z.number().int().positive(),
  parts_count: z.number().int().positive().max(10_000),
});
export function fileForm(file: File) {
  const form = new FormData();
  form.append("file", file, file.name);
  return form;
}
export async function transferFile(file: File, key: string) {
  requireConnection();
  const saved = getCompletion(key);
  if (saved) return complete(key, saved);
  if (file.size <= 5 * 1024 * 1024) {
    try {
      const { data, response } = await apiClient.POST(
        "/api/v1/file-manager/simple-upload",
        { body: { file: file.name }, bodySerializer: () => fileForm(file) },
      );
      if (!response.ok) throw responseError(response.status);
      const parsed = fileIdSchema.safeParse(data);
      if (!parsed.success)
        throw new FileError("features.fileManager.errors.unknownUpload");
      return parsed.data.uuid;
    } catch (error) {
      if (canRetryFileRequest(error))
        throw new FileError("features.fileManager.errors.unknownUpload");
      throw error;
    }
  }
  return multipart(file, key);
}
async function multipart(file: File, key: string) {
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
  if (!response.ok) throw responseError(response.status);
  const operation = initiation.parse(data);
  if (operation.parts_count !== Math.ceil(file.size / operation.chunk_size))
    throw new FileError("features.fileManager.errors.invalid");
  const parts: { part_number: number; etag: string }[] = [];
  for (let part = 1; part <= operation.parts_count; part++) {
    if (cycle !== sessionStore.getCycle()) throw responseError(401);
    const etag = await retryFileRequest(() => putPart(file, operation, part));
    parts.push({ part_number: part, etag });
  }
  if (cycle !== sessionStore.getCycle()) throw responseError(401);
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
  saveCompletion(key, body);
  return complete(key, body);
}
async function putPart(
  file: File,
  operation: z.infer<typeof initiation>,
  part: number,
) {
  requireConnection();
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
  if (!response.ok) throw responseError(response.status);
  const url = z
    .object({ presigned_url: z.string().url() })
    .parse(data).presigned_url;
  const start = (part - 1) * operation.chunk_size;
  const uploaded = await fetch(url, {
    method: "PUT",
    body: file.slice(start, start + operation.chunk_size),
    signal: AbortSignal.timeout(120_000),
  });
  if (!uploaded.ok) throw responseError(uploaded.status);
  const etag = uploaded.headers.get("ETag");
  if (!etag) throw new FileError("common.uploadErrors.etagMissing");
  return etag;
}
async function complete(
  key: string,
  body: NonNullable<ReturnType<typeof getCompletion>>,
) {
  try {
    const id = await retryFileRequest(async () => {
      const { data, response } = await apiClient.POST(
        "/api/v1/file-manager/multipart/complete",
        { body },
      );
      if (!response.ok) throw responseError(response.status);
      const parsed = fileIdSchema.safeParse(data);
      if (!parsed.success) throw responseError(503);
      return parsed.data.uuid;
    });
    forgetCompletion(key);
    return id;
  } catch (error) {
    if (!canRetryFileRequest(error)) forgetCompletion(key);
    throw error;
  }
}
