import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/shared/utils/custom-fetch/fetch-errors";
import { HttpStatus } from "@/shared/utils";

/**
 * The message key for a failed project request, or null when the app already
 * told the user (a plan without the studio opens the pricing sheet, a daily limit shows the server's message).
 */
export const projectErrorKey = (error: unknown): string | null => {
  if (error instanceof FetchNetworkError || error instanceof FetchTimeoutError)
    return "features.studio.projects.errors.network";
  if (error instanceof FetchHttpError) {
    switch (error.response.status) {
      // The app already told the user: the pricing sheet, or the server's own message for a limit.
      case HttpStatus.UPGRADE_REQUIRED:
      case HttpStatus.TOO_MANY_REQUESTS:
        return null;
      case HttpStatus.NOT_FOUND:
        return "features.studio.projects.errors.missing";
      case HttpStatus.CONFLICT:
        return "features.studio.projects.errors.conflict";
    }
  }
  return "features.studio.projects.errors.generic";
};

export const isMissing = (error: unknown): boolean =>
  error instanceof FetchHttpError &&
  error.response.status === HttpStatus.NOT_FOUND;
