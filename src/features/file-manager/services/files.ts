import { apiClient } from "@/services/api/client";
import type { FileManagerAllowedContentType } from "../model/content-types";
import { httpError, requireOnline, toFileManagerError } from "../model/errors";
import { serializeFile } from "./transport";
import { validateFile } from "./validation";
import { userFilesSchema } from "../model/types";

export async function fetchUserFiles(
  contentTypes: readonly FileManagerAllowedContentType[],
  offset: number,
  limit: number,
  signal: AbortSignal,
) {
  const { data, response } = await apiClient.GET(
    "/api/v1/file-manager/user-files",
    {
      params: { query: { content_types: contentTypes, offset, limit } },
      signal,
    },
  );
  if (!response.ok || !data) throw httpError(response.status);
  return userFilesSchema.parse(data);
}
export async function deleteFile(fileUuid: string) {
  requireOnline();
  try {
    const { response } = await apiClient.DELETE(
      "/api/v1/file-manager/files/{file_uuid}",
      { params: { path: { file_uuid: fileUuid } } },
    );
    if (!response.ok && response.status !== 404)
      throw httpError(response.status);
  } catch (error) {
    const typed = toFileManagerError(error);
    if (typed.status !== 404) throw typed;
  }
}
export async function replaceFile({
  fileUuid,
  file,
}: {
  fileUuid: string;
  file: File;
}) {
  requireOnline();
  await validateFile(file, []);
  const { data, response } = await apiClient.PUT(
    "/api/v1/file-manager/files/{file_uuid}",
    {
      params: { path: { file_uuid: fileUuid } },
      body: { file: file.name },
      bodySerializer: () => serializeFile(file),
    },
  );
  if (!response.ok) throw httpError(response.status);
  return data;
}
