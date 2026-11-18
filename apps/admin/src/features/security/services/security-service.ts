import { apiClient } from "@/services/api/client";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

export class SecurityActionError extends Error {
  constructor(
    public readonly type:
      | "unauthorized"
      | "forbidden"
      | "not_found"
      | "validation"
      | "network"
      | "server",
    message?: string,
  ) {
    super(message || type);
    this.name = "SecurityActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401) {
      throw new SecurityActionError(
        "unauthorized",
        "نشست شما معتبر نیست. لطفاً مجدداً وارد شوید.",
      );
    }
    if (status === 403) {
      throw new SecurityActionError(
        "forbidden",
        "شما دسترسی ادمین لازم برای این عملیات امنیتی را ندارید.",
      );
    }
    if (status === 404) {
      throw new SecurityActionError(
        "not_found",
        "نشست یا توکن مورد نظر یافت نشد یا قبلاً لغو شده است.",
      );
    }
    if (status === 422) {
      throw new SecurityActionError(
        "validation",
        "شناسه یا اطلاعات ارسالی نامعتبر است.",
      );
    }
  }
  if (error instanceof SecurityActionError) throw error;
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new SecurityActionError(
      "network",
      "خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.",
    );
  }
  if (error instanceof Error) {
    throw new SecurityActionError("server", error.message);
  }
  throw new SecurityActionError(
    "server",
    "خطای غیرمنتظره‌ای در انجام عملیات امنیتی رخ داد.",
  );
}

export async function revokeUserSession(
  userUuid: string,
  sessionUuid: string,
): Promise<void> {
  try {
    const res = await apiClient.DELETE(
      "/api/admin/v1/auth/users/{user_uuid}/sessions/{session_uuid}",
      {
        params: {
          path: {
            user_uuid: userUuid,
            session_uuid: sessionUuid,
          },
        },
      },
    );
    if (res.error) {
      const detail = (res.error as { detail?: string })?.detail;
      throw new SecurityActionError(
        "server",
        detail || "خطا در لغو نشست کاربر.",
      );
    }
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function revokeApiToken(tokenUuid: string): Promise<void> {
  try {
    const res = await apiClient.DELETE(
      "/api/admin/v1/auth/api-tokens/{token_uuid}",
      {
        params: {
          path: {
            token_uuid: tokenUuid,
          },
        },
      },
    );
    if (res.error) {
      const detail = (res.error as { detail?: string })?.detail;
      throw new SecurityActionError(
        "server",
        detail || "خطا در ابطال توکن API.",
      );
    }
  } catch (error) {
    return handleFetchError(error);
  }
}
