import type { SchemaPaymentResponse } from "@/services/api";

type PaymentState = Pick<
  SchemaPaymentResponse,
  "status" | "financial_status" | "fulfillment_status"
>;

export type PaymentViewStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "review";

export function getPaymentViewStatus(payment: PaymentState): PaymentViewStatus {
  if (payment.fulfillment_status === "NEEDS_REVIEW") return "review";
  if (payment.financial_status === "SUCCEEDED") {
    return payment.fulfillment_status === "SUCCEEDED"
      ? "succeeded"
      : "processing";
  }
  if (
    payment.financial_status === "CLOSED" ||
    payment.status === "FAILED" ||
    payment.status === "EXPIRED"
  ) {
    return "failed";
  }
  return "pending";
}
