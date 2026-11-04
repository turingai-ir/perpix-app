import { expect, test } from "@playwright/test";
import { blankReactDocument } from "../../../../__tests__/support/blank-react-document";

type SessionManager = typeof import("../services/session-manager");
type SessionStore = typeof import("../services/session-store");

test.beforeEach(async ({ context, page }) => {
  await context.routeWebSocket("**/*", (socket) => socket.close());
  await context.route("**/api/v1/**", (route) => route.abort());
  await context.route("**/auth-sign-out-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: blankReactDocument,
    }),
  );
  await page.goto("/auth-sign-out-harness");
});

for (const pendingEndpoint of ["csrf", "logout"]) {
  test(`a pending ${pendingEndpoint} request times out and releases the logout browser lock`, async ({
    page,
  }) => {
    await page.clock.install();
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/v1/auth/csrf", (route) =>
      route.fulfill({ json: { csrf_token: "synthetic-csrf" } }),
    );
    await page.route(`**/api/v1/auth/${pendingEndpoint}`, async (route) => {
      await gate;
      await route.abort();
    });
    const started = page.waitForRequest(`**/api/v1/auth/${pendingEndpoint}`);
    const confirmation = page.evaluate(async () => {
      const path = "/src/features/auth/services/session-manager.ts";
      const manager: SessionManager = await import(path);
      manager.startSession({
        accessToken: "synthetic-session",
        csrfToken: "synthetic-csrf",
        expiresInSeconds: 900,
      });
      return manager.signOut();
    });
    try {
      await started;
      await page.clock.fastForward(10_001);
      expect(await confirmation).toBe("unconfirmed");
      const state = await page.evaluate(async () => {
        const path = "/src/features/auth/services/session-store.ts";
        const { sessionStore }: SessionStore = await import(path);
        const locks = navigator.locks ? await navigator.locks.query() : null;
        return {
          status: sessionStore.getStatus(),
          held:
            locks?.held?.filter((lock) => lock.name === "perpix-auth-refresh")
              .length ?? 0,
        };
      });
      expect(state).toEqual({ status: "anonymous", held: 0 });
    } finally {
      release();
    }
  });
}

test("a superseded logout cannot send a request or clear a replacement session", async ({
  page,
}) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let logoutRequests = 0;
  await page.route("**/api/v1/auth/csrf", async (route) => {
    await gate;
    await route.fulfill({ json: { csrf_token: "old-csrf" } });
  });
  await page.route("**/api/v1/auth/logout", (route) => {
    logoutRequests += 1;
    return route.fulfill({ status: 204 });
  });
  const started = page.waitForRequest("**/api/v1/auth/csrf");
  const confirmation = page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    manager.startSession({
      accessToken: "previous-session",
      csrfToken: "old-csrf",
      expiresInSeconds: 900,
    });
    return manager.signOut();
  });
  try {
    await started;
    await page.evaluate(async () => {
      const path = "/src/features/auth/services/session-manager.ts";
      const manager: SessionManager = await import(path);
      manager.startSession({
        accessToken: "replacement-session",
        csrfToken: "new-csrf",
        expiresInSeconds: 900,
      });
    });
    release();
    expect(await confirmation).toBe("superseded");
    const state = await page.evaluate(async () => {
      const path = "/src/features/auth/services/session-store.ts";
      const { sessionStore }: SessionStore = await import(path);
      return {
        status: sessionStore.getStatus(),
        replacementRetained:
          sessionStore.getAccessToken() === "replacement-session",
      };
    });
    expect(state).toEqual({
      status: "authenticated",
      replacementRetained: true,
    });
    expect(logoutRequests).toBe(0);
  } finally {
    release();
  }
});

test("a logout waiting for the refresh lock times out without sending auth requests", async ({
  page,
}) => {
  test.skip(
    !(await page.evaluate(() => Boolean(navigator.locks))),
    "This browser has no Web Locks API; request-timeout regressions still apply",
  );
  await page.clock.install();
  let authRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/api/v1/auth/")) authRequests += 1;
  });
  await page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    manager.startSession({
      accessToken: "synthetic-session",
      csrfToken: "synthetic-csrf",
      expiresInSeconds: 900,
    });
    await new Promise<void>((acquired) => {
      void navigator.locks.request("perpix-auth-refresh", async () => {
        const held = new Promise<void>((release) => {
          window.addEventListener("qa:release-refresh-lock", () => release(), {
            once: true,
          });
        });
        acquired();
        await held;
      });
    });
  });
  const confirmation = page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    return manager.signOut();
  });
  try {
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const path = "/src/features/auth/services/session-store.ts";
          const { sessionStore }: SessionStore = await import(path);
          return sessionStore.getStatus();
        }),
      )
      .toBe("anonymous");
    await page.clock.fastForward(10_001);
    expect(await confirmation).toBe("unconfirmed");
    expect(authRequests).toBe(0);
    const pending = await page.evaluate(async () => {
      const locks = await navigator.locks.query();
      return (
        locks.pending?.filter((lock) => lock.name === "perpix-auth-refresh") ?? []
      );
    });
    expect(pending).toEqual([]);
  } finally {
    await page.evaluate(() => {
      window.dispatchEvent(new Event("qa:release-refresh-lock"));
    });
  }
});

test("replacement login in another tab cancels a queued logout before lock release", async ({
  context,
  page,
}) => {
  test.skip(
    !(await page.evaluate(() => Boolean(navigator.locks))),
    "This regression requires the Web Locks API",
  );
  const otherTab = await context.newPage();
  await otherTab.goto("/auth-sign-out-harness");
  await otherTab.evaluate(async () => {
    await new Promise<void>((acquired) => {
      void navigator.locks.request("perpix-auth-refresh", async () => {
        const held = new Promise<void>((release) => {
          window.addEventListener("qa:release-refresh-lock", () => release(), {
            once: true,
          });
        });
        acquired();
        await held;
      });
    });
  });
  let authRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/api/v1/auth/")) authRequests += 1;
  });
  const confirmation = page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    manager.startSession({
      accessToken: "previous-session",
      csrfToken: "previous-csrf",
      expiresInSeconds: 900,
    });
    return manager.signOut();
  });
  try {
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const locks = await navigator.locks.query();
          return locks.pending?.some((lock) => lock.name === "perpix-auth-refresh");
        }),
      )
      .toBe(true);
    await otherTab.evaluate(async () => {
      const path = "/src/features/auth/services/session-manager.ts";
      const manager: SessionManager = await import(path);
      manager.startSession({
        accessToken: "replacement-session",
        csrfToken: "replacement-csrf",
        expiresInSeconds: 900,
      });
    });
    expect(await confirmation).toBe("superseded");
    expect(authRequests).toBe(0);
  } finally {
    await otherTab.evaluate(() => {
      window.dispatchEvent(new Event("qa:release-refresh-lock"));
    });
  }
});

test("a stale expected cycle cannot sign out a newer session", async ({ page }) => {
  const state = await page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    const storePath = "/src/features/auth/services/session-store.ts";
    const { sessionStore }: SessionStore = await import(storePath);
    const previousCycle = sessionStore.getCycle();
    manager.startSession({
      accessToken: "replacement-session",
      csrfToken: "replacement-csrf",
      expiresInSeconds: 900,
    });
    const confirmation = await manager.signOut(previousCycle);
    return {
      confirmation,
      status: sessionStore.getStatus(),
      retained: sessionStore.getAccessToken() === "replacement-session",
    };
  });
  expect(state).toEqual({
    confirmation: "superseded",
    status: "authenticated",
    retained: true,
  });
});

test("an anonymous retry cannot recreate intent removed by another tab's login", async ({
  page,
}) => {
  let csrfRequests = 0;
  await page.route("**/api/v1/auth/csrf", (route) => {
    csrfRequests += 1;
    return route.fulfill({ status: 503, json: { detail: "Unavailable" } });
  });
  const result = await page.evaluate(async () => {
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    const storePath = "/src/features/auth/services/session-store.ts";
    const { sessionStore }: SessionStore = await import(storePath);
    manager.startSession({
      accessToken: "previous-session",
      csrfToken: "previous-csrf",
      expiresInSeconds: 900,
    });
    const first = await manager.signOut();
    const retryCycle = sessionStore.getCycle();
    // Model replacement evidence arriving before the BroadcastChannel event.
    localStorage.removeItem("perpix:local-sign-out");
    const retry = await manager.signOut(retryCycle);
    return {
      first,
      retry,
      marker: localStorage.getItem("perpix:local-sign-out"),
      cycleUnchanged: sessionStore.getCycle() === retryCycle,
    };
  });
  expect(result).toEqual({
    first: "unconfirmed",
    retry: "superseded",
    marker: null,
    cycleUnchanged: true,
  });
  expect(csrfRequests).toBe(1);
});

test("unavailable storage does not prevent best-effort remote logout", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "synthetic-csrf" } }),
  );
  let logoutRequests = 0;
  await page.route("**/api/v1/auth/logout", (route) => {
    logoutRequests += 1;
    return route.fulfill({ status: 204 });
  });
  const confirmation = await page.evaluate(async () => {
    const denyStorage = () => {
      throw new DOMException("Denied", "SecurityError");
    };
    Storage.prototype.getItem = denyStorage;
    Storage.prototype.setItem = denyStorage;
    Storage.prototype.removeItem = denyStorage;
    const path = "/src/features/auth/services/session-manager.ts";
    const manager: SessionManager = await import(path);
    manager.startSession({
      accessToken: "synthetic-session",
      csrfToken: "synthetic-csrf",
      expiresInSeconds: 900,
    });
    return manager.signOut();
  });
  expect(confirmation).toBe("confirmed");
  expect(logoutRequests).toBe(1);
});
