import { expect, test } from "@playwright/test";
import { blankReactDocument } from "../../../../__tests__/support/blank-react-document";

type Harness = typeof import("./auth-reliability-harness");
const modulePath = "/src/features/auth/_tests/auth-reliability-harness.ts";

test.beforeEach(async ({ context, page }) => {
  await context.routeWebSocket("**/*", (socket) => socket.close());
  await context.route("**/*", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      url.origin === "http://localhost:5173" &&
      request.method() === "GET" &&
      !url.pathname.startsWith("/api/") &&
      !["fetch", "xhr"].includes(request.resourceType())
    ) {
      return route.continue();
    }
    return route.abort();
  });
  await context.route("**/auth-reliability-harness", (route) =>
    route.fulfill({ contentType: "text/html", body: blankReactDocument }),
  );
  await page.goto("/auth-reliability-harness");
});

test("a late token issuance cannot replace a newer session", async ({
  page,
}) => {
  const result = await page.evaluate(async (path) => {
    const h: Harness = await import(path);
    const oldCycle = h.sessionStore.getCycle();
    h.manager.startSession(h.issued("account-b"));
    let cancelled = false;
    try {
      h.manager.startSession(h.issued("late-account-a"), oldCycle);
    } catch (error) {
      cancelled = error instanceof Error && error.name === "AbortError";
    }
    return {
      cancelled,
      retained: h.sessionStore.getAccessToken() === "account-b",
    };
  }, modulePath);
  expect(result).toEqual({ cancelled: true, retained: true });
});

for (const operation of ["everywhere", "change", "reset"] as const) {
  test(`late ${operation} response cannot clear a replacement session`, async ({
    page,
  }) => {
    const result = await page.evaluate(
      async ({ path, operation }) => {
        const h: Harness = await import(path);
        h.manager.startSession(h.issued("account-a"));
        let release = () => {};
        let entered = () => {};
        const gate = new Promise<void>((resolve) => {
          release = resolve;
        });
        const started = new Promise<void>((resolve) => {
          entered = resolve;
        });
        globalThis.fetch = async () => {
          entered();
          await gate;
          return new Response(null, { status: 204 });
        };
        let pending: Promise<void>;
        if (operation === "everywhere") pending = h.manager.signOutEverywhere();
        else if (operation === "change") {
          pending = h.manager.changePassword({
            current_password: "OldPass123!",
            new_password: "NewPass123!",
          });
        } else {
          pending = h.manager.completePasswordReset({
            challenge_id: "11111111-1111-4111-8111-111111111111",
            otp_code: "123456",
            new_password: "NewPass123!",
          });
        }
        await started;
        h.manager.startSession(h.issued("account-b"));
        h.queryClient.setQueryData(["qa-private"], "account-b-data");
        release();
        let errorName = "";
        try {
          await pending;
        } catch (error) {
          errorName =
            error instanceof Error || error instanceof DOMException
              ? error.name
              : "unknown";
        }
        return {
          errorName,
          retained: h.sessionStore.getAccessToken() === "account-b",
          cached: h.queryClient.getQueryData(["qa-private"]),
        };
      },
      { path: modulePath, operation },
    );
    expect(result).toEqual({
      errorName: "AbortError",
      retained: true,
      cached: "account-b-data",
    });
  });

  test(`${operation} still invalidates its own unchanged session`, async ({
    page,
  }) => {
    const result = await page.evaluate(
      async ({ path, operation }) => {
        const h: Harness = await import(path);
        h.manager.startSession(h.issued("account-a"));
        h.queryClient.setQueryData(["qa-private"], "account-a-data");
        globalThis.fetch = async () => new Response(null, { status: 204 });
        if (operation === "everywhere") await h.manager.signOutEverywhere();
        else if (operation === "change")
          await h.manager.changePassword({
            current_password: "OldPass123!",
            new_password: "NewPass123!",
          });
        else
          await h.manager.completePasswordReset({
            challenge_id: "11111111-1111-4111-8111-111111111111",
            otp_code: "123456",
            new_password: "NewPass123!",
          });
        return {
          status: h.sessionStore.getStatus(),
          cached: h.queryClient.getQueryData(["qa-private"]) ?? null,
        };
      },
      { path: modulePath, operation },
    );
    expect(result).toEqual({ status: "anonymous", cached: null });
  });
}

test("an old account action cannot acquire the replacement account's bearer", async ({
  page,
}) => {
  const result = await page.evaluate(async (path) => {
    const h: Harness = await import(path);
    h.manager.startSession(h.issued("account-a", 1));
    let release = () => {};
    let entered = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const started = new Promise<void>((resolve) => {
      entered = resolve;
    });
    let actions = 0;
    globalThis.fetch = async (input) => {
      if (String(input).endsWith("/csrf"))
        return Response.json({ csrf_token: "csrf" });
      if (String(input).endsWith("/refresh")) {
        entered();
        await gate;
        return Response.json(
          {
            access_token: "old-refresh",
            token_type: "bearer",
            expires_in: 900,
          },
          { headers: { "X-CSRF-TOKEN": "csrf" } },
        );
      }
      actions += 1;
      return new Response(null, { status: 204 });
    };
    const pending = h.manager.signOutEverywhere();
    await started;
    h.manager.startSession(h.issued("account-b"));
    release();
    let cancelled = false;
    try {
      await pending;
    } catch (error) {
      cancelled =
        (error instanceof Error || error instanceof DOMException) &&
        error.name === "AbortError";
    }
    return {
      actions,
      cancelled,
      retained: h.sessionStore.getAccessToken() === "account-b",
    };
  }, modulePath);
  expect(result).toEqual({ actions: 0, cancelled: true, retained: true });
});

test("received replacement login clears an authenticated tab even when logout was missed", async ({
  context,
  page,
}) => {
  let authority = "account-a";
  await context.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf" } }),
  );
  await context.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({
      headers: { "X-CSRF-TOKEN": "csrf" },
      json: { access_token: authority, token_type: "bearer", expires_in: 900 },
    }),
  );
  await page.evaluate(async (path) => {
    const h: Harness = await import(path);
    await h.manager.bootstrapSession();
    h.queryClient.setQueryData(["qa-private"], "account-a-data");
  }, modulePath);
  const oldRequest = page.evaluate(async (path) => {
    const h: Harness = await import(path);
    const request = h.createAuthorizedFetch(async () => {
      document.documentElement.dataset.oldRequestPending = "1";
      await new Promise<void>((resolve) =>
        window.addEventListener("qa:release-old", () => resolve(), {
          once: true,
        }),
      );
      return Response.json({ owner: "account-a" });
    });
    try {
      await request(`${location.origin}/api/v1/wallet/wallet`);
      h.queryClient.setQueryData(["qa-late"], "account-a-data");
      return "accepted";
    } catch {
      return "cancelled";
    }
  }, modulePath);
  await expect(page.locator("html")).toHaveAttribute(
    "data-old-request-pending",
    "1",
  );
  const other = await context.newPage();
  await other.goto("/auth-reliability-harness");
  authority = "account-b";
  await other.evaluate(async (path) => {
    const h: Harness = await import(path);
    h.manager.startSession(h.issued("account-b"));
  }, modulePath);
  try {
    await expect
      .poll(() =>
        page.evaluate(async (path) => {
          const h: Harness = await import(path);
          return h.sessionStore.getAccessToken() === "account-b";
        }, modulePath),
      )
      .toBe(true);
    await page.evaluate(() =>
      window.dispatchEvent(new Event("qa:release-old")),
    );
    expect(await oldRequest).toBe("cancelled");
    const cache = await page.evaluate(async (path) => {
      const h: Harness = await import(path);
      return [
        h.queryClient.getQueryData(["qa-private"]) ?? null,
        h.queryClient.getQueryData(["qa-late"]) ?? null,
      ];
    }, modulePath);
    expect(cache).toEqual([null, null]);
  } finally {
    await page.evaluate(() =>
      window.dispatchEvent(new Event("qa:release-old")),
    );
  }
});

test("settling an old refresh cannot clear the replacement cycle's single-flight", async ({
  page,
}) => {
  const result = await page.evaluate(async (path) => {
    const h: Harness = await import(path);
    let releaseFirst = () => {};
    let releaseSecond = () => {};
    let firstEntered = () => {};
    let secondEntered = () => {};
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const secondGate = new Promise<void>((resolve) => {
      releaseSecond = resolve;
    });
    const firstStarted = new Promise<void>((resolve) => {
      firstEntered = resolve;
    });
    const secondStarted = new Promise<void>((resolve) => {
      secondEntered = resolve;
    });
    let refreshes = 0;
    globalThis.fetch = async (input) => {
      if (String(input).endsWith("/csrf"))
        return Response.json({ csrf_token: "csrf" });
      refreshes += 1;
      const current = refreshes;
      if (current === 1) {
        firstEntered();
        await firstGate;
      } else if (current === 2) {
        secondEntered();
        await secondGate;
      } else throw new Error("Unexpected duplicate refresh");
      return Response.json(
        {
          access_token: `refreshed-${current}`,
          token_type: "bearer",
          expires_in: 900,
        },
        { headers: { "X-CSRF-TOKEN": "csrf" } },
      );
    };
    h.manager.startSession(h.issued("account-a"));
    const first = h.manager.refreshSession();
    await firstStarted;
    h.manager.startSession(h.issued("account-b"));
    const second = h.manager.refreshSession();
    // Release the old callback so its lock can be handed to the new cycle.
    releaseFirst();
    await first;
    await secondStarted;
    const joined = h.manager.refreshSession();
    const shared = joined === second;
    releaseSecond();
    await Promise.all([second, joined]);
    return { shared, refreshes, token: h.sessionStore.getAccessToken() };
  }, modulePath);
  expect(result).toEqual({ shared: true, refreshes: 2, token: "refreshed-2" });
});
