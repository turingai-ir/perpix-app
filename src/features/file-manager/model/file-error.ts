import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

export class FileError extends Error {
  constructor(
    public readonly key: string,
    public readonly status?: number,
  ) {
    super(key);
  }
}
export class UserFileError extends Error {
  constructor(
    message: string,
    public readonly cause: unknown,
  ) {
    super(message);
  }
}
const messages: Record<number, string> = {
  400: "invalid",
  401: "unauthorized",
  403: "forbidden",
  404: "missing",
  409: "conflict",
  413: "tooLarge",
  415: "unsupported",
  422: "invalidMedia",
  429: "temporary",
  503: "temporary",
};
export const responseError = (status: number) =>
  new FileError(
    `features.fileManager.errors.${messages[status] ?? "generic"}`,
    status,
  );
export function fileError(error: unknown): FileError {
  if (error instanceof FileError) return error;
  if (error instanceof FetchHttpError)
    return responseError(error.response.status);
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError ||
    error instanceof TypeError ||
    error instanceof SyntaxError ||
    (error instanceof DOMException && error.name === "TimeoutError")
  )
    return new FileError("features.fileManager.errors.network");
  return new FileError("features.fileManager.errors.generic");
}
export function canRetryFileRequest(error: unknown) {
  const typed = fileError(error);
  return (
    typed.status === 503 ||
    typed.status === 429 ||
    typed.key.endsWith(".network")
  );
}
export function isMissingFilePreview(error: unknown) {
  return error instanceof FileError && error.status === 404;
}
export function requireConnection() {
  if (!navigator.onLine)
    throw new FileError("features.fileManager.errors.offline");
}
