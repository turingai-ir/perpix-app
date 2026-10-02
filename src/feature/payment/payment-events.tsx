import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";

import { APP_KEYS } from "@/utils";
import { cookies } from "@/utils/cookies";

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
  const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
  const accessToken = typeof token === "string" ? token : undefined;

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    let connected = false;
    let retryDelay = 3000;
    const refreshPaymentQueries = () => {
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey.some(
            (entry) => typeof entry === "string" && affectedPaths.has(entry),
          ),
      });
    };

    void fetchEventSource(`${APP_KEYS.API_BASE_URL}/api/v1/payment-events`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      openWhenHidden: true,
      signal: controller.signal,
      onopen(response) {
        if (!response.ok) throw new Error(`Payment events: ${response.status}`);
        if (connected) refreshPaymentQueries();
        connected = true;
        return Promise.resolve();
      },
      onmessage(message) {
        if (message.event !== "payment_changed") return;
        let payload: unknown;
        try {
          payload = JSON.parse(message.data);
        } catch {
          return;
        }
        if (!paymentEvent.safeParse(payload).success) return;
        retryDelay = 3000;
        refreshPaymentQueries();
      },
      onclose() {
        throw new Error("Payment event stream closed");
      },
      onerror() {
        const delay = retryDelay;
        retryDelay = Math.min(retryDelay * 2, 30000);
        return delay;
      },
    }).catch(() => {
      // The stream is optional; status pages continue polling while it is unavailable.
    });

    return () => controller.abort();
  }, [accessToken, queryClient]);

  return null;
}
