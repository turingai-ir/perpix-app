import { chromium } from "@playwright/test";

import { mockAuthenticatedSession } from "./auth-session";
import { mockAppShellApis } from "../../src/features/auth/_tests/support";

export default async function warmup() {
  const browser = await chromium.launch({
    proxy: { server: "http://127.0.0.1:9", bypass: "localhost,127.0.0.1,[::1]" },
  });
  try {
    const context = await browser.newContext({ serviceWorkers: "block" });
    await context.routeWebSocket("**/*", (socket) => socket.close());
    await context.route("**/*", (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === "http://localhost:5173" && request.method() === "GET" &&
        !url.pathname.startsWith("/api/") && !["fetch", "xhr"].includes(request.resourceType())) {
        return route.continue();
      }
      return route.abort();
    });
    await mockAuthenticatedSession(context);
    const page = await context.newPage();
    await mockAppShellApis(page);
    await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.getByRole("button", { name: /نوار کناری/ }).waitFor({ timeout: 30_000 });
    console.log("QA_APP_WARMUP_COMPLETE");
  } finally {
    await browser.close();
  }
}
