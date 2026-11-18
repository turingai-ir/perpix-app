import { apiClient } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import type {
  ActivateUserSubscriptionRequest,
  DeactivateUserSubscriptionRequest,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "../model/types";

export class SubscriptionActionError extends Error {
  constructor(
    readonly kind:
      | "forbidden"
      | "not_found"
      | "validation"
      | "conflict"
      | "network"
      | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "SubscriptionActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new SubscriptionActionError(
        "forbidden",
        "اجازه دسترسی به این عملیات اشتراک را ندارید.",
      );
    }
    if (status === 404) {
      throw new SubscriptionActionError(
        "not_found",
        "اشتراک یا پلن مورد نظر یافت نشد.",
      );
    }
    if (status === 409) {
      throw new SubscriptionActionError(
        "conflict",
        "وضعیت فعلی اشتراک یا پلن با این عملیات در تضاد است.",
      );
    }
    if (status === 422) {
      throw new SubscriptionActionError(
        "validation",
        "اطلاعات ارسالی معتبر نیست. لطفاً مقادیر ورودی را بررسی کنید.",
      );
    }
  }
  if (error instanceof SubscriptionActionError) {
    throw error;
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new SubscriptionActionError(
      "network",
      "خطای ارتباط با سرور. اتصال اینترنت خود را بررسی کنید.",
    );
  }
  throw new SubscriptionActionError(
    "server",
    "خطای غیرمنتظره در انجام عملیات اشتراک رخ داد.",
  );
}

export async function activateSubscription(
  params: ActivateUserSubscriptionRequest,
) {
  try {
    const idempotencyKey = crypto.randomUUID();
    const result = await apiClient.POST("/api/admin/v1/subscription/activate", {
      params: {
        header: {
          "Idempotency-Key": idempotencyKey,
        },
      },
      body: params,
    });
    if (result.error) {
      throw new SubscriptionActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function deactivateSubscription(
  params: DeactivateUserSubscriptionRequest,
) {
  try {
    const idempotencyKey = crypto.randomUUID();
    const result = await apiClient.POST(
      "/api/admin/v1/subscription/deactivate",
      {
        params: {
          header: {
            "Idempotency-Key": idempotencyKey,
          },
        },
        body: params,
      },
    );
    if (result.error) {
      throw new SubscriptionActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function createSubscriptionPlan(
  body: CreateSubscriptionPlanRequest,
) {
  try {
    const result = await apiClient.POST("/api/admin/v1/subscription/plans", {
      body,
    });
    if (result.error) {
      throw new SubscriptionActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function updateSubscriptionPlan(
  planUuid: string,
  body: UpdateSubscriptionPlanRequest,
) {
  try {
    const result = await apiClient.PATCH(
      "/api/admin/v1/subscription/plans/{plan_uuid}",
      {
        params: {
          path: {
            plan_uuid: planUuid,
          },
        },
        body,
      },
    );
    if (result.error) {
      throw new SubscriptionActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}
