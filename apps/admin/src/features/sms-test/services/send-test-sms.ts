import { z } from "zod";
import { apiClient, type paths } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

type Body =
  paths["/api/admin/v1/auth/sms-tests"]["post"]["requestBody"]["content"]["application/json"];
export class SmsTestError extends Error {
  constructor(
    readonly kind: "limited" | "forbidden" | "invalid" | "network" | "server",
    readonly retryAt = 0,
  ) {
    super(kind);
  }
}
export async function sendTestSms(body: Body) {
  try {
    const result = await apiClient.POST("/api/admin/v1/auth/sms-tests", {
      body,
    });
    if (
      result.response.status !== 202 ||
      !z.object({ status: z.literal("queued") }).safeParse(result.data).success
    )
      throw new SmsTestError("server");
  } catch (error) {
    if (error instanceof FetchHttpError) {
      const response = error.response;
      if (response.status === 429) {
        const header = response.headers.get("Retry-After");
        const seconds = header ? Number(header) : NaN;
        const retryAt = Number.isFinite(seconds)
          ? Date.now() + Math.max(0, seconds) * 1000
          : Date.parse(header ?? "");
        throw new SmsTestError(
          "limited",
          Number.isFinite(retryAt) ? retryAt : Date.now() + 60_000,
        );
      }
      if (response.status === 401 || response.status === 403)
        throw new SmsTestError("forbidden");
      if (response.status === 422) throw new SmsTestError("invalid");
    }
    if (error instanceof SmsTestError) throw error;
    if (
      error instanceof FetchNetworkError ||
      error instanceof FetchTimeoutError
    )
      throw new SmsTestError("network");
    throw new SmsTestError("server");
  }
}
