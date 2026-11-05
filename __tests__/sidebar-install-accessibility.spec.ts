import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures/image-settings";

// Source-only regressions. Run only in the required OS-isolated environment;
// the existing fixture mocks API traffic, not Node/server egress.
async function mockInstallEnvironment(
  page: Page,
  { ios = true, standalone = false, displayMode = false } = {},
) {
  await page.addInitScript(
    ({ ios, standalone, displayMode }) => {
      Object.defineProperties(navigator, {
        userAgent: { configurable: true, value: ios ? "iPhone" : "Test Desktop" },
        platform: { configurable: true, value: ios ? "iPhone" : "Win32" },
        maxTouchPoints: { configurable: true, value: ios ? 5 : 0 },
        standalone: { configurable: true, value: standalone },
      });
      const matchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        const media = matchMedia(query);
        if (query === "(display-mode: standalone)") {
          Object.defineProperty(media, "matches", { value: displayMode });
        }
        return media;
      };
    },
    { ios, standalone, displayMode },
  );
}

async function openProfile(page: Page, mobile: boolean) {
  await page.bringToFront();
  if (mobile) {
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
  }
  const profile = page.getByRole("button", { name: /پروفایل من/ });
  await profile.click();
  return profile;
}

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test.describe(`sidebar install at ${viewport.width}px`, () => {
    test.use({ viewport });

    test("iOS action opens the shared guide, survives menu closure and restores focus on close/reopen", async ({
      page,
    }) => {
      await mockInstallEnvironment(page);
      await page.goto("/");
      const mobile = viewport.width < 1024;
      const profile = await openProfile(page, mobile);
      const guide = page.getByRole("dialog", { name: "نصب روی آیفون" });
      await page.getByRole("menuitem", { name: "نصب برنامه" }).click();
      await expect(guide).toBeVisible();
      await expect(page.getByRole("menu", { includeHidden: true })).toHaveCount(0);
      await expect(guide.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(guide.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(guide).toBeHidden();
      await expect(profile).toBeFocused();
      if (mobile) {
        await expect(
          page.getByRole("dialog", { name: "منو", exact: true }),
        ).toBeVisible();
      }

      await profile.click();
      await page.getByRole("menuitem", { name: "نصب برنامه" }).click();
      await expect(guide).toBeVisible();
      await page.bringToFront();
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      await guide.getByRole("button", { name: "Close" }).click();
      await expect(guide).toBeHidden();
      await expect(profile).toBeFocused();
    });

    if (viewport.width < 1024) {
      test("mobile menu has a localized dialog name, contains focus and closes with Escape", async ({
        page,
      }) => {
        await mockInstallEnvironment(page);
        await page.goto("/");
        await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
        const menu = page.getByRole("dialog", { name: "منو", exact: true });
        await expect(menu).toBeVisible();
        await expect(menu).toHaveAccessibleName("منو");
        await expect(menu.getByRole("navigation", { name: "منو" })).toBeVisible();
        await menu.getByRole("button", { name: "Close" }).focus();
        await page.keyboard.press("Tab");
        expect(
          await menu.evaluate((element) =>
            element.contains(document.activeElement),
          ),
        ).toBe(true);
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
        await expect(
          page.getByRole("button", { name: "باز کردن نوار کناری" }),
        ).toBeVisible();
      });
    }
  });
}

test.describe("install availability", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const mode of ["navigator", "display-mode"] as const) {
    test(`hides iOS install when already standalone via ${mode}`, async ({
      page,
    }) => {
      await mockInstallEnvironment(page, {
        standalone: mode === "navigator",
        displayMode: mode === "display-mode",
      });
      await page.goto("/");
      await openProfile(page, false);
      await expect(page.getByRole("menuitem", { name: "نصب برنامه" })).toHaveCount(0);
      await expect(
        page.getByRole("dialog", { name: "نصب روی آیفون" }),
      ).toHaveCount(0);
    });
  }

  test("appinstalled closes the iOS guide and hides the action", async ({
    page,
  }) => {
    await mockInstallEnvironment(page);
    await page.goto("/");
    const profile = await openProfile(page, false);
    await page.getByRole("menuitem", { name: "نصب برنامه" }).click();
    const guide = page.getByRole("dialog", { name: "نصب روی آیفون" });
    await expect(guide).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
    await expect(guide).toBeHidden();
    await expect(profile).toBeFocused();
    await profile.click();
    await expect(page.getByRole("menuitem", { name: "نصب برنامه" })).toHaveCount(0);
  });

  test("non-iOS prompts remain pending and consume one native offer at a time", async ({
    page,
  }) => {
    await mockInstallEnvironment(page, { ios: false });
    await page.goto("/");
    const profile = await openProfile(page, false);
    const install = page.getByRole("menuitem", { name: "نصب برنامه" });
    await expect(install).toHaveCount(0);
    await page.evaluate(() => {
      let calls = 0;
      const offer = () => {
        let used = false;
        const userChoice = new Promise<{ outcome: string; platform: string }>(
          (resolve) => {
            window.addEventListener(
              "test:install-choice",
              (event) => {
                resolve({
                  outcome: (event as CustomEvent<string>).detail,
                  platform: "web",
                });
              },
              { once: true },
            );
          },
        );
        window.dispatchEvent(
          Object.assign(
            new Event("beforeinstallprompt", { cancelable: true }),
            {
              platforms: ["web"],
              userChoice,
              prompt: async () => {
                if (used) {
                  throw new DOMException("Offer already used", "InvalidStateError");
                }
                used = true;
                calls += 1;
                document.documentElement.dataset.installPromptCalls = String(calls);
              },
            },
          ),
        );
      };
      window.addEventListener("test:offer-install", offer);
      offer();
    });
    await expect(install).toBeVisible();
    await install.click();
    await expect(profile).toBeFocused();
    await profile.click();
    await expect(install).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator("html")).toHaveAttribute(
      "data-install-prompt-calls",
      "1",
    );
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("test:install-choice", { detail: "dismissed" }),
      ),
    );
    await expect(install).toHaveCount(0);
    // Only a fresh native event makes the action available after dismissal.
    await page.evaluate(() =>
      window.dispatchEvent(new Event("test:offer-install")),
    );
    await expect(install).toBeVisible();
    await install.click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-install-prompt-calls",
      "2",
    );
    await expect(profile).toBeFocused();
    await profile.click();
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("test:install-choice", { detail: "accepted" }),
      ),
    );
    await expect(install).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "نصب روی آیفون" })).toHaveCount(0);
  });

  test("a rejected native prompt resets pending state and reports a localized error", async ({
    page,
  }) => {
    await mockInstallEnvironment(page, { ios: false });
    await page.goto("/");
    await openProfile(page, false);
    await page.evaluate(() => {
      window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), {
        platforms: ["web"],
        userChoice: Promise.resolve({ outcome: "dismissed", platform: "web" }),
        prompt: async () => {
          throw new DOMException("Synthetic rejection", "NotAllowedError");
        },
      }));
    });
    await page.getByRole("menuitem", { name: "نصب برنامه" }).click();
    await expect(
      page.getByText("نصب برنامه شروع نشد. بعداً دوباره امتحان کن."),
    ).toBeVisible();
    await page.getByRole("button", { name: /پروفایل من/ }).click();
    await expect(page.getByRole("menuitem", { name: "نصب برنامه" })).toHaveCount(0);
  });
});
