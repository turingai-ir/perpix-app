import { expect, test } from "@playwright/test";

type FetchModule = typeof import("../src/shared/utils/custom-fetch/custom-fetch");
const modulePath = "/src/shared/utils/custom-fetch/custom-fetch.ts";

test.beforeEach(async ({ context, page }) => {
  await context.routeWebSocket("**/*", (socket) => socket.close());
  await context.route("**/api/v1/**", (route) => route.abort());
  await page.route("**/custom-fetch-fixture", (route) => route.fulfill({
    contentType: "text/html", body: "<!doctype html><body>Fetch fixture</body>",
  }));
  await page.goto("/custom-fetch-fixture");
});

for (const source of ["request", "init", "fallback"] as const) {
  test(`${source} cancellation reaches the original fetch without error feedback`, async ({ page }) => {
    const result = await page.evaluate(async ({ path, source }) => {
      const { createCustomFetch }: FetchModule = await import(path);
      if (source === "fallback") Object.defineProperty(AbortSignal, "any", { value: undefined });
      const controller = new AbortController();
      let finalErrors = 0;
      const observed: { signal?: AbortSignal | null } = {};
      const request = createCustomFetch(async (_, init) => {
        observed.signal = init?.signal;
        return new Promise<Response>((_, reject) => {
          observed.signal?.addEventListener("abort", () => reject(observed.signal?.reason), { once: true });
        });
      }, { onFinalError: () => { finalErrors += 1; } });
      const input = new Request("https://api.invalid/operation", {
        signal: source === "init" ? undefined : controller.signal,
      });
      const pending = source === "init" ? request(input, { signal: controller.signal }) : request(input);
      controller.abort();
      let errorName = "";
      try { await pending; } catch (error) {
        errorName = error instanceof Error || error instanceof DOMException ? error.name : "unknown";
      }
      return { aborted: observed.signal?.aborted, errorName, finalErrors };
    }, { path: modulePath, source });
    expect(result).toEqual({ aborted: true, errorName: "AbortError", finalErrors: 0 });
  });
}

test("an explicit null signal overrides an aborted Request signal", async ({ page }) => {
  const result = await page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    const controller = new AbortController();
    controller.abort();
    let aborted: boolean | undefined;
    const request = createCustomFetch(async (_, init) => {
      aborted = init?.signal?.aborted;
      return new Response("ok");
    });
    const response = await request(new Request("https://api.invalid/operation", { signal: controller.signal }), { signal: null });
    return { aborted, status: response.status };
  }, modulePath);
  expect(result).toEqual({ aborted: false, status: 200 });
});

test("an already cancelled Request never reaches transport", async ({ page }) => {
  const result = await page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    const controller = new AbortController();
    controller.abort();
    let calls = 0;
    const request = createCustomFetch(async () => { calls += 1; return new Response("unexpected"); });
    try { await request(new Request("https://api.invalid/operation", { signal: controller.signal })); }
    catch (error) { return { calls, cancelled: error instanceof Error && error.name === "AbortError" }; }
    return { calls, cancelled: false };
  }, modulePath);
  expect(result).toEqual({ calls: 0, cancelled: true });
});

test("cancellation interrupts retry backoff rather than sending another attempt", async ({ page }) => {
  const pending = page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    const controller = new AbortController();
    window.addEventListener("qa:cancel-fetch", () => controller.abort(), { once: true });
    let calls = 0;
    let finalErrors = 0;
    const request = createCustomFetch(async () => {
      calls += 1;
      document.documentElement.dataset.attempts = String(calls);
      throw new TypeError("Failed to fetch");
    }, { maxRetries: 3, retryDelayMs: 10_000, retryOnNetworkError: true, onFinalError: () => { finalErrors += 1; } });
    try { await request("https://api.invalid/operation", { signal: controller.signal }); }
    catch (error) { return { calls, finalErrors, cancelled: error instanceof Error && error.name === "AbortError" }; }
    return { calls, finalErrors, cancelled: false };
  }, modulePath);
  await expect(page.locator("html")).toHaveAttribute("data-attempts", "1");
  await page.evaluate(() => window.dispatchEvent(new Event("qa:cancel-fetch")));
  expect(await pending).toEqual({ calls: 1, finalErrors: 0, cancelled: true });
});

test("a successful fetch disposes its deadline without aborting the response", async ({ page }) => {
  await page.clock.install();
  await page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    document.documentElement.dataset.timeouts = "0";
    const request = createCustomFetch(async () => new Response("ok"), {
      timeoutMs: 1000,
      onTimeout: () => { document.documentElement.dataset.timeouts = "1"; },
    });
    const response = await request("https://api.invalid/operation");
    document.documentElement.dataset.body = await response.text();
  }, modulePath);
  await page.clock.fastForward(2000);
  await expect(page.locator("html")).toHaveAttribute("data-timeouts", "0");
  await expect(page.locator("html")).toHaveAttribute("data-body", "ok");
});

test("the deadline aborts a stalled transport and reports one timeout", async ({ page }) => {
  await page.clock.install();
  const pending = page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    let timeouts = 0;
    let finalErrors = 0;
    const request = createCustomFetch(async (_, init) => {
      const signal = init?.signal;
      document.documentElement.dataset.started = "1";
      return new Promise<Response>((_, reject) => signal?.addEventListener("abort", () => reject(signal.reason), { once: true }));
    }, { timeoutMs: 1000, onTimeout: () => { timeouts += 1; }, onFinalError: () => { finalErrors += 1; } });
    try { await request("https://api.invalid/operation"); }
    catch (error) { return { timeouts, finalErrors, errorName: error instanceof Error ? error.name : "unknown" }; }
    return { timeouts, finalErrors, errorName: "" };
  }, modulePath);
  await expect(page.locator("html")).toHaveAttribute("data-started", "1");
  await page.clock.fastForward(1001);
  expect(await pending).toEqual({ timeouts: 1, finalErrors: 1, errorName: "TimeoutError" });
});

test("Request cancellation still reaches the response body after headers resolve", async ({ page }) => {
  const result = await page.evaluate(async (path) => {
    const { createCustomFetch }: FetchModule = await import(path);
    const controller = new AbortController();
    const observed = { forwardedAborted: false, streamAborted: false };
    const request = createCustomFetch(async (_, init) => {
      const signal = init?.signal;
      return new Response(new ReadableStream({
        start(stream) {
          signal?.addEventListener("abort", () => {
            observed.forwardedAborted = signal.aborted;
            observed.streamAborted = true;
            stream.error(signal.reason);
          }, { once: true });
        },
      }));
    }, { timeoutMs: 1000 });
    const input = new Request("https://api.invalid/operation", { signal: controller.signal });
    const response = await request(input);
    controller.abort();
    const body = response.text().then(() => ({
      sourceAborted: input.signal.aborted, name: "body-read-succeeded", ...observed,
    }), (error: unknown) => ({
        sourceAborted: input.signal.aborted,
        name: typeof error === "object" && error !== null && "name" in error ? String(error.name) : String(error),
        message: typeof error === "object" && error !== null && "message" in error ? String(error.message) : "",
        ...observed,
    }));
    return Promise.race([
      body,
      new Promise((resolve) => setTimeout(() => resolve({ name: "body-still-pending", ...observed }), 2000)),
    ]);
  }, modulePath);
  // Chromium can normalize an errored body to TypeError: Failed to fetch.
  // Verify actual signal propagation and rejection, not the browser wrapper.
  expect(result).toMatchObject({
    sourceAborted: true,
    forwardedAborted: true,
    streamAborted: true,
    name: expect.stringMatching(/^(AbortError|TypeError)$/),
  });
});
