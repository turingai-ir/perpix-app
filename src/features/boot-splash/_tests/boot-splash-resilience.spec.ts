import { expect, test, type Page } from "@playwright/test";

import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

const splash = "[data-boot-splash]";

async function holdSessionCheck(page: Page) {
  let started = false;
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  // Stall the login loader without blocking the JavaScript that mounts the splash.
  await page.route("**/api/v1/auth/csrf", async (route) => {
    started = true;
    await held;
    await route.fallback().catch(() => {});
  });
  return { release, hasStarted: () => started };
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("perpix:boot-splash", "on"),
  );
  await mockAnonymousSession(page);
});

for (const action of ["button", "escape"] as const) {
  test(`the ${action} exit works while the login session check is pending`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    const { release, hasStarted } = await holdSessionCheck(page);
    try {
      await page.goto("/auth/login", { waitUntil: "domcontentloaded" });
      const entrance = page.locator(splash);
      await expect(entrance).toBeVisible();
      await expect.poll(hasStarted).toBe(true);
      await expect(entrance).toHaveAttribute("data-leaving", "false");
      if (action === "button")
        await page
          .getByRole("button", { name: "ورود به پرپیکس", exact: true })
          .click();
      else await page.keyboard.press("Escape");
      await expect(entrance).toHaveAttribute("data-skip", "true");
      await page.clock.runFor(250);
      await expect(entrance).toHaveCount(0, { timeout: 2000 });
      expect(
        await page.evaluate(() => document.querySelector("dialog:modal")),
      ).toBeNull();
    } finally {
      release();
    }
  });
}

test("a stalled login session check cannot keep the entrance modal open indefinitely", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  const { release, hasStarted } = await holdSessionCheck(page);
  try {
    await page.goto("/auth/login", { waitUntil: "domcontentloaded" });
    const entrance = page.locator(splash);
    await expect(entrance).toBeVisible();
    await expect.poll(hasStarted).toBe(true);
    await expect(entrance).toHaveAttribute("data-leaving", "false");
    await page.clock.runFor(10_000);
    await expect(entrance).toHaveAttribute("data-skip", "true");
    // Let React's timer-triggered passive effects settle before the short fade.
    await page.clock.resume();
    await expect(entrance).toHaveCount(0, { timeout: 2000 });
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
