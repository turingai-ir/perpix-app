import * as authHttp from "./auth-http";
import {
  announceSessionEnded,
  announceSessionStarted,
  listenForSessionChanges,
} from "./session-channel";
import { sessionStore } from "./session-store";

import { AuthRequestError, isAuthRequestError } from "../model/auth-failure";
import type { AuthStatus, IssuedSession } from "../model/types";

export type RefreshOutcome = "refreshed" | "unauthenticated" | "unavailable";
export type SignOutConfirmation = "confirmed" | "unconfirmed" | "superseded";
export type SessionEndReason =
  | "expired"
  | "signed-out"
  | "credentials-changed"
  | "remote"
  | "anonymous-start"
  | "replaced";

const REFRESH_LOCK_NAME = "perpix-auth-refresh";
const LOCAL_SIGN_OUT_KEY = "perpix:local-sign-out";
const EARLY_REFRESH_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;
const SIGN_OUT_TIMEOUT_MS = 10_000;
const REFRESH_TIMEOUT_MS = 10_000;

let refreshInFlight: {
  cycle: number;
  controller: AbortController;
  promise: Promise<RefreshOutcome>;
} | null = null;
let bootstrapPromise: Promise<void> | null = null;
let proactiveTimer: ReturnType<typeof setTimeout> | undefined;
let stopListeningToTabs: (() => void) | undefined;

const endListeners = new Set<(reason: SessionEndReason) => void>();

// Persist only the user's sign-out intent, never a credential or token.
function localSignOut(value?: boolean): boolean | undefined {
  try {
    if (value === true) localStorage.setItem(LOCAL_SIGN_OUT_KEY, "1");
    if (value === false) localStorage.removeItem(LOCAL_SIGN_OUT_KEY);
    return localStorage.getItem(LOCAL_SIGN_OUT_KEY) === "1";
  } catch {
    return undefined;
  }
}

/** Subscribes to sign-outs so the app can wipe private client data. */
export function onSessionEnded(listener: (reason: SessionEndReason) => void) {
  endListeners.add(listener);

  return () => {
    endListeners.delete(listener);
  };
}

function withBrowserLock<T>(
  work: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks;

  return locks ? locks.request(REFRESH_LOCK_NAME, { signal }, work) : work();
}

function scheduleProactiveRefresh(expiresInSeconds: number) {
  clearTimeout(proactiveTimer);
  const delay = Math.max(
    expiresInSeconds * 1000 - EARLY_REFRESH_MS,
    MIN_REFRESH_DELAY_MS,
  );
  proactiveTimer = setTimeout(() => void refreshSession(), delay);
}

function adoptSession(issued: IssuedSession, startsNewCycle: boolean) {
  sessionStore.setSession(issued, startsNewCycle);
  scheduleProactiveRefresh(issued.expiresInSeconds);
}

function endSession(reason: SessionEndReason, announce: boolean) {
  invalidatePendingAuth();
  if (
    reason === "signed-out" ||
    reason === "remote" ||
    reason === "credentials-changed"
  ) {
    localSignOut(true);
  }
  clearTimeout(proactiveTimer);
  sessionStore.clear();
  endListeners.forEach((listener) => listener(reason));
  if (announce) announceSessionEnded();
}

function invalidatePendingAuth() {
  const previous = refreshInFlight;
  refreshInFlight = null;
  bootstrapPromise = null;
  previous?.controller.abort();
}

function assertSessionCycle(cycle: number) {
  if (cycle !== sessionStore.getCycle()) {
    throw new DOMException("Auth session changed", "AbortError");
  }
}

async function exchangeRefreshCookie(signal: AbortSignal): Promise<IssuedSession> {
  // The CSRF value may belong to a cookie another tab already rotated.
  const csrfToken = await authHttp.fetchCsrfToken(signal);
  signal.throwIfAborted();
  return authHttp.refreshTokens(csrfToken, signal);
}

async function runRefresh(
  cycle: number,
  signal: AbortSignal,
): Promise<RefreshOutcome> {
  if (localSignOut()) return "unauthenticated";
  try {
    const issued = await withBrowserLock(
      () => exchangeRefreshCookie(signal),
      signal,
    );
    signal.throwIfAborted();
    if (cycle !== sessionStore.getCycle()) return "unauthenticated";
    adoptSession(issued, false);

    return "refreshed";
  } catch (error) {
    if (cycle !== sessionStore.getCycle()) return "unauthenticated";
    if (isAuthRequestError(error) && error.status === 401) {
      endSession("expired", false);

      return "unauthenticated";
    }

    return "unavailable";
  }
}

/** Single-flight per tab; the browser lock coordinates across tabs. */
export function refreshSession(): Promise<RefreshOutcome> {
  const cycle = sessionStore.getCycle();
  if (refreshInFlight?.cycle === cycle) return refreshInFlight.promise;
  refreshInFlight?.controller.abort();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);
  const promise = runRefresh(cycle, controller.signal).finally(() => {
    clearTimeout(timeout);
    if (refreshInFlight?.controller === controller) refreshInFlight = null;
  });
  refreshInFlight = { cycle, controller, promise };
  return promise;
}

async function runBootstrap(): Promise<void> {
  stopListeningToTabs ??= listenForSessionChanges({
    ended: () => {
      if (sessionStore.getStatus() === "authenticated") {
        endSession("remote", false);
      }
    },
    started: () => {
      const shouldRestore = sessionStore.getStatus() !== "anonymous";
      // Replacement is not a sign-out: never overwrite the new tab's intent.
      endSession("replaced", false);
      if (shouldRestore) {
        sessionStore.setStatus("initializing");
        void bootstrapSession();
      }
    },
  });
  if (localSignOut()) {
    // Navigation to login must not supersede the logout already confirming.
    if (sessionStore.getStatus() !== "anonymous") endSession("remote", false);
    return;
  }
  const cycle = sessionStore.getCycle();
  const outcome = await refreshSession();
  if (cycle === sessionStore.getCycle() && outcome === "unavailable") {
    sessionStore.setStatus("unavailable");
  }
}

/**
 * Resolves once the first session check finished and returns the *current*
 * status (not the one at bootstrap time), so route loaders stay correct after
 * later sign-ins and sign-outs.
 */
export async function bootstrapSession(): Promise<AuthStatus> {
  for (;;) {
    if (!bootstrapPromise && sessionStore.getStatus() === "authenticated") {
      return "authenticated";
    }
    bootstrapPromise ??= runBootstrap();
    const pending = bootstrapPromise;
    await pending;
    if (
      pending === bootstrapPromise ||
      sessionStore.getStatus() !== "initializing"
    ) {
      return sessionStore.getStatus();
    }
  }
}

export function retryBootstrap(): Promise<AuthStatus> {
  bootstrapPromise = null;
  sessionStore.setStatus("initializing");

  return bootstrapSession();
}

export function startSession(
  issued: IssuedSession,
  expectedCycle = sessionStore.getCycle(),
) {
  assertSessionCycle(expectedCycle);
  invalidatePendingAuth();
  localSignOut(false);
  endListeners.forEach((listener) => listener("replaced"));
  adoptSession(issued, true);
  announceSessionStarted();
}

export async function ensureAccessToken(): Promise<string | null> {
  if (sessionStore.getStatus() === "initializing") await bootstrapSession();
  if (sessionStore.getStatus() !== "authenticated") return null;
  if (localSignOut()) {
    endSession("remote", false);
    return null;
  }
  const cycle = sessionStore.getCycle();
  const remaining = sessionStore.getExpiresAt() - Date.now();
  if (remaining > EARLY_REFRESH_MS / 2) return sessionStore.getAccessToken();
  const outcome = await refreshSession();
  if (cycle !== sessionStore.getCycle()) return null;
  if (outcome === "refreshed" || sessionStore.getExpiresAt() > Date.now()) {
    return sessionStore.getAccessToken();
  }

  return null;
}

/**
 * Returns a token for retrying a request that was rejected with 401: a token
 * issued since it was sent is preferred, otherwise one coordinated refresh.
 */
export async function recoverAccessToken(
  sentToken: string | null,
  cycle: number,
): Promise<string | null> {
  if (cycle !== sessionStore.getCycle()) return null;
  const current = sessionStore.getAccessToken();
  if (current && current !== sentToken) return current;
  if ((await refreshSession()) !== "refreshed") return null;

  return cycle === sessionStore.getCycle()
    ? sessionStore.getAccessToken()
    : null;
}

async function withBearer<T>(
  call: (token: string) => Promise<T>,
  retryOnUnauthorized: boolean,
): Promise<T> {
  const cycle = sessionStore.getCycle();
  const token = await ensureAccessToken();
  assertSessionCycle(cycle);
  if (!token) {
    if (sessionStore.getStatus() === "anonymous") {
      throw new AuthRequestError({ kind: "invalid-credentials" }, 401);
    }
    throw new AuthRequestError({ kind: "network" });
  }
  try {
    const result = await call(token);
    assertSessionCycle(cycle);
    return result;
  } catch (error) {
    assertSessionCycle(cycle);
    const unauthorized = isAuthRequestError(error) && error.status === 401;
    if (!retryOnUnauthorized || !unauthorized) throw error;
    const next = await recoverAccessToken(token, cycle);
    assertSessionCycle(cycle);
    if (!next) throw error;

    const result = await call(next);
    assertSessionCycle(cycle);
    return result;
  }
}

export async function signOut(
  expectedCycle = sessionStore.getCycle(),
): Promise<SignOutConfirmation> {
  if (expectedCycle !== sessionStore.getCycle()) return "superseded";
  if (sessionStore.getStatus() === "anonymous" && localSignOut() === false) {
    return "superseded";
  }
  endSession("signed-out", true);
  const tracksSharedIntent = localSignOut();
  const controller = new AbortController();
  let superseded = false;
  const stopListening = onSessionEnded(() => {
    superseded = true;
    controller.abort();
  });
  // A replacement session must not be affected by this old logout attempt.
  const stopListeningToStarts = listenForSessionChanges({
    started: () => {
      superseded = true;
      controller.abort();
    },
  });
  const timeout = setTimeout(() => controller.abort(), SIGN_OUT_TIMEOUT_MS);
  try {
    await withBrowserLock(
      async () => {
        const assertCurrentAttempt = () => {
          if (
            sessionStore.getCycle() !== expectedCycle + 1 ||
            (tracksSharedIntent && localSignOut() === false)
          ) {
            superseded = true;
            controller.abort();
          }
          controller.signal.throwIfAborted();
        };
        assertCurrentAttempt();
        const csrfToken = await authHttp.fetchCsrfToken(controller.signal);
        assertCurrentAttempt();
        await authHttp.logout(csrfToken, controller.signal);
      },
      controller.signal,
    );

    return "confirmed";
  } catch (error) {
    if (superseded) return "superseded";
    // 401 means this browser holds no usable refresh session any more.
    return isAuthRequestError(error) && error.status === 401
      ? "confirmed"
      : "unconfirmed";
  } finally {
    clearTimeout(timeout);
    stopListening();
    stopListeningToStarts();
  }
}

export async function signOutEverywhere(): Promise<void> {
  const cycle = sessionStore.getCycle();
  await withBearer(authHttp.logoutAll, true);
  assertSessionCycle(cycle);
  endSession("signed-out", true);
}

export async function changePassword(body: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  const cycle = sessionStore.getCycle();
  await withBearer((token) => authHttp.changePassword(token, body), false);
  assertSessionCycle(cycle);
  endSession("credentials-changed", true);
}

export async function completePasswordReset(body: {
  challenge_id: string;
  otp_code: string;
  new_password: string;
}): Promise<void> {
  const cycle = sessionStore.getCycle();
  await authHttp.completePasswordReset(body);
  assertSessionCycle(cycle);
  endSession("credentials-changed", true);
}
