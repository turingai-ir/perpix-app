import type { EventSourceMessage } from "@microsoft/fetch-event-source";
import * as z from "zod/mini";

export const PAYMENT_EVENTS_PATH = "/api/v1/payment-events";

const paymentEvent = z.object({
  intent_uuid: z.uuid(),
  execution_uuid: z.uuid(),
});

const affectedPaths = new Set([
  "/api/v1/payment-intents",
  "/api/v1/payment-intents/{intent_uuid}",
  "/api/v1/payment-executions/{execution_uuid}",
  "/api/v1/wallet/wallet",
  "/api/v1/wallet/transactions",
  "/api/v1/user/subscription/active",
]);

/** True for queries whose data a payment change can affect. */
export const isPaymentAffectedQueryKey = (queryKey: readonly unknown[]) =>
  queryKey.some(
    (entry) => typeof entry === "string" && affectedPaths.has(entry),
  );

/** True for a well-formed `payment_changed` stream event. */
export const isPaymentChangedEvent = (message: EventSourceMessage) => {
  if (message.event !== "payment_changed") return false;
  let payload: unknown;
  try {
    payload = JSON.parse(message.data);
  } catch {
    return false;
  }
  return paymentEvent.safeParse(payload).success;
};
