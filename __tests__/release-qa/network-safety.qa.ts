import { expect, test as base } from "@playwright/test";

import { installQaNetworkGuard } from "./network-guard";

const APP = "http://localhost:5173";
const test = base.extend<{
  network: Awaited<ReturnType<typeof installQaNetworkGuard>>;
}>({
  network: [
    async ({ context }, use) => {
      const network = await installQaNetworkGuard(context);
      network.mock({
        method: "GET",
        url: `${APP}/__qa/safety`,
        response: {
          contentType: "text/html",
          body: "<!doctype html><html><head><title>QA network canary</title></head><body>Isolated fixture</body></html>",
        },
      });
      await use(network);
    },
    { auto: true },
  ],
});

test.beforeEach(async ({ page }) => {
  // This document is fulfilled in memory. No dev server is needed for these canaries.
  await page.goto(`${APP}/__qa/safety`);
});

test("unknown local API and external fetch requests fail closed", async ({
  page,
  network,
}) => {
  const urls = [
    `${APP}/api/v1/auth/refresh`,
    `${APP}/api/v1/auth/otp/send`,
    `${APP}/api/v1/generate`,
    `${APP}/api/v1/payments`,
    "https://provider.invalid/generate",
    "https://gateway.invalid/pay",
    "https://telemetry.invalid/envelope",
  ];
  const start = network.events.length;
  const results = await page.evaluate(async (targets) => {
    return Promise.all(
      targets.map(async (url) => {
        try {
          await fetch(url, { method: "POST", body: "synthetic-canary" });
          return "escaped";
        } catch {
          return "blocked";
        }
      }),
    );
  }, urls);
  expect(results).toEqual(urls.map(() => "blocked"));
  const events = network.events.slice(start);
  expect(events).toHaveLength(urls.length);
  expect(
    events.filter(
      (event) =>
        event.action === "blocked" &&
        event.transport === "http" &&
        event.method === "POST" &&
        event.destination === "local",
    ),
  ).toHaveLength(4);
  expect(
    events.filter(
      (event) =>
        event.action === "blocked" &&
        event.transport === "http" &&
        event.method === "POST" &&
        event.destination === "external",
    ),
  ).toHaveLength(3);
});

test("only an exact method and URL mock is fulfilled", async ({ page, network }) => {
  network.mock({
    method: "GET",
    url: `${APP}/api/v1/qa-canary`,
    response: { status: 422, json: { code: "SYNTHETIC_VALIDATION" } },
  });
  const results = await page.evaluate(async (url) => {
    const mocked = await fetch(url);
    const denied = await Promise.all(
      [fetch(url, { method: "POST" }), fetch(`${url}?unexpected=1`)].map(
        (request) => request.then(() => false, () => true),
      ),
    );
    return { status: mocked.status, body: await mocked.json(), denied };
  }, `${APP}/api/v1/qa-canary`);
  expect(results).toEqual({
    status: 422,
    body: { code: "SYNTHETIC_VALIDATION" },
    denied: [true, true],
  });
  expect(
    network.events.filter((event) => event.action === "blocked"),
  ).toHaveLength(2);
});

test("HTTP redirects are rejected before following their targets", async ({
  page,
  network,
}) => {
  network.mock({
    method: "GET",
    url: `${APP}/__qa/redirect`,
    response: {
      status: 302,
      headers: { location: "https://gateway.invalid/real-payment" },
    },
  });
  await expect(page.goto(`${APP}/__qa/redirect`)).rejects.toThrow();
  expect(network.events.filter((event) => event.action === "blocked")).toEqual([
    {
      action: "blocked",
      transport: "http",
      destination: "local",
      method: "GET",
    },
  ]);
});

test("an API document navigation in a second tab is also denied", async ({
  context,
  network,
}) => {
  const secondPage = await context.newPage();
  await expect(secondPage.goto(`${APP}/api/v1/auth/refresh`)).rejects.toThrow();
  expect(network.events.filter((event) => event.action === "blocked")).toEqual([
    {
      action: "blocked",
      transport: "http",
      destination: "local",
      method: "GET",
    },
  ]);
});

test("external image and script subresources are denied", async ({
  page,
  network,
}) => {
  await page.evaluate(() => {
      const image = new Image();
      image.onload = () => { document.documentElement.dataset.unexpectedImageLoad = "1"; };
      image.src = "https://media.invalid/fixture.png";
      const script = document.createElement("script");
      script.onload = () => { document.documentElement.dataset.unexpectedScriptLoad = "1"; };
      script.src = "https://telemetry.invalid/script.js";
      document.body.append(image, script);
  });
  await expect.poll(() => [...network.blockedResourceTypes].sort()).toEqual(["image", "script"]);
  await expect(page.locator("html")).not.toHaveAttribute("data-unexpected-image-load");
  await expect(page.locator("html")).not.toHaveAttribute("data-unexpected-script-load");
  expect(network.events.filter((event) => event.action === "blocked")).toEqual([
    {
      action: "blocked",
      transport: "http",
      destination: "external",
      method: "GET",
    },
    {
      action: "blocked",
      transport: "http",
      destination: "external",
      method: "GET",
    },
  ]);
});

test("WebSocket and SSE are denied by the guard", async ({ page, network }) => {
  await page.evaluate(() => {
    const socket = new WebSocket("wss://stream.invalid/events");
    const stream = new EventSource("http://localhost:5173/api/v1/qa-events");
    socket.onmessage = () => { document.documentElement.dataset.unexpectedSocketMessage = "1"; };
    stream.onopen = () => { document.documentElement.dataset.unexpectedStream = "1"; };
    window.addEventListener("qa:close-transports", () => {
      socket.close();
      stream.close();
    }, { once: true });
  });
  try {
    await expect.poll(() => [...network.blockedResourceTypes].sort()).toEqual(["eventsource", "websocket"]);
    await expect(page.locator("html")).not.toHaveAttribute("data-unexpected-socket-message");
    await expect(page.locator("html")).not.toHaveAttribute("data-unexpected-stream");
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event("qa:close-transports")));
  }
  expect(
    network.events.filter((event) => event.transport === "websocket"),
  ).toHaveLength(1);
  expect(
    network.events.filter(
      (event) => event.transport === "http" && event.action === "blocked",
    ),
  ).toHaveLength(1);
});

test("service worker blocking is configured and contexts start empty", async (
  { page, context },
  testInfo,
) => {
  expect(testInfo.project.use.serviceWorkers).toBe("block");
  expect(await context.cookies()).toEqual([]);
  const result = await page.evaluate(async () => {
    let registered = false;
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/__qa/worker.js",
        );
        registered = Boolean(registration);
      } catch {
        registered = false;
      }
    }
    return {
      registered,
      localStorageLength: localStorage.length,
      sessionStorageLength: sessionStorage.length,
    };
  });
  expect(result).toEqual({
    registered: false,
    localStorageLength: 0,
    sessionStorageLength: 0,
  });
  expect(context.serviceWorkers()).toHaveLength(0);
});
