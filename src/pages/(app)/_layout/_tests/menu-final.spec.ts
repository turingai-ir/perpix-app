import { expect, test, type Page } from "@playwright/test";

import { BASIC, FREE, MAX, PRO, mockShell, trackErrors } from "./mocks";

const INTENT = "c0202000-0000-4000-8000-000000000005";
const EXECUTION = "c0202000-0000-4000-8000-000000000003";

// The page also has a right-hand activity rail <aside>; target the menu only.
const sidebar = (page: Page) => page.locator("aside[aria-hidden]");
const planCard = (page: Page) =>
  page.getByRole("region", { name: "اشتراک من" });
const pricingSheet = (page: Page) =>
  page.getByRole("dialog").filter({
    has: page.getByRole("heading", {
      name: /بسته‌ها|ارتقای اشتراک|تمدید اشتراک/,
    }),
  });

async function mockCheckout(page: Page) {
  const bodies: Record<string, unknown>[] = [];
  await page.route("**/api/v1/user/subscription/purchase", async (route) => {
    bodies.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status: 201,
      json: {
        id: INTENT,
        execution_uuid: EXECUTION,
        status: "PENDING",
        financial_status: "PENDING",
        fulfillment_status: "NOT_READY",
        currency: "IRR",
        amount: "22100",
        requires_review: false,
        payment_url: "https://pay.example/checkout",
      },
    });
  });
  await page.route(`**/api/v1/payment-intents/${INTENT}/details`, (route) =>
    route.fulfill({
      json: {
        id: INTENT,
        currency: "IRR",
        base_amount: "20091",
        tax_amount: "2009",
        total_amount: "22100",
        base_amount_usdmicro: "10000",
        tax_amount_usdmicro: "1000",
        total_amount_usdmicro: "11000",
      },
    }),
  );
  return bodies;
}

test.describe("sidebar navigation (desktop)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const links = [
    { name: "ساخت عکس", url: /\/generation\/image/ },
    { name: "ساخت ویدیو", url: /\/generation\/video/ },
    { name: "گالری", url: /\/gallery/ },
    { name: "صفحه اصلی", url: /localhost:5173\/$/ },
  ];

  test("every link navigates and marks the active page", async ({ page }) => {
    const errors = trackErrors(page);
    await mockShell(page);
    await page.goto("/");
    for (const { name, url } of links) {
      const link = sidebar(page).getByRole("link", { name });
      await link.click();
      await expect(page).toHaveURL(url);
      // Desktop rail stays open across route changes.
      await expect(sidebar(page)).toHaveAttribute("aria-hidden", "false");
      await expect(link).toHaveAttribute("aria-current", "page");
    }
    expect(errors).toEqual([]);
  });

  test("a sidebar the user collapsed stays collapsed after navigating", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await page
      .getByRole("button", { expanded: true, name: /منو|نوار/ })
      .click();
    await expect(sidebar(page)).toHaveAttribute("aria-hidden", "true");
    // Client-side navigation (no reload), as a link or the back button does.
    await page.evaluate(() => {
      window.history.pushState({}, "", "/gallery");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await expect(page).toHaveURL(/\/gallery/);
    await expect(sidebar(page)).toHaveAttribute("aria-hidden", "true");
  });

  test("menu button collapses and restores the sidebar", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    const toggle = page.getByRole("button", {
      expanded: true,
      name: /منو|نوار/,
    });
    await toggle.click();
    await expect(sidebar(page)).toHaveAttribute("aria-hidden", "true");
    await page
      .getByRole("button", { expanded: false, name: /منو|نوار/ })
      .click();
    await expect(sidebar(page)).not.toHaveAttribute("aria-hidden", "true");
  });

  test("wallet card shows the balance and opens wallet charge", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await expect(sidebar(page)).toContainText("۱۲٬۴۰۰");
    await sidebar(page).getByRole("button", { name: "شارژ کیف پول" }).click();
    await expect(page.getByRole("dialog").first()).toBeVisible();
  });
});

test.describe("sidebar plan card", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("paid user sees progress and the next plan", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await expect(planCard(page)).toContainText("Pro");
    await expect(planCard(page).getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "67",
    );
    await expect(
      planCard(page).getByRole("button", { name: "ارتقا به Max" }),
    ).toBeVisible();
  });

  test("free user is invited to subscribe", async ({ page }) => {
    await mockShell(page, { plan: FREE, daysLeft: 3650 });
    await page.goto("/");
    await expect(
      planCard(page).getByRole("button", { name: "خرید اشتراک" }),
    ).toBeVisible();
    await expect(planCard(page).getByRole("progressbar")).toHaveCount(0);
  });

  test("plan request failure hides the card instead of breaking", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await mockShell(page);
    await page.route("**/api/v1/user/subscription/active", (route) =>
      route.fulfill({ status: 500, json: { detail: "boom" } }),
    );
    await page.goto("/");
    await expect(sidebar(page)).toBeVisible();
    await expect(planCard(page)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});

test.describe("profile menu", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const trigger = (page: Page) =>
    sidebar(page).getByRole("button", { name: /پروفایل من/ });

  test("opens, lists its actions and closes with Escape", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await trigger(page).click();
    await expect(
      page.getByRole("menuitem", { name: "مدیریت حساب" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "ارتقا و تمدید اشتراک" }),
    ).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "خروج" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menuitem", { name: "خروج" })).toBeHidden();
    await expect(trigger(page)).toBeFocused();
  });

  test("account item navigates to the profile", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await trigger(page).click();
    await page.getByRole("menuitem", { name: "مدیریت حساب" }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test("subscription item opens the pricing sheet", async ({ page }) => {
    await mockShell(page);
    await page.goto("/");
    await trigger(page).click();
    await page.getByRole("menuitem", { name: "ارتقا و تمدید اشتراک" }).click();
    await expect(
      page.getByRole("heading", { name: "ارتقای اشتراک" }),
    ).toBeVisible();
  });
});

test.describe("pricing sheet ladder", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("locks lower plans, marks the current one, offers upgrades", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await mockShell(page);
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    const sheet = pricingSheet(page);
    const card = (name: string) =>
      sheet.getByRole("article").filter({
        has: page.getByRole("heading", { name, exact: true }),
      });
    await expect(sheet.getByRole("article")).toHaveCount(3);
    await expect(card("Basic").getByRole("button")).toBeDisabled();
    await expect(card("Basic")).toContainText("پایین‌تر از بستهٔ فعلی");
    await expect(card("Pro")).toContainText("بستهٔ فعلی");
    await expect(card("Pro")).toContainText("این پلن شماست");
    await expect(card("Pro")).toContainText("سطح ۲ از ۳");
    await expect(
      card("Max").getByRole("button", { name: "ارتقا" }),
    ).toBeEnabled();
    expect(errors).toEqual([]);
  });

  test("the sheet closes with Escape and the close button", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    await expect(pricingSheet(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(pricingSheet(page)).toBeHidden();
  });

  test("top plan sees the whole ladder with only the current one active", async ({
    page,
  }) => {
    await mockShell(page, { plan: MAX, daysLeft: 25 });
    await page.goto("/");
    await page.getByRole("button", { name: /وضعیت حساب/ }).click();
    await page.getByRole("dialog", { name: "وضعیت حساب" }).waitFor();
    await sidebar(page)
      .getByRole("button", { name: /پروفایل من/ })
      .click();
    await page.getByRole("menuitem", { name: "ارتقا و تمدید اشتراک" }).click();
    const sheet = pricingSheet(page);
    await expect(sheet.getByRole("article")).toHaveCount(3);
    await expect(
      sheet.getByRole("button", { name: /^(ارتقا|خرید|تمدید)$/ }),
    ).toHaveCount(0);
  });

  test("expiring plan can be renewed", async ({ page }) => {
    await mockShell(page, { plan: PRO, daysLeft: 2 });
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "تمدید اشتراک" }).click();
    await expect(
      page.getByRole("heading", { name: "تمدید اشتراک" }),
    ).toBeVisible();
    await expect(
      pricingSheet(page).getByRole("button", { name: "تمدید" }),
    ).toBeEnabled();
  });
});

test.describe("purchase flow", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("paid user must confirm an upgrade, and can cancel", async ({
    page,
  }) => {
    const bodies = await mockCheckout(page);
    await mockShell(page);
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    const sheet = pricingSheet(page);
    await sheet.getByRole("button", { name: "ارتقا" }).click();
    await expect(sheet.getByText("روی اشتراک فعلی")).toBeVisible();
    expect(bodies).toHaveLength(0);
    await sheet.getByRole("button", { name: "انصراف" }).click();
    await expect(sheet.getByText("روی اشتراک فعلی")).toHaveCount(0);
    expect(bodies).toHaveLength(0);
  });

  test("confirming sends exactly the chosen plan and reaches the gateway", async ({
    page,
  }) => {
    const bodies = await mockCheckout(page);
    await page.route("https://pay.example/checkout", (route) =>
      route.fulfill({ contentType: "text/html", body: "Gateway" }),
    );
    await mockShell(page);
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    const sheet = pricingSheet(page);
    await sheet.getByRole("button", { name: "ارتقا" }).click();
    await sheet.getByRole("button", { name: "تأیید و پرداخت" }).click();
    await expect(
      page.getByRole("heading", { name: "تأیید مبلغ پرداخت" }),
    ).toBeVisible();
    expect(bodies).toEqual([{ plan_uuid: MAX.uuid }]);
    await page
      .getByRole("dialog")
      .filter({ has: page.getByRole("heading", { name: "تأیید مبلغ پرداخت" }) })
      .getByRole("button", { name: "ادامهٔ پرداخت" })
      .click();
    await expect(page).toHaveURL("https://pay.example/checkout");
  });

  test("free user buys without a confirm step", async ({ page }) => {
    const bodies = await mockCheckout(page);
    await mockShell(page, { plan: FREE, daysLeft: 3650 });
    await page.goto("/");
    await planCard(page).getByRole("button", { name: "خرید اشتراک" }).click();
    const sheet = pricingSheet(page);
    await expect(sheet.getByRole("article")).toHaveCount(3);
    await sheet
      .getByRole("article")
      .filter({
        has: page.getByRole("heading", { name: BASIC.name, exact: true }),
      })
      .getByRole("button", { name: "خرید", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "تأیید مبلغ پرداخت" }),
    ).toBeVisible();
    expect(bodies).toEqual([{ plan_uuid: BASIC.uuid }]);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens as a sheet, navigates and closes", async ({ page }) => {
    const errors = trackErrors(page);
    await mockShell(page);
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    const nav = page.getByRole("dialog");
    await expect(nav.getByRole("link", { name: "ساخت عکس" })).toBeVisible();
    await expect(planCard(page)).toBeVisible();
    await nav.getByRole("link", { name: "ساخت عکس" }).click();
    await expect(page).toHaveURL(/\/generation\/image/);
    // The overlay sheet must close after navigating on mobile.
    await expect(page.locator('[data-slot="sheet-content"]')).toBeHidden();
    expect(errors).toEqual([]);
  });

  test("plan card still opens pricing from the mobile sheet", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    await expect(
      page.getByRole("heading", { name: "ارتقای اشتراک" }),
    ).toBeVisible();
  });

  test("pricing cards fit a 390px screen without horizontal scroll", async ({
    page,
  }) => {
    await mockShell(page);
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    await planCard(page).getByRole("button", { name: "ارتقا به Max" }).click();
    await expect(pricingSheet(page).getByRole("article").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
