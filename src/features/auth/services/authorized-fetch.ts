import { ensureAccessToken, recoverAccessToken } from "./session-manager";
import { sessionStore } from "./session-store";

import { AuthRequestError } from "../model/auth-failure";

import { FetchHttpError } from "@/utils/custom-fetch/fetch-errors";
import { HttpStatus } from "@/utils/custom-fetch/http-status";

const AUTH_PREFIX = "/api/v1/auth/";
const COOKIE_OR_PUBLIC_AUTH_PATHS = [
  "start",
  "registration-challenges",
  "registrations",
  "login",
  "password-reset-challenges",
  "password-resets",
  "challenges/",
  "csrf",
  "refresh",
  "logout",
];
const NO_AUTO_RECOVERY_PATHS = [
  ...COOKIE_OR_PUBLIC_AUTH_PATHS,
  "password-changes",
];

const startsWithAny = (pathname: string, names: string[]) =>
  names.some((name) => pathname.startsWith(`${AUTH_PREFIX}${name}`)) &&
  // "logout" must not match "logout-all"
  !pathname.startsWith(`${AUTH_PREFIX}logout-all`);

/**
 * Wraps a fetch so protected API calls carry the in-memory access token and a
 * 401 triggers at most one coordinated refresh and one retry of the request.
 * Auth endpoints themselves are never recovered automatically.
 */
export function createAuthorizedFetch(
  innerFetch: (request: Request) => Promise<Response>,
) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const { pathname } = new URL(request.url);
    const publicPlans =
      request.method === "GET" &&
      pathname === "/api/v1/user/subscription/plans";
    if (publicPlans || startsWithAny(pathname, COOKIE_OR_PUBLIC_AUTH_PATHS)) {
      return innerFetch(request);
    }

    const retryable = request.clone();
    const cycle = sessionStore.getCycle();
    const sentToken = await ensureAccessToken();
    request.signal.throwIfAborted();
    if (cycle !== sessionStore.getCycle() && sentToken) {
      throw new AuthRequestError({ kind: "aborted" });
    }
    if (!sentToken) {
      throw sessionStore.getStatus() === "anonymous"
        ? new AuthRequestError({ kind: "invalid-credentials" }, 401)
        : new AuthRequestError({ kind: "network" });
    }
    request.headers.set("Authorization", `Bearer ${sentToken}`);

    try {
      return await innerFetch(request);
    } catch (error) {
      const isRecoverable =
        error instanceof FetchHttpError &&
        error.response.status === HttpStatus.UNAUTHORIZED &&
        sessionStore.getStatus() === "authenticated" &&
        !startsWithAny(pathname, NO_AUTO_RECOVERY_PATHS);
      if (!isRecoverable) throw error;

      const token = await recoverAccessToken(sentToken, cycle);
      if (!token) throw error;
      retryable.headers.set("Authorization", `Bearer ${token}`);

      return innerFetch(retryable);
    }
  };
}
