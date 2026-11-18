import type { AuthStatus, IssuedSession } from "../model/types";

export interface SessionSnapshot {
  status: AuthStatus;
  /** Changes on sign-in and sign-out, never on refresh. */
  cycle: number;
}

let snapshot: SessionSnapshot = { status: "initializing", cycle: 0 };
let accessToken: string | null = null;
let expiresAtMs = 0;

const listeners = new Set<() => void>();

function publish(next: Partial<SessionSnapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

/**
 * In-memory only: the access token must never reach any storage. The CSRF
 * value is not kept at all; it is fetched right before each refresh/logout
 * because another tab may have rotated the refresh cookie it belongs to.
 */
export const sessionStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getStatus: () => snapshot.status,
  getCycle: () => snapshot.cycle,
  getAccessToken: () => accessToken,
  getExpiresAt: () => expiresAtMs,
  setSession(issued: IssuedSession, startsNewCycle: boolean) {
    accessToken = issued.accessToken;
    expiresAtMs = Date.now() + issued.expiresInSeconds * 1000;
    publish({
      status: "authenticated",
      cycle: startsNewCycle ? snapshot.cycle + 1 : snapshot.cycle,
    });
  },
  setStatus(status: AuthStatus) {
    publish({ status });
  },
  clear() {
    accessToken = null;
    expiresAtMs = 0;
    publish({ status: "anonymous", cycle: snapshot.cycle + 1 });
  },
};
