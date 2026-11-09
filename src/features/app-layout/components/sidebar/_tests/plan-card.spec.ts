import { expect, test, type Page } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../../__tests__/support/auth-session";

const DAY = 24 * 60 * 60 * 1000;

const makePlan = (
  uuid: string,
  name: string,
  price: number,
  isDefault = false,
) => ({
  uuid,
  name,
  display_name: name,
  description: "",
  scopes: [],
  allowed_models: [],
  base_price_usdmicro: price,
  discounted_price_usdmicro: price,
  base_price_irr: price * 10,
  discounted_price_irr: price * 10,
  duration_days: 30,
  balance_gift_amount_usdmicro: null,
  meta: { features: [] },
  is_active: true,
  is_recommended: false,
  is_default: isDefault,
  created_at: "2026-09-30T00:00:00Z",
  updated_at: "2026-09-30T00:00:00Z",
});

const free = makePlan("free", "Free", 0, true);
const pro = makePlan("pro", "Pro", 20);
const max = makePlan("max", "Max", 30);

async function setup(
  page: Page,
  plan: ReturnType<typeof makePlan>,
  daysLeft: number,
) {
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({ json: { uuid: "u", name: "T", email: "t@example.com" } }),
  );
  await page.route("**/api/v1/user/subscription/plans", (route) =>
    route.fulfill({ json: { items: [free, pro, max] } }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "s",
        plan,
        started_at: new Date(Date.now() - 10 * DAY).toISOString(),
        expires_at: new Date(Date.now() + daysLeft * DAY).toISOString(),
      },
    }),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
}

test("free user is invited to subscribe", async ({ page }) => {
  await setup(page, free, 30);
  const card = page.getByRole("region", { name: "اشتراک من" });
  await expect(card.getByRole("button", { name: "خرید اشتراک" })).toBeVisible();
  await expect(card.getByRole("progressbar")).toHaveCount(0);
});

test("paid user sees progress and the next plan", async ({ page }) => {
  await setup(page, pro, 20);
  const card = page.getByRole("region", { name: "اشتراک من" });
  await expect(card.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "67",
  );
  await expect(
    card.getByRole("button", { name: "ارتقا به Max" }),
  ).toBeVisible();
  await card.screenshot({ path: "test-results/plan-card-active.png" });
});

test("expiring plan asks for renewal and top tier has no upgrade", async ({
  page,
}) => {
  await setup(page, max, 3);
  const card = page.getByRole("region", { name: "اشتراک من" });
  await expect(
    card.getByRole("button", { name: "تمدید اشتراک" }),
  ).toBeVisible();
  await card.screenshot({ path: "test-results/plan-card-expiring.png" });
});

test("top tier far from expiry shows no call to action", async ({ page }) => {
  await setup(page, max, 25);
  const card = page.getByRole("region", { name: "اشتراک من" });
  await expect(card.getByRole("progressbar")).toBeVisible();
  await expect(card.getByRole("button")).toHaveCount(0);
});
