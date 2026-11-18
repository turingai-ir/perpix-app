import { apiClient } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

export class UserActionError extends Error {
  constructor(
    readonly kind:
      "forbidden" | "not_found" | "validation" | "network" | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "UserActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new UserActionError(
        "forbidden",
        "اجازه دسترسی به این عملیات را ندارید.",
      );
    }
    if (status === 404) {
      throw new UserActionError(
        "not_found",
        "کاربر یا منبع مورد نظر یافت نشد.",
      );
    }
    if (status === 422) {
      throw new UserActionError("validation", "اطلاعات ارسالی معتبر نیست.");
    }
  }
  if (error instanceof UserActionError) {
    throw error;
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new UserActionError(
      "network",
      "خطای ارتباط با سرور. اتصال خود را بررسی کنید.",
    );
  }
  throw new UserActionError("server", "خطای غیرمنتظره در انجام عملیات رخ داد.");
}

export async function banUser(userUuid: string, reason?: string) {
  try {
    const result = await apiClient.PUT(
      "/api/admin/v1/auth/users/{user_uuid}/ban",
      {
        params: {
          path: { user_uuid: userUuid },
        },
        body: reason ? { reason } : null,
      },
    );
    if (result.error) {
      throw new UserActionError("server");
    }
    return result;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function unbanUser(userUuid: string, reason?: string) {
  try {
    const result = await apiClient.DELETE(
      "/api/admin/v1/auth/users/{user_uuid}/ban",
      {
        params: {
          path: { user_uuid: userUuid },
        },
        body: reason ? { reason } : null,
      },
    );
    if (result.error) {
      throw new UserActionError("server");
    }
    return result;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function revokeSession(
  userUuid: string,
  sessionUuid: string,
  reason?: string,
) {
  try {
    const result = await apiClient.DELETE(
      "/api/admin/v1/auth/users/{user_uuid}/sessions/{session_uuid}",
      {
        params: {
          path: { user_uuid: userUuid, session_uuid: sessionUuid },
        },
        body: reason ? { reason } : null,
      },
    );
    if (result.error) {
      throw new UserActionError("server");
    }
    return result;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function revokeAllSessions(userUuid: string, reason?: string) {
  try {
    const result = await apiClient.DELETE(
      "/api/admin/v1/auth/users/{user_uuid}/sessions",
      {
        params: {
          path: { user_uuid: userUuid },
        },
        body: reason ? { reason } : null,
      },
    );
    if (result.error) {
      throw new UserActionError("server");
    }
    return result;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function hardDeleteUser(phoneNumber: string) {
  try {
    const result = await apiClient.DELETE("/api/admin/v1/users", {
      body: { phone_number: phoneNumber },
    });
    if (result.error) {
      throw new UserActionError("server");
    }
    return result;
  } catch (error) {
    handleFetchError(error);
  }
}
