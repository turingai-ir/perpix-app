import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { z } from "zod";

import { ensureAccessToken, refreshSession } from "./session-manager";

import { APP_KEYS } from "@/utils";

const AUTH_ERROR_EVENT = "auth_error";
const INITIAL_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const MAX_CONSECUTIVE_AUTH_FAILURES = 2;
const STABLE_CONNECTION_MS = 30_000;

const authErrorSchema = z.object({
  code: z.enum(["token_expired", "token_revoked"]),
});

type AttemptEnd =
  | "token_expired"
  | "token_revoked"
  | "unauthorized"
  | "forbidden"
  | "closed"
  | "idle";

class StreamAttemptError extends Error {
  readonly end: AttemptEnd | "failed";

  constructor(end: AttemptEnd | "failed") {
    super(`Event stream attempt ended: ${end}`);
    this.end = end;
  }
}

export interface AuthorizedStreamOptions {
  /** Path including `/api/v1`, e.g. `/api/v1/payment-events`. */
  path: string;
  signal: AbortSignal;
  onEvent: (message: EventSourceMessage) => void;
  /** Fired on every successful open; `isReconnect` means read a fresh snapshot. */
  onOpen?: (isReconnect: boolean) => void;
  /** Fired when the stream is retrying after a transport failure. */
  onReconnecting?: () => void;
  /** Reconnect when nothing (event or heartbeat event) arrived for this long. */
  idleTimeoutMs?: number;
}

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const isAuthEnd = (end: AttemptEnd) =>
  end === "token_expired" || end === "token_revoked" || end === "unauthorized";

function parseAuthError(data: string): AttemptEnd {
  try {
    return authErrorSchema.parse(JSON.parse(data)).code;
  } catch {
    return "token_revoked";
  }
}

async function runAttempt(
  token: string,
  options: AuthorizedStreamOptions,
  isReconnect: boolean,
): Promise<AttemptEnd> {
  const attempt = new AbortController();
  let ended: AttemptEnd | undefined;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const finish = (end: AttemptEnd) => {
    ended ??= end;
    attempt.abort();
  };
  const armIdleTimer = () => {
    clearTimeout(idleTimer);
    if (options.idleTimeoutMs) {
      idleTimer = setTimeout(() => finish("idle"), options.idleTimeoutMs);
    }
  };
  options.signal.addEventListener("abort", () => attempt.abort(), {
    once: true,
  });

  try {
    await fetchEventSource(`${APP_KEYS.API_BASE_URL}${options.path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: attempt.signal,
      openWhenHidden: true,
      onopen(response) {
        if (response.status === 401)
          throw new StreamAttemptError("unauthorized");
        if (response.status === 403) throw new StreamAttemptError("forbidden");
        if (!response.ok) throw new StreamAttemptError("failed");
        armIdleTimer();
        options.onOpen?.(isReconnect);

        return Promise.resolve();
      },
      onmessage(message) {
        armIdleTimer();
        if (message.event === AUTH_ERROR_EVENT) {
          finish(parseAuthError(message.data));

          return;
        }
        options.onEvent(message);
      },
      onclose() {
        throw new StreamAttemptError("closed");
      },
      onerror(error) {
        // Rethrow: reconnect policy lives in the caller, not in the library.
        throw error;
      },
    });
  } catch (error) {
    if (ended) return ended;
    if (error instanceof StreamAttemptError && error.end !== "failed") {
      return error.end;
    }
    if (options.signal.aborted) return "closed";
  } finally {
    clearTimeout(idleTimer);
  }

  return ended ?? "closed";
}

/**
 * Runs a Bearer-authenticated SSE connection until `options.signal` aborts or
 * the session can no longer be recovered. Never puts the token in the URL.
 */
export async function runAuthorizedStream(
  options: AuthorizedStreamOptions,
): Promise<void> {
  let backoff = INITIAL_BACKOFF_MS;
  let authFailures = 0;
  let isReconnect = false;
  const connection: { openedAt: number | null } = { openedAt: null };
  const tracked: AuthorizedStreamOptions = {
    ...options,
    onOpen: (reconnect) => {
      connection.openedAt = Date.now();
      options.onOpen?.(reconnect);
    },
  };

  while (!options.signal.aborted) {
    const token = await ensureAccessToken();
    if (!token) return;

    connection.openedAt = null;
    const end = await runAttempt(token, tracked, isReconnect);
    if (options.signal.aborted || end === "forbidden") return;
    if (
      connection.openedAt !== null &&
      Date.now() - connection.openedAt >= STABLE_CONNECTION_MS
    ) {
      authFailures = 0;
      backoff = INITIAL_BACKOFF_MS;
    }

    isReconnect = true;
    if (isAuthEnd(end)) {
      authFailures += 1;
      if (authFailures >= MAX_CONSECUTIVE_AUTH_FAILURES) return;
      if ((await refreshSession()) !== "refreshed") return;
      continue;
    }

    options.onReconnecting?.();
    await wait(backoff, options.signal);
    backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
  }
}
