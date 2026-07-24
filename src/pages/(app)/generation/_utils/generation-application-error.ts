import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";

interface GenerationApplicationError {
  detail: unknown;
}

interface CanonicalFieldError {
  loc: string;
}

export async function parseGenerationApplicationError(
  error: unknown,
): Promise<GenerationApplicationError | null> {
  if (!(error instanceof FetchHttpError)) return null;
  const responseBody = await error.parseJson();
  if (!isRecord(responseBody) || !("detail" in responseBody)) return null;
  return { detail: responseBody.detail };
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
