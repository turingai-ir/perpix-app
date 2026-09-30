import { expect, test } from "@playwright/test";

import { getTierPriceUsdmicroRange } from "../_utils/model-pricing";

test("model price range preserves whole microUSD values", () => {
  expect(
    getTierPriceUsdmicroRange([
      { price_usdmicro: 1000 },
      { price_usdmicro: 2000 },
    ]),
  ).toEqual({ min: 1000, max: 2000 });
});
