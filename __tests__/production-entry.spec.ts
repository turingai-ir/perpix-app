import { expect, test } from "@playwright/test";
import {
  mockAnonymousSession,
  mockAuthenticatedSession,
} from "./support/auth-session";
import { test as imageTest } from "./fixtures/image-conversation";

imageTest(
  "production image route initializes its lazy modules",
  async ({ page, imageConversationApi }, testInfo) => {
    imageTest.skip(
      testInfo.config.metadata.productionBundle !== true,
      "Requires production preview.",
    );
    await mockAuthenticatedSession(page);
    expect(imageConversationApi.generateRequests).toHaveLength(0);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route(/\/api\/2\/envelope\//, (route) => {
      for (const line of (route.request().postData() ?? "").split("\n")) {
        if (!line.startsWith("{")) continue;
        const event = JSON.parse(line) as {
          exception?: { values?: { type?: string; value?: string }[] };
        };
        errors.push(
          ...(event.exception?.values ?? []).map(
            (error) => `${error.type}: ${error.value}`,
          ),
        );
      }
      return route.fulfill({ status: 200, body: "" });
    });
    await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
    await expect
      .poll(async () => {
        if (errors.length) return errors.join("; ");
        if (
          await page
            .getByRole("combobox")
            .filter({ hasText: "Conversation image fixture" })
            .isVisible()
        )
          return "ready";
        return "loading";
      })
      .toBe("ready");
  },
);

for (const legacy of [false, true]) {
  test(`production ${legacy ? "legacy" : "modern"} entry loads translated interactive routes`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.config.metadata.productionBundle !== true,
      "Run with __tests__/production.playwright.config.ts against preview.",
    );
    const scripts: string[] = [];
    const errors: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route(
      (url) => url.hostname !== "localhost",
      (route) => route.abort("blockedbyclient"),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockAnonymousSession(page);
    if (legacy) {
      await page.route("**/auth/login", async (route) => {
        const response = await route.fetch();
        // Exercise the actual SystemJS build in modern test browsers.
        const html = (await response.text())
          .replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, "")
          .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, "")
          .replace(/\snomodule\b/g, "");
        await route.fulfill({ response, body: html });
      });
    }

    await page.goto("/auth/login", {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await expect
      .poll(
        async () => {
          if (errors.length) return errors.join("; ");
          const ready = await page
            .getByRole("heading", { name: "از همین‌جا شروع کن" })
            .isVisible();
          return ready ? "ready" : "loading";
        },
        { timeout: 10_000 },
      )
      .toBe("ready");
    const phone = page.getByRole("textbox", { name: "شماره موبایل" });
    await phone.fill("9123456789");
    await expect(phone).toHaveValue("9123456789");
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(phone).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => getComputedStyle(document.body).direction),
      ).toBe("rtl");
    }
    expect(scripts.some((url) => url.includes("react-vendor-legacy-"))).toBe(
      legacy,
    );
    expect(scripts.some((url) => /react-vendor-(?!legacy-)/.test(url))).toBe(
      !legacy,
    );
    expect(errors).toEqual([]);
  });
}
