import { apiClient } from "@/shared/api";
import {
  fileError,
  requireConnection,
  responseError,
} from "../model/file-error";

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
