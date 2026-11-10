import { usePaymentEvents } from "../hooks/use-payment-events";

export function PaymentEventsProvider() {
  usePaymentEvents();
  return null;
}
