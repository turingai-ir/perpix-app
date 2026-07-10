import { expect, test } from "@playwright/test";

async function installServiceWorkerHarness(
  page: import("@playwright/test").Page,
  failFirstRegistration = false,
) {
  await page.addInitScript((shouldFailFirstRegistration) => {
    const waitingWorker = new EventTarget() as ServiceWorker;
    const registration = new EventTarget() as ServiceWorkerRegistration;
    const container = new EventTarget() as ServiceWorkerContainer;
    const registrationCalls: Array<{
      scriptUrl: string;
      updateViaCache?: string;
    }> = [];
    let updateChecks = 0;

    Object.assign(waitingWorker, {
      scriptURL: new URL("/sw.js", location.href).href,
      state: "activated",
      postMessage() {
        throw new Error("A silent update must not message the worker");
      },
    });
    Object.assign(registration, {
      active: waitingWorker,
      installing: null,
      waiting: waitingWorker,
      scope: `${location.origin}/`,
      update: async () => {
        updateChecks += 1;
      },
    });
    Object.assign(container, {
      controller: { scriptURL: waitingWorker.scriptURL },
      ready: Promise.resolve(registration),
      register: async (scriptUrl: string, options?: RegistrationOptions) => {
        registrationCalls.push({
          scriptUrl,
          updateViaCache: options?.updateViaCache,
        });
        if (shouldFailFirstRegistration && registrationCalls.length === 1) {
          throw new Error("offline");
        }
        return registration;
      },
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: container,
    });
    Object.defineProperties(window, {
      __pwaRegistrationCalls: { get: () => registrationCalls },
      __pwaUpdateChecks: { get: () => updateChecks },
    });
  }, failFirstRegistration);
}

test.describe("silent PWA updates", () => {
  test("never prompts or reloads when a new worker is ready", async ({
    page,
  }) => {
    await installServiceWorkerHarness(page);
    await page.goto("/");

    await expect(
      page.getByRole("dialog", { name: "نسخه جدید آماده است" }),
    ).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => window.__pwaUpdateChecks))
      .toBe(0);
  });

  test("registers the stable worker URL without HTTP cache", async ({
    page,
  }) => {
    await installServiceWorkerHarness(page);
    await page.goto("/");

    await expect
      .poll(() => page.evaluate(() => window.__pwaRegistrationCalls))
      .toEqual([{ scriptUrl: "/sw.js", updateViaCache: "none" }]);
  });

  test("checks for an update when connectivity returns", async ({ page }) => {
    await installServiceWorkerHarness(page);
    await page.route("**/sw.js", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await page.goto("/");
    await expect
      .poll(() => page.evaluate(() => window.__pwaRegistrationCalls.length))
      .toBe(1);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));

    await expect
      .poll(() => page.evaluate(() => window.__pwaUpdateChecks))
      .toBe(1);
  });

  test("retries registration when connectivity returns", async ({ page }) => {
    await installServiceWorkerHarness(page, true);
    await page.route("**/sw.js", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await page.goto("/");
    await expect
      .poll(() => page.evaluate(() => window.__pwaRegistrationCalls.length))
      .toBe(1);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));

    await expect
      .poll(() => page.evaluate(() => window.__pwaRegistrationCalls.length))
      .toBe(2);
  });
});

declare global {
  interface Window {
    __pwaRegistrationCalls: Array<{
      scriptUrl: string;
      updateViaCache?: string;
    }>;
    __pwaUpdateChecks: number;
  }
}
