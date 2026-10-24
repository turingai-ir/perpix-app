import { apiClient } from "@/services/api";
import {
  fileError,
  requireConnection,
  responseError,
} from "../model/file-error";
import { fileForm } from "./transfers";
import { validateUpload } from "./validate-upload";

export async function deleteUserFile(id: string) {
  requireConnection();
  try {
    const { response } = await apiClient.DELETE(
      "/api/v1/file-manager/files/{file_uuid}",
      { params: { path: { file_uuid: id } } },
    );
    if (!response.ok && response.status !== 404)
      throw responseError(response.status);
  } catch (error) {
    if (fileError(error).status !== 404) throw error;
  }
}
export async function replaceUserFile({
  fileUuid,
  file,
}: {
  fileUuid: string;
  file: File;
}) {
  requireConnection();
  await validateUpload(file, ["image/*", "audio/*", "video/*"]);
  const { data, response } = await apiClient.PUT(
    "/api/v1/file-manager/files/{file_uuid}",
    {
      params: { path: { file_uuid: fileUuid } },
      body: { file: file.name },
      bodySerializer: () => fileForm(file),
    },
  );
  if (!response.ok) throw responseError(response.status);
  return data;
}
