import { useEffect, useState } from "react";
import { PaymentConfirmationDialog } from "./payment-confirmation-dialog";
import type { SchemaPaymentResponse } from "@/shared/api";
import { isSafeExternalUrl } from "@/shared/utils/safe-external-url";


type PendingPayment = SchemaPaymentResponse & { payment_url: string };
type PaymentRedirectListener = (payment: PendingPayment) => void;
const paymentRedirectListeners = new Set<PaymentRedirectListener>();

function emitPaymentRedirect(payment: SchemaPaymentResponse) {
  if (
    !payment.payment_url ||
    !isSafeExternalUrl(payment.payment_url) ||
    payment.requires_review ||
    payment.status !== "PENDING" ||
    payment.financial_status !== "PENDING"
  )
    return;
  const pending = { ...payment, payment_url: payment.payment_url };
  paymentRedirectListeners.forEach((listener) => listener(pending));
}

export function PaymentRedirectPortal() {
  const [payment, setPayment] = useState<PendingPayment | null>(null);
  useEffect(() => {
    paymentRedirectListeners.add(setPayment);
    return () => {
      paymentRedirectListeners.delete(setPayment);
    };
  }, []);
  return payment ? (
    <PaymentConfirmationDialog
      key={payment.id}
      payment={payment}
      onClose={() => setPayment(null)}
    />
  ) : null;
}

export function usePaymentRedirect() {
  return { openPaymentUrl: emitPaymentRedirect };
}
