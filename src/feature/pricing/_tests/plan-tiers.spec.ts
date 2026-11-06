import { expect, test } from "@playwright/test";

import { getPlanAccess, resolvePlanTiers } from "../plan-tiers";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse("2026-11-06T00:00:00Z");

const makePlan = (uuid: string, price: number, extra = {}) =>
  ({
    uuid,
    name: uuid,
    display_name: uuid,
    is_active: true,
    is_default: false,
    duration_days: 30,
    discounted_price_usdmicro: price,
    ...extra,
  }) as never;

const free = makePlan("free", 0, { is_default: true });
const basic = makePlan("basic", 10);
const pro = makePlan("pro", 20);
const max = makePlan("max", 30);
const plans = [max, free, basic, pro];

const subscribe = (plan: unknown, daysLeft: number) =>
  ({
    plan,
    started_at: new Date(now - (30 - daysLeft) * DAY).toISOString(),
    expires_at: new Date(now + daysLeft * DAY).toISOString(),
  }) as never;

test.describe("resolvePlanTiers", () => {
  test("free user sees every paid plan, cheapest first", () => {
    const tiers = resolvePlanTiers(plans, subscribe(free, 30), now);
    expect(tiers.status).toBe("free");
    expect(tiers.upgrades.map((plan) => plan.uuid)).toEqual([
      "basic",
      "pro",
      "max",
    ]);
    expect(tiers.nextPlan?.uuid).toBe("basic");
    expect(tiers.canRenew).toBe(false);
  });

  test("paid user only sees plans at or above the current tier", () => {
    const tiers = resolvePlanTiers(plans, subscribe(pro, 20), now);
    expect(tiers.status).toBe("upgradable");
    expect(tiers.upgrades.map((plan) => plan.uuid)).toEqual(["max"]);
    expect(tiers.nextPlan?.uuid).toBe("max");
    expect(tiers.daysLeft).toBe(20);
    expect(tiers.remainingRatio).toBeCloseTo(20 / 30);
    expect(tiers.canRenew).toBe(false);
  });

  test("top tier has no next plan and renews only in the last days", () => {
    const early = resolvePlanTiers(plans, subscribe(max, 25), now);
    expect(early.status).toBe("top");
    expect(early.nextPlan).toBeNull();
    expect(early.canRenew).toBe(false);
    expect(resolvePlanTiers(plans, subscribe(max, 2), now).canRenew).toBe(true);
  });

  test("last days flag the plan as expiring and renewable", () => {
    const tiers = resolvePlanTiers(plans, subscribe(pro, 3), now);
    expect(tiers.isExpiring).toBe(true);
    expect(tiers.canRenew).toBe(true);
  });

  test("missing subscription is treated as free", () => {
    expect(resolvePlanTiers(plans, null, now).status).toBe("free");
  });

  test("inactive plans are never offered", () => {
    const hidden = makePlan("hidden", 15, { is_active: false });
    const tiers = resolvePlanTiers([...plans, hidden], null, now);
    expect(tiers.upgrades.some((plan) => plan.uuid === "hidden")).toBe(false);
  });

  test("ladder lists every paid plan and access is locked below the tier", () => {
    const tiers = resolvePlanTiers(plans, subscribe(pro, 20), now);
    expect(tiers.ladder.map((plan) => plan.uuid)).toEqual([
      "basic",
      "pro",
      "max",
    ]);
    const access = Object.fromEntries(
      tiers.ladder.map((plan) => [plan.uuid, getPlanAccess(plan, tiers)]),
    );
    expect(access).toEqual({ basic: "lower", pro: "current", max: "upgrade" });
  });

  test("current plan becomes renewable in the last days", () => {
    const tiers = resolvePlanTiers(plans, subscribe(pro, 2), now);
    expect(getPlanAccess(pro, tiers)).toBe("renew");
  });

  test("free users may buy every plan", () => {
    const tiers = resolvePlanTiers(plans, subscribe(free, 30), now);
    expect(tiers.ladder.every((plan) => getPlanAccess(plan, tiers) === "buy")).toBe(true);
  });
});
