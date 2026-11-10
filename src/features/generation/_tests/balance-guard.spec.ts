import { expect, test } from "@playwright/test";

import { isBalanceBelowCost } from "../model/wallet-balance";

test("blocks only when the balance cannot pay the cheapest generation", () => {
  expect(isBalanceBelowCost(0, 1000)).toBe(true);
  expect(isBalanceBelowCost(999, 1000)).toBe(true);
  expect(isBalanceBelowCost(1000, 1000)).toBe(false);
});

test("never blocks on unknown balance or free models", () => {
  expect(isBalanceBelowCost(undefined, 1000)).toBe(false);
  expect(isBalanceBelowCost(0, null)).toBe(false);
  expect(isBalanceBelowCost(0, 0)).toBe(false);
});
