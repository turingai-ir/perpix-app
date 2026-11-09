import { expect, test } from "@playwright/test";

import { FREE, MAX, PRO, mockShell, trackErrors } from "./mocks";

const widgetButton = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /وضعیت حساب/ });
const widgetPanel = (page: import("@playwright/test").Page) =>
  page.getByRole("dialog", { name: "وضعیت حساب" });

test.describe("account widget visibility by header width", () => {
  // 1024px: the open sidebar leaves the header under the 820px threshold.
  for (const width of [360, 390, 640, 768, 1024]) {
    test(`is hidden at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await mockShell(page);
      await page.goto("/");
      await expect(page.locator("header.sticky")).toBeVisible();
      // Role queries skip display:none elements, so check both views.
      await expect(widgetButton(page)).toHaveCount(0);
      await expect(
        page.locator('button[aria-label*="وضعیت حساب"]'),
      ).toBeHidden();
    });
  }

  for (const width of [900, 1180, 1280, 1440, 1920]) {
    test(`is visible and never overlaps the slogan at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await mockShell(page);
      await page.goto("/");
      await expect(widgetButton(page)).toBeVisible();
      const widget = await widgetButton(page).boundingBox();
      const slogan = await page.locator("[data-header-slogan]").boundingBox();
      expect(widget && slogan).toBeTruthy();
      // RTL: the widget sits on the physical left, the slogan to its right.
      expect(widget!.x).toBeGreaterThanOrEqual(0);
      expect(widget!.x + widget!.width).toBeLessThanOrEqual(slogan!.x - 8);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test("phones do not mount the widget or request its data", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockShell(page);
  const activityRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/v1/wallet/transactions")) {
      activityRequests.push(request.url());
    }
  });
  // The app keeps SSE streams open, so wait for the shell data instead of
  // networkidle, then give any late widget query time to fire.
  const shellLoaded = page.waitForResponse(
    "**/api/v1/user/subscription/active",
  );
  await page.goto("/");
  await shellLoaded;
  await expect(page.locator("header.sticky")).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.locator('button[aria-label*="وضعیت حساب"]')).toHaveCount(0);
  expect(
    activityRequests.filter((url) => url.includes("type=WITHDRAW&")),
  ).toEqual([]);
});

test.describe("account widget behavior", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows days with a unit, tokens and today's creations", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await mockShell(page);
    await page.goto("/");
    const trigger = widgetButton(page);
    await expect(trigger).toContainText("۲۰ روز");
    await expect(trigger).toContainText("۱۲٬۴۰۰");
    await expect(trigger).toContainText("توکن");
    await expect(trigger).toContainText("۳ ساخت");
    await expect(trigger).toHaveAccessibleName(/۱۲٬۴۰۰ توکن.*Pro/);
    expect(errors).toEqual([]);
  });

  test("opens with Enter, closes with Escape and restores focus", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    const trigger = widgetButton(page);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(widgetPanel(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(widgetPanel(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes when clicking outside", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toBeVisible();
    await page.mouse.click(700, 600);
    await expect(widgetPanel(page)).toBeHidden();
  });

  test("charge button closes the panel and opens wallet charge", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await widgetButton(page).click();
    await widgetPanel(page)
      .getByRole("button", { name: "شارژ", exact: true })
      .click();
    await expect(widgetPanel(page)).toBeHidden();
    await expect(page.getByRole("dialog").first()).toBeVisible();
  });

  test("upgrade button opens the pricing sheet", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await widgetButton(page).click();
    await widgetPanel(page)
      .getByRole("button", { name: "ارتقا به Max" })
      .click();
    await expect(widgetPanel(page)).toBeHidden();
    await expect(
      page.getByRole("heading", { name: "ارتقای اشتراک" }),
    ).toBeVisible();
  });

  test("expiring plan offers renewal", async ({ page }) => {
    await mockShell(page, { plan: MAX, daysLeft: 3 });
    await page.goto("/");
    await expect(widgetButton(page)).toContainText("۳ روز");
    await widgetButton(page).click();
    await expect(
      widgetPanel(page).getByRole("button", { name: "تمدید اشتراک" }),
    ).toBeVisible();
  });

  test("top plan far from expiry has no call to action", async ({ page }) => {
    await mockShell(page, { plan: MAX, daysLeft: 25 });
    await page.goto("/");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toBeVisible();
    await expect(
      widgetPanel(page).getByRole("button", { name: /ارتقا|تمدید|خرید/ }),
    ).toHaveCount(0);
  });

  test("free plan offers subscribing and shows no day count", async ({
    page,
  }) => {
    await mockShell(page, { plan: FREE, daysLeft: 3650 });
    await page.goto("/");
    await expect(widgetButton(page)).toContainText("رایگان");
    await widgetButton(page).click();
    await expect(
      widgetPanel(page).getByRole("button", { name: "خرید اشتراک" }),
    ).toBeVisible();
    await expect(widgetPanel(page)).not.toContainText("روز مانده");
  });

  test("low balance warns about the runway and highlights charging", async ({
    page,
  }) => {
    await mockShell(page, { balance: 3_000_000 });
    await page.goto("/");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toContainText("اعتبارت فقط برای حدود");
    await expect(
      widgetPanel(page).getByRole("button", { name: "شارژ", exact: true }),
    ).toHaveAttribute("data-primary", "true");
  });

  test("zero balance says so and never divides by zero", async ({ page }) => {
    const errors = trackErrors(page);
    await mockShell(page, { balance: 0 });
    await page.goto("/");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toContainText("اعتبارت تموم شده");
    await expect(widgetPanel(page)).not.toContainText("Infinity");
    await expect(widgetPanel(page)).not.toContainText("NaN");
    expect(errors).toEqual([]);
  });

  test("wallet failure degrades to an unknown balance", async ({ page }) => {
    const errors = trackErrors(page);
    await mockShell(page, { balance: "error" });
    await page.goto("/");
    await expect(widgetButton(page)).toContainText("نامشخص");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toContainText("نامشخص");
    await expect(widgetPanel(page)).not.toContainText("NaN");
    expect(errors).toEqual([]);
  });

  test("transactions failure hides daily activity only", async ({ page }) => {
    const errors = trackErrors(page);
    await mockShell(page, { transactions: "error" });
    await page.goto("/");
    await expect(widgetButton(page)).toContainText("۲۰ روز");
    await expect(widgetButton(page)).not.toContainText("ساخت");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).not.toContainText("مصرف امروز");
    await expect(widgetPanel(page)).toContainText("موجودی توکن");
    expect(errors).toEqual([]);
  });

  test("no spending yet shows an empty week without errors", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await mockShell(page, { transactions: "empty" });
    await page.goto("/");
    await expect(widgetButton(page)).toContainText("۰ ساخت");
    await widgetButton(page).click();
    await expect(widgetPanel(page)).toContainText("هنوز مصرفی");
    expect(errors).toEqual([]);
  });

  test("panel stays inside the viewport", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await widgetButton(page).click();
    await page.waitForTimeout(600);
    const box = await widgetPanel(page).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
  });
});

test("widget respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockShell(page);
  await page.goto("/");
  await widgetButton(page).click();
  const animation = await widgetPanel(page)
    .locator("section")
    .first()
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
});

test("widget works when the plan has no expiry data", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = trackErrors(page);
  await mockShell(page, { plan: PRO });
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({ json: { uuid: "s", plan: PRO } }),
  );
  await page.goto("/");
  await expect(widgetButton(page)).toBeVisible();
  await widgetButton(page).click();
  await expect(widgetPanel(page)).not.toContainText("NaN");
  expect(errors).toEqual([]);
});
