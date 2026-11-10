import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { EventSourceMessage } from "@microsoft/fetch-event-source";

import {
  PAYMENT_EVENTS_PATH,
  isPaymentAffectedQueryKey,
  isPaymentChangedEvent,
} from "../model/payment-events";

import { useAuthorizedStream } from "@/features/auth";

/** Refreshes payment, wallet and subscription queries on payment events. */
export function usePaymentEvents() {
  const queryClient = useQueryClient();

  const refreshPaymentQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      predicate: ({ queryKey }) => isPaymentAffectedQueryKey(queryKey),
    });
  }, [queryClient]);

  const handleEvent = useCallback(
    (message: EventSourceMessage) => {
      if (isPaymentChangedEvent(message)) refreshPaymentQueries();
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
}
