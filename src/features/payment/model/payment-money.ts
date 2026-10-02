import {
  type SchemaPaymentDetailsResponse,
  type SchemaSupportedCurrency,
  SupportedCurrencyMap,
} from "@/services/api";
import { formatTomanAmount } from "@/utils";

export type PaymentBreakdown = Pick<
  SchemaPaymentDetailsResponse,
  "currency" | "base_amount" | "tax_amount" | "total_amount"
>;

export const paymentCurrencyDisplay: Record<
  SchemaSupportedCurrency,
  { format: typeof formatTomanAmount; label: "common.tomans" }
> = {
  [SupportedCurrencyMap.IRR]: {
    format: formatTomanAmount,
    label: "common.tomans",
  },
};
