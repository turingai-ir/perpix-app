import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";

export class FileManagerError extends Error {
  constructor(
    public readonly key: string,
    public readonly status?: number,
  ) {
    super(key);
    this.name = "FileManagerError";
  }
}
export class UserFileError extends Error {
  constructor(
    message: string,
    public readonly cause: unknown,
  ) {
    super(message);
    this.name = "UserFileError";
  }
}
const keys: Record<number, string> = {
  400: "invalid",
  401: "unauthorized",
  403: "forbidden",
  404: "missing",
  408: "slowUpload",
  409: "conflict",
  413: "tooLarge",
  415: "unsupported",
  422: "invalidMedia",
  429: "busy",
  503: "temporary",
};
export function toFileManagerError(error: unknown): FileManagerError {
  if (error instanceof FileManagerError) return error;
  if (error instanceof FetchHttpError) return httpError(error.response.status);
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError ||
    error instanceof TypeError ||
    error instanceof SyntaxError ||
    (error instanceof DOMException && error.name === "TimeoutError")
  ) {
    return new FileManagerError("features.fileManager.errors.network");
  }
  return new FileManagerError("features.fileManager.errors.generic");
}
export function httpError(status: number) {
  return new FileManagerError(
    `features.fileManager.errors.${keys[status] ?? "generic"}`,
    status,
  );
}
export function isTemporary(error: unknown) {
  const typed = toFileManagerError(error);
  return (
    typed.status === 503 ||
    typed.status === 429 ||
    typed.key.endsWith(".network")
  );
}
export function requireOnline() {
  if (!navigator.onLine)
    throw new FileManagerError("features.fileManager.errors.offline");
}
