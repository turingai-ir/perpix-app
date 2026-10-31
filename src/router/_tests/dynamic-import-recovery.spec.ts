import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../__tests__/support/auth-session";

test("loads a route when session storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("Storage is unavailable", "SecurityError");
      },
    });
  });
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).hostname === "localhost") {
      return route.continue();
    }
    return route.abort("blockedbyclient");
  });

  await page.goto("/auth/login");
  await expect(page.getByRole("spinbutton")).toBeVisible({
    timeout: 15_000,
  });
});

test("reloads once when a route module is missing after a deployment", async ({
  page,
}) => {
  let layoutModuleRequests = 0;
  let failedModuleRequests = 0;
  page.on("requestfailed", (request) => {
    if (request.url().includes("auth/login/page")) {
      failedModuleRequests += 1;
    }
  });
  await page.route("**/*", async (route) => {
    if (!route.request().url().includes("auth/login/page")) {
      await route.continue();
      return;
    }

    layoutModuleRequests += 1;

    if (layoutModuleRequests === 1) {
      await route.abort("failed");
      return;
    }

    await route.continue();
  });

  await page.goto("/auth/login");

  await expect.poll(() => layoutModuleRequests).toBe(2);
  expect(failedModuleRequests).toBe(1);
  await expect(page.getByRole("spinbutton")).toBeVisible();
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("perpix:dynamic-import-reload"),
    ),
  ).toBeNull();
});

test("stops reloading when a nested route stays unavailable", async ({
  page,
}) => {
  let childModuleRequests = 0;
  await mockAuthenticatedSession(page);
  await page.addInitScript(() => {
    sessionStorage.removeItem("perpix:test-layout-ready");
  });
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "localhost") {
      return route.abort("blockedbyclient");
    }
    const path = decodeURIComponent(url.pathname);
    if (path.includes("/pages/(app)/_layout")) {
      return route.fulfill({
        contentType: "application/javascript",
        body: `
          setTimeout(() => sessionStorage.setItem("perpix:test-layout-ready", "true"), 0);
          export default function Layout() { return null; }
        `,
      });
    }
    if (path.includes("/pages/(app)/gallery/page")) {
      childModuleRequests += 1;
      expect(
        childModuleRequests,
        "A nested route failure permits at most one automatic refresh",
      ).toBeLessThanOrEqual(2);
      await page.waitForFunction(
        () => sessionStorage.getItem("perpix:test-layout-ready") === "true",
      );
      return route.abort("failed");
    }
    return route.continue();
  });

  await page.goto("/gallery", { waitUntil: "commit" });

  await expect(
    page.getByText("متاسفانه خطایی رخ داده است لطفا صفحه را رفرش کنید"),
  ).toBeVisible({ timeout: 10_000 });
  expect(childModuleRequests).toBe(2);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("perpix:dynamic-import-reload"),
    ),
  ).toBe("true");
});
