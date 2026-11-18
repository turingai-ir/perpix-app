import { expect, test } from "@playwright/test";

import { getRunwayDays, summarizeActivity } from "../activity";

const now = new Date(2026, 10, 6, 15, 0, 0);
const at = (daysAgo: number, hour = 10) =>
  new Date(2026, 10, 6 - daysAgo, hour).toISOString();

test.describe("summarizeActivity", () => {
  test("sums today's spending and counts creations", () => {
    const result = summarizeActivity(
      [
        { amount_usdmicro: 3_000_000, created_at: at(0, 9) },
        { amount_usdmicro: 5_000_000, created_at: at(0, 13) },
      ],
      now,
    );
    expect(result.todaySpent).toBe(8_000_000);
    expect(result.todayCount).toBe(2);
    expect(result.series).toHaveLength(7);
    expect(result.series[6]).toBe(8_000_000);
  });

  test("buckets earlier days oldest first and ignores older history", () => {
    const result = summarizeActivity(
      [
        { amount_usdmicro: 1_000_000, created_at: at(1) },
        { amount_usdmicro: 2_000_000, created_at: at(6) },
        { amount_usdmicro: 9_000_000, created_at: at(7) },
      ],
      now,
    );
    expect(result.series[5]).toBe(1_000_000);
    expect(result.series[0]).toBe(2_000_000);
    expect(result.maxSpent).toBe(2_000_000);
    expect(result.todayCount).toBe(0);
  });

  test("skips transactions with invalid dates", () => {
    const result = summarizeActivity(
      [{ amount_usdmicro: 1_000_000, created_at: "not-a-date" }],
      now,
    );
    expect(result.todaySpent).toBe(0);
  });
});

test.describe("getRunwayDays", () => {
  const week = [0, 0, 0, 0, 0, 0, 7_000_000];

  test("divides the balance by the average daily spend", () => {
    expect(getRunwayDays(10_000_000, week)).toBe(10);
  });

  test("returns null without spending history or balance", () => {
    expect(getRunwayDays(10_000_000, [0, 0, 0])).toBeNull();
    expect(getRunwayDays(0, week)).toBeNull();
  });
});
