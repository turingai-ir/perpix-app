import { apiClient } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import type {
  FileManagerAdminFileResponse,
  FileManagerAdminUpdateFileRequest,
  FileManagerAdminDeleteBulkResponse,
  FileManagerPresignedUrlsResponse,
} from "../model/types";

export class FileActionError extends Error {
  constructor(
    readonly kind:
      "forbidden" | "not_found" | "validation" | "network" | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "FileActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new FileActionError(
        "forbidden",
        "اجازه دسترسی به این عملیات فایل را ندارید.",
      );
    }
    if (status === 404) {
      throw new FileActionError("not_found", "فایل مورد نظر یافت نشد.");
    }
    if (status === 422) {
      throw new FileActionError(
        "validation",
        "اطلاعات ارسالی فایل معتبر نیست.",
      );
    }
  }
  if (error instanceof FileActionError) {
    throw error;
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new FileActionError(
      "network",
      "خطای شبکه در ارتباط با سرور. لطفاً مجدداً تلاش کنید.",
    );
  }
  throw new FileActionError("server", "خطای غیرمنتظره در سرور رخ داده است.");
}

export async function getFilePresignedUrls(
  fileUuid: string,
): Promise<FileManagerPresignedUrlsResponse> {
  try {
    const res = await apiClient.GET(
      "/api/admin/v1/file-manager/files/{file_uuid}/presigned-urls",
      {
        params: {
          path: {
            file_uuid: fileUuid,
          },
        },
      },
    );
    if (res.error) {
      throw new FileActionError("server");
    }
    return res.data as FileManagerPresignedUrlsResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function updateFile(
  fileUuid: string,
  body: FileManagerAdminUpdateFileRequest,
): Promise<FileManagerAdminFileResponse> {
  try {
    const res = await apiClient.PATCH(
      "/api/admin/v1/file-manager/files/{file_uuid}",
      {
        params: {
          path: {
            file_uuid: fileUuid,
          },
        },
        body,
      },
    );
    if (res.error) {
      throw new FileActionError("server");
    }
    return res.data as FileManagerAdminFileResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function deleteFile(
  fileUuid: string,
): Promise<FileManagerAdminFileResponse> {
  try {
    const res = await apiClient.DELETE(
      "/api/admin/v1/file-manager/files/{file_uuid}",
      {
        params: {
          path: {
            file_uuid: fileUuid,
          },
        },
      },
    );
    if (res.error) {
      throw new FileActionError("server");
    }
    return res.data as FileManagerAdminFileResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function deleteBulkFiles(
  fileUuids: string[],
): Promise<FileManagerAdminDeleteBulkResponse> {
  try {
    const res = await apiClient.POST(
      "/api/admin/v1/file-manager/files/delete-bulk",
      {
        body: {
          file_uuids: fileUuids,
        },
      },
    );
    if (res.error) {
      throw new FileActionError("server");
    }
    return res.data as FileManagerAdminDeleteBulkResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}
