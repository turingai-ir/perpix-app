import { fetchEventSource } from "@microsoft/fetch-event-source";

import { paymentEventSchema, type PaymentEvent } from "../model/payment-event";

import { APP_KEYS } from "@/utils";

const PAYMENT_EVENTS_PATH = "/api/v1/payment-events";

class UnauthorizedStreamError extends Error {}

export function connectPaymentEvents({
  accessToken,
  signal,
  onConnected,
  onChange,
}: {
  accessToken: string;
  signal: AbortSignal;
  onConnected: () => void;
  onChange: (event: PaymentEvent) => void;
}): Promise<void> {
  return fetchEventSource(`${APP_KEYS.API_BASE_URL}${PAYMENT_EVENTS_PATH}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    openWhenHidden: true,
    signal,
    async onopen(response) {
      if (response.status === 401 || response.status === 403) {
        throw new UnauthorizedStreamError(
          "Payment stream authorization failed",
        );
      }
      if (!response.ok) {
        throw new Error(`Payment stream failed: ${response.status}`);
      }
      onConnected();
    },
    onmessage(message) {
      if (message.event !== "payment_changed") return;
      try {
        const parsed = paymentEventSchema.safeParse(JSON.parse(message.data));
        if (parsed.success) onChange(parsed.data);
      } catch {
        // A malformed notification has no authority over the payment query.
      }
    },
    onclose() {
      throw new Error("Payment stream closed");
    },
    onerror(error) {
      if (error instanceof UnauthorizedStreamError) throw error;
      return 1000;
    },
  });
}
