import { expect, test } from "@playwright/test";

import {
  isPaymentAffectedQueryKey,
  isPaymentChangedEvent,
} from "../model/payment-events";

const uuid = "4f1c2b8e-9a3d-4c5e-8f6a-1b2c3d4e5f60";
const message = (event: string, data: string) => ({ event, data, id: "" });

test("only a valid payment_changed event counts", () => {
  const valid = JSON.stringify({ intent_uuid: uuid, execution_uuid: uuid });

  expect(isPaymentChangedEvent(message("payment_changed", valid))).toBe(true);
  expect(isPaymentChangedEvent(message("other", valid))).toBe(false);
  expect(isPaymentChangedEvent(message("payment_changed", "{bad"))).toBe(false);
  expect(
    isPaymentChangedEvent(message("payment_changed", '{"intent_uuid":"x"}')),
  ).toBe(false);
});

test("payment, wallet and subscription queries are affected", () => {
  expect(isPaymentAffectedQueryKey(["get", "/api/v1/wallet/wallet"])).toBe(
    true,
  );
  expect(
    isPaymentAffectedQueryKey(["get", "/api/v1/user/subscription/active"]),
  ).toBe(true);
  expect(isPaymentAffectedQueryKey(["get", "/api/v1/ai-task/list"])).toBe(
    false,
  );
});
