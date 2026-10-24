import { apiClient } from "@/services/api/client";
import type { SchemaFileManagerMultipartCompleteRequest } from "@/services/api/api";
import { fileResponseSchema } from "../model/types";
import { FileManagerError, httpError } from "../model/errors";

export function serializeFile(file: File) {
  const form = new FormData();
  form.append("file", file, file.name);
  return form;
}
export async function simpleUpload(file: File) {
  const { data, response } = await apiClient.POST(
    "/api/v1/file-manager/simple-upload",
    {
      body: { file: file.name },
      bodySerializer: () => serializeFile(file),
    },
  );
  if (!response.ok) throw httpError(response.status);
  const parsed = fileResponseSchema.safeParse(data);
  if (!parsed.success)
    throw new FileManagerError("features.fileManager.errors.unknownUpload");
  return parsed.data.uuid;
}
export async function completeUpload(
  body: SchemaFileManagerMultipartCompleteRequest,
) {
  const { data, response } = await apiClient.POST(
    "/api/v1/file-manager/multipart/complete",
    { body },
  );
  if (!response.ok) throw httpError(response.status);
  const parsed = fileResponseSchema.safeParse(data);
  if (!parsed.success) throw httpError(503);
  return parsed.data.uuid;
}
