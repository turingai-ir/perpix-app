import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  TEST_ACCESS_TOKEN,
} from "../../../../__tests__/support/auth-session";

type AuthorizedFetchModule = typeof import("../services/authorized-fetch");

test("concurrent private requests wait for the initial session restore", async ({
  page,
}) => {
  await mockAuthenticatedSession(page);
  await page.route("**/auth-bootstrap-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    }),
  );
  let refreshes = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/v1/auth/refresh")) refreshes += 1;
  });
  await page.goto("/auth-bootstrap-harness");

  const results = await page.evaluate(async () => {
    const modulePath = "/src/features/auth/services/authorized-fetch.ts";
    const auth: AuthorizedFetchModule = await import(modulePath);
    const request = auth.createAuthorizedFetch(async (input: Request) =>
      Response.json({ authorization: input.headers.get("Authorization") }),
    );
    const responses = await Promise.all([
      request(
        `${location.origin}/api/v1/payment-executions/11111111-1111-4111-8111-111111111111`,
      ),
      request(`${location.origin}/api/v1/wallet/wallet`),
    ]);
    return Promise.all(responses.map((response) => response.json()));
  });

  expect(results).toEqual([
    { authorization: `Bearer ${TEST_ACCESS_TOKEN}` },
    { authorization: `Bearer ${TEST_ACCESS_TOKEN}` },
  ]);
  expect(refreshes).toBe(1);
});

for (const status of [401, 503]) {
  test(`private requests are not sent when session restoration returns ${status}`, async ({
    page,
  }) => {
    await page.route("**/auth-bootstrap-harness", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><html><body></body></html>",
      }),
    );
    await page.route("**/api/v1/auth/csrf", (route) =>
      route.fulfill({ status, json: { detail: "Unavailable" } }),
    );
    await page.goto("/auth-bootstrap-harness");
    const result = await page.evaluate(async () => {
      const modulePath = "/src/features/auth/services/authorized-fetch.ts";
      const auth: AuthorizedFetchModule = await import(modulePath);
      let sent = 0;
      const request = auth.createAuthorizedFetch(async () => {
        sent += 1;
        return Response.json({});
      });
      try {
        await request(
          `${location.origin}/api/v1/payment-intents/11111111-1111-4111-8111-111111111111/executions`,
          { method: "POST" },
        );
        return { sent, error: null };
      } catch (error) {
        return { sent, error: error instanceof Error ? error.name : "unknown" };
      }
    });
    expect(result).toEqual({ sent: 0, error: "AuthRequestError" });
  });
}

test("changing accounts during bootstrap cancels the waiting private request", async ({
  page,
}) => {
  await mockAuthenticatedSession(page);
  await page.route("**/auth-bootstrap-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    }),
  );
  let releaseRefresh: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseRefresh = resolve;
  });
  await page.route("**/api/v1/auth/refresh", async (route) => {
    await gate;
    await route.fulfill({
      headers: { "X-CSRF-TOKEN": "csrf" },
      json: {
        access_token: "old-account-token",
        token_type: "bearer",
        expires_in: 900,
      },
    });
  });
  await page.goto("/auth-bootstrap-harness");
  const refreshing = page.waitForRequest("**/api/v1/auth/refresh");
  const pending = page.evaluate(async () => {
    const modulePath = "/src/features/auth/services/authorized-fetch.ts";
    const auth: AuthorizedFetchModule = await import(modulePath);
    let sent = 0;
    const request = auth.createAuthorizedFetch(async () => {
      sent += 1;
      return Response.json({});
    });
    try {
      await request(
        `${location.origin}/api/v1/payment-intents/11111111-1111-4111-8111-111111111111/executions`,
        { method: "POST" },
      );
      return { sent, error: null };
    } catch (error) {
      return { sent, error: error instanceof Error ? error.name : "unknown" };
    }
  });
  try {
    await refreshing;
    await page.evaluate(async () => {
      const modulePath = "/src/features/auth/services/session-manager.ts";
      const manager: typeof import("../services/session-manager") =
        await import(modulePath);
      manager.startSession({
        accessToken: "new-account-token",
        expiresInSeconds: 900,
      });
    });
  } finally {
    releaseRefresh();
  }
  expect(await pending).toEqual({ sent: 0, error: "AbortError" });
});

test("a public plan read remains available without a session", async ({
  page,
}) => {
  await page.route("**/auth-bootstrap-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    }),
  );
  let authRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/api/v1/auth/")) authRequests += 1;
  });
  await page.goto("/auth-bootstrap-harness");
  const result = await page.evaluate(async () => {
    const modulePath = "/src/features/auth/services/authorized-fetch.ts";
    const auth: AuthorizedFetchModule = await import(modulePath);
    const request = auth.createAuthorizedFetch(async () =>
      Response.json({ items: [] }),
    );
    return (
      await request(`${location.origin}/api/v1/user/subscription/plans`)
    ).json();
  });
  expect(result).toEqual({ items: [] });
  expect(authRequests).toBe(0);
});

test("a token expiring while refresh fails is never sent to a private endpoint", async ({
  page,
}) => {
  await page.clock.install();
  await page.route("**/auth-bootstrap-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    }),
  );
  await page.route("**/api/v1/auth/csrf", async (route) => {
    await page.clock.fastForward(2000);
    await route.fulfill({ status: 503, json: { detail: "Unavailable" } });
  });
  await page.goto("/auth-bootstrap-harness");
  const result = await page.evaluate(async () => {
    const managerPath = "/src/features/auth/services/session-manager.ts";
    const manager: typeof import("../services/session-manager") = await import(
      managerPath
    );
    const modulePath = "/src/features/auth/services/authorized-fetch.ts";
    const auth: AuthorizedFetchModule = await import(modulePath);
    manager.startSession({
      accessToken: "expiring-token",
      expiresInSeconds: 1,
    });
    let sent = 0;
    const request = auth.createAuthorizedFetch(async () => {
      sent += 1;
      return Response.json({});
    });
    try {
      await request(`${location.origin}/api/v1/wallet/charge`, {
        method: "POST",
      });
      return { sent, error: null };
    } catch (error) {
      return { sent, error: error instanceof Error ? error.name : "unknown" };
    }
  });
  expect(result).toEqual({ sent: 0, error: "AuthRequestError" });
});
