import { expect, test, type Page } from "@playwright/test";

import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

const splash = "[data-boot-splash]";

async function holdInitialRoute(page: Page) {
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/src/pages/auth/login/page.tsx*", async (route) => {
    await held;
    await route.continue().catch(() => {});
  });
  return release;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("perpix:boot-splash", "on"),
  );
  await mockAnonymousSession(page);
});

for (const action of ["button", "escape"] as const) {
  test(`the ${action} exit works while the initial route is still pending`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    const release = await holdInitialRoute(page);
    try {
      await page.goto("/auth/login", { waitUntil: "domcontentloaded" });
      await expect(page.locator(splash)).toBeVisible();
      if (action === "button")
        await page
          .getByRole("button", { name: "ورود به پرپیکس", exact: true })
          .click();
      else await page.keyboard.press("Escape");
      await page.clock.runFor(250);
      await expect(page.locator(splash)).toHaveCount(0, { timeout: 2000 });
      expect(
        await page.evaluate(() => document.querySelector("dialog:modal")),
      ).toBeNull();
    } finally {
      release();
    }
  });
}

test("a stalled initial route cannot keep the entrance modal open indefinitely", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  const release = await holdInitialRoute(page);
  try {
    await page.goto("/auth/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator(splash)).toBeVisible();
    await page.clock.runFor(10_000);
    await expect(page.locator(splash)).toHaveAttribute("data-skip", "true");
    // Let React's timer-triggered passive effects settle before the short fade.
    await page.clock.resume();
    await expect(page.locator(splash)).toHaveCount(0, { timeout: 2000 });
  } finally {
    release();
  }
});

test("reduced motion never scales the office during the exit fade", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto("/auth/login");
  await page.locator("[data-auth-step='phone']").waitFor({ state: "attached" });
  await page.clock.runFor(1);
  await expect(page.locator(splash)).toHaveAttribute("data-leaving", "true");
  const scale = await page
    .locator("[data-scene] > div")
    .evaluate(
      (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
    );
  expect(scale).toBe(1);
});

test("normal completion restores the control focused before the native dialog", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const showModal = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      if (this.hasAttribute("data-boot-splash")) {
        let control = document.querySelector<HTMLButtonElement>(
          "[data-boot-focus-probe]",
        );
        if (!control) {
          control = document.createElement("button");
          control.dataset.bootFocusProbe = "true";
          control.textContent = "کنترل قبل از لودر";
          document.body.append(control);
        }
        control.focus();
      }
      showModal.call(this);
    };
  });
  await page.goto("/auth/login");
  await expect(page.locator(splash)).toHaveCount(0, { timeout: 15_000 });
  await expect(
    page.getByRole("button", { name: "کنترل قبل از لودر", exact: true }),
  ).toBeFocused();
});
