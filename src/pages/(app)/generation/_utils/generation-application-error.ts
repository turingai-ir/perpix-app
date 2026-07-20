import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";
import type { SchemaApplicationErrorCode } from "@/services/api";

export const GENERATION_ERROR_CODES = {
  invalidModelConfig: 1506,
  providerNotAvailableForModel: 1509,
  noActiveProvider: 1510,
} as const satisfies Record<string, SchemaApplicationErrorCode>;

interface GenerationApplicationError {
  detail: unknown;
  statusCode: number;
}

interface CanonicalFieldError {
  loc: string;
}

export async function parseGenerationApplicationError(
  error: unknown,
): Promise<GenerationApplicationError | null> {
  if (!(error instanceof FetchHttpError)) return null;
  const responseBody = await error.parseJson();
  if (!isRecord(responseBody) || typeof responseBody.status_code !== "number") {
    return null;
  }
  return { detail: responseBody.detail, statusCode: responseBody.status_code };
}

export function getCanonicalErrorPaths(detail: unknown): string[] {
  if (!Array.isArray(detail)) return [];
  return detail.filter(isCanonicalFieldError).map(({ loc }) => loc);
}

function isCanonicalFieldError(value: unknown): value is CanonicalFieldError {
  return isRecord(value) && typeof value.loc === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
