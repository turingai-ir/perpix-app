import * as authHttp from "./auth-http";
import { announceSessionEnded, listenForSessionEnded } from "./session-channel";
import { sessionStore } from "./session-store";

import { AuthRequestError, isAuthRequestError } from "../model/auth-failure";
import type { AuthStatus, IssuedSession } from "../model/types";

export type RefreshOutcome = "refreshed" | "unauthenticated" | "unavailable";
export type SignOutConfirmation = "confirmed" | "unconfirmed";
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

let refreshInFlight: Promise<RefreshOutcome> | null = null;
let bootstrapPromise: Promise<void> | null = null;
let proactiveTimer: ReturnType<typeof setTimeout> | undefined;
let stopListeningToTabs: (() => void) | undefined;

const endListeners = new Set<(reason: SessionEndReason) => void>();

// Persist only the user's sign-out intent, never a credential or token.
function localSignOut(value?: boolean): boolean {
  try {
    if (value === true) localStorage.setItem(LOCAL_SIGN_OUT_KEY, "1");
    if (value === false) localStorage.removeItem(LOCAL_SIGN_OUT_KEY);
    return localStorage.getItem(LOCAL_SIGN_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Subscribes to sign-outs so the app can wipe private client data. */
export function onSessionEnded(listener: (reason: SessionEndReason) => void) {
  endListeners.add(listener);

  return () => {
    endListeners.delete(listener);
  };
}

function withBrowserLock<T>(work: () => Promise<T>): Promise<T> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks;

  return locks ? locks.request(REFRESH_LOCK_NAME, work) : work();
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

async function exchangeRefreshCookie(): Promise<IssuedSession> {
  // The CSRF value may belong to a cookie another tab already rotated.
  return authHttp.refreshTokens(await authHttp.fetchCsrfToken());
}

async function runRefresh(): Promise<RefreshOutcome> {
  if (localSignOut()) return "unauthenticated";
  const cycle = sessionStore.getCycle();
  try {
    const issued = await withBrowserLock(exchangeRefreshCookie);
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
  refreshInFlight ??= runRefresh().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

async function runBootstrap(): Promise<void> {
  stopListeningToTabs ??= listenForSessionEnded(() => {
    if (sessionStore.getStatus() === "authenticated") {
      endSession("remote", false);
    }
  });
  if (localSignOut()) {
    sessionStore.clear();
    return;
  }
  const outcome = await refreshSession();
  if (outcome === "unavailable") sessionStore.setStatus("unavailable");
}

/**
 * Resolves once the first session check finished and returns the *current*
 * status (not the one at bootstrap time), so route loaders stay correct after
 * later sign-ins and sign-outs.
 */
export async function bootstrapSession(): Promise<AuthStatus> {
  await (bootstrapPromise ??= runBootstrap());

  return sessionStore.getStatus();
}

export function retryBootstrap(): Promise<AuthStatus> {
  bootstrapPromise = null;
  sessionStore.setStatus("initializing");

  return bootstrapSession();
}

export function startSession(issued: IssuedSession) {
  localSignOut(false);
  endListeners.forEach((listener) => listener("replaced"));
  adoptSession(issued, true);
}

export async function ensureAccessToken(): Promise<string | null> {
  if (sessionStore.getStatus() === "initializing") await bootstrapSession();
  if (sessionStore.getStatus() !== "authenticated") return null;
  const remaining = sessionStore.getExpiresAt() - Date.now();
  if (remaining > EARLY_REFRESH_MS / 2) return sessionStore.getAccessToken();
  const outcome = await refreshSession();
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
  if (!token) throw new AuthRequestError({ kind: "invalid-credentials" }, 401);
  try {
    return await call(token);
  } catch (error) {
    const unauthorized = isAuthRequestError(error) && error.status === 401;
    if (!retryOnUnauthorized || !unauthorized) throw error;
    const next = await recoverAccessToken(token, cycle);
    if (!next) throw error;

    return call(next);
  }
}

export async function signOut(): Promise<SignOutConfirmation> {
  localSignOut(true);
  clearTimeout(proactiveTimer);
  let confirmation: SignOutConfirmation = "confirmed";
  try {
    await withBrowserLock(async () =>
      authHttp.logout(await authHttp.fetchCsrfToken()),
    );
  } catch (error) {
    // 401 means this browser holds no usable refresh session any more.
    if (!(isAuthRequestError(error) && error.status === 401)) {
      confirmation = "unconfirmed";
    }
  }
  endSession("signed-out", true);

  return confirmation;
}

export async function signOutEverywhere(): Promise<void> {
  await withBearer(authHttp.logoutAll, true);
  endSession("signed-out", true);
}

export async function changePassword(body: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  await withBearer((token) => authHttp.changePassword(token, body), false);
  endSession("credentials-changed", true);
}

export async function completePasswordReset(body: {
  challenge_id: string;
  otp_code: string;
  new_password: string;
}): Promise<void> {
  await authHttp.completePasswordReset(body);
  endSession("credentials-changed", true);
}
