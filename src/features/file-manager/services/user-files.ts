import { apiClient } from "@/services/api";
import { userFilesSchema } from "../model/contracts";
import { responseError } from "../model/file-error";

export async function loadUserFiles(
  types: readonly string[],
  offset: number,
  limit: number,
  signal: AbortSignal,
) {
  const { data, response } = await apiClient.GET(
    "/api/v1/file-manager/user-files",
    { params: { query: { content_types: types, offset, limit } }, signal },
  );
  if (!response.ok) throw responseError(response.status);
  return userFilesSchema.parse(data);
}
