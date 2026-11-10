import { expect, test } from "@playwright/test";

import { isWalletInDebt } from "../model/wallet-balance";

test("only a wallet in debt blocks a generation, like the backend", () => {
  expect(isWalletInDebt(-1)).toBe(true);
  expect(isWalletInDebt(0)).toBe(false);
  expect(isWalletInDebt(500)).toBe(false);
  expect(isWalletInDebt(undefined)).toBe(false);
});
