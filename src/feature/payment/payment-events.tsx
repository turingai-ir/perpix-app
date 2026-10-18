import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { EventSourceMessage } from "@microsoft/fetch-event-source";
import { z } from "zod";

import { useAuthorizedStream } from "@/features/auth";

const PAYMENT_EVENTS_PATH = "/api/v1/payment-events";

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

export function PaymentEventsProvider() {
  const queryClient = useQueryClient();

  const refreshPaymentQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        queryKey.some(
          (entry) => typeof entry === "string" && affectedPaths.has(entry),
        ),
    });
  }, [queryClient]);

  const handleEvent = useCallback(
    (message: EventSourceMessage) => {
      if (message.event !== "payment_changed") return;
      let payload: unknown;
      try {
        payload = JSON.parse(message.data);
      } catch {
        return;
      }
      if (paymentEvent.safeParse(payload).success) refreshPaymentQueries();
    },
    [refreshPaymentQueries],
  );

  // No replay or cursor exists, so every reconnect re-reads the snapshot.
  const handleOpen = useCallback(
    (isReconnect: boolean) => {
      if (isReconnect) refreshPaymentQueries();
    },
    [refreshPaymentQueries],
  );

  useAuthorizedStream({
    path: PAYMENT_EVENTS_PATH,
    onEvent: handleEvent,
    onOpen: handleOpen,
  });

  return null;
}
