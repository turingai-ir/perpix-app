import { apiClient } from "@/services/api";
import type { components } from "@/services/api/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

export class FinanceActionError extends Error {
  constructor(
    readonly kind:
      "forbidden" | "not_found" | "validation" | "network" | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "FinanceActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new FinanceActionError(
        "forbidden",
        "اجازه دسترسی به این عملیات مالی را ندارید.",
      );
    }
    if (status === 404) {
      throw new FinanceActionError(
        "not_found",
        "کیف پول یا منبع مورد نظر یافت نشد.",
      );
    }
    if (status === 400 || status === 422) {
      throw new FinanceActionError("validation", "اطلاعات ارسالی معتبر نیست.");
    }
  }
  if (error instanceof FinanceActionError) {
    throw error;
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new FinanceActionError(
      "network",
      "خطای ارتباط با سرور. اتصال خود را بررسی کنید.",
    );
  }
  throw new FinanceActionError(
    "server",
    "خطای غیرمنتظره در انجام عملیات مالی رخ داد.",
  );
}

export async function chargeWallet(
  walletUuid: string,
  params: {
    user_uuid: string;
    amount_usdmicro: number;
    reason?: string;
  },
) {
  try {
    const idempotencyKey = crypto.randomUUID();
    const result = await apiClient.POST(
      "/api/admin/v1/wallets/{wallet_uuid}/charge",
      {
        params: {
          path: { wallet_uuid: walletUuid },
          header: { "Idempotency-Key": idempotencyKey },
        },
        body: {
          user_uuid: params.user_uuid,
          amount_usdmicro: params.amount_usdmicro,
          meta: params.reason ? { reason: params.reason } : undefined,
        },
      },
    );
    if (result.error) {
      throw new FinanceActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function refreshExchangeRate() {
  try {
    const result = await apiClient.POST(
      "/api/admin/v1/currency-exchange-rate/refresh",
      {},
    );
    if (result.error) {
      throw new FinanceActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function updateTopupPolicy(
  body: components["schemas"]["UpdateTopupPolicyRequest"],
) {
  try {
    const result = await apiClient.PUT("/api/admin/v1/wallet/topup-policy", {
      body,
    });
    if (result.error) {
      throw new FinanceActionError("server");
    }
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}
