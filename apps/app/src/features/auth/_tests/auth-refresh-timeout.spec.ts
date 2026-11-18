import { expect, test } from "@playwright/test";
import { blankReactDocument } from "../../../../__tests__/support/blank-react-document";

type Harness = typeof import("./auth-reliability-harness");
const modulePath = "/src/features/auth/_tests/auth-reliability-harness.ts";

test.beforeEach(async ({ context, page }) => {
  await context.routeWebSocket("**/*", (socket) => socket.close());
  await context.route("**/api/v1/**", (route) => route.abort());
  await page.route("**/auth-refresh-timeout", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: blankReactDocument,
    }),
  );
  await page.goto("/auth-refresh-timeout");
  await page.clock.install();
});

for (const endpoint of ["csrf", "refresh"]) {
  test(`bootstrap deadline covers a pending ${endpoint} and permits a fresh retry`, async ({
    page,
  }) => {
    let release = () => {};
    let stalled = true;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    for (const name of ["csrf", "refresh"]) {
      await page.route(`**/api/v1/auth/${name}`, async (route) => {
        if (stalled && name === endpoint) {
          await gate;
          await route.abort();
          return;
        }
        await route.fulfill(
          name === "csrf"
            ? { json: { csrf_token: "csrf" } }
            : {
                headers: { "X-CSRF-TOKEN": "csrf" },
                json: {
                  access_token: "restored",
                  token_type: "bearer",
                  expires_in: 900,
                },
              },
        );
      });
    }
    const started = page.waitForRequest(`**/api/v1/auth/${endpoint}`);
    const bootstrap = page.evaluate(async (path) => {
      const h: Harness = await import(path);
      return h.manager.bootstrapSession();
    }, modulePath);
    try {
      await started;
      await page.clock.fastForward(10_001);
      expect(await bootstrap).toBe("unavailable");
      const held = await page.evaluate(
        async () => (await navigator.locks?.query())?.held?.length ?? 0,
      );
      expect(held).toBe(0);
      stalled = false;
      release();
      expect(
        await page.evaluate(async (path) => {
          const h: Harness = await import(path);
          return h.manager.retryBootstrap();
        }, modulePath),
      ).toBe("authenticated");
    } finally {
      release();
    }
  });
}

test("bootstrap waiting for a browser lock has the same bounded budget", async ({
  page,
}) => {
  test.skip(
    !(await page.evaluate(() => Boolean(navigator.locks))),
    "Web Locks unsupported",
  );
  await page.evaluate(async () => {
    await new Promise<void>((ready) => {
      void navigator.locks.request("perpix-auth-refresh", async () => {
        const held = new Promise<void>((release) =>
          window.addEventListener("qa:release-lock", () => release(), {
            once: true,
          }),
        );
        ready();
        await held;
      });
    });
  });
  const pending = page.evaluate(async (path) => {
    const h: Harness = await import(path);
    return h.manager.bootstrapSession();
  }, modulePath);
  try {
    await expect
      .poll(() =>
        page.evaluate(
          async () => (await navigator.locks.query()).pending?.length ?? 0,
        ),
      )
      .toBe(1);
    await page.clock.fastForward(10_001);
    expect(await pending).toBe("unavailable");
    expect(
      await page.evaluate(
        async () => (await navigator.locks.query()).pending?.length ?? 0,
      ),
    ).toBe(0);
  } finally {
    await page.evaluate(() =>
      window.dispatchEvent(new Event("qa:release-lock")),
    );
  }
});
