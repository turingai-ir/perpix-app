import {
  type SchemaPaymentDetailsResponse,
  type SchemaSupportedCurrency,
  SupportedCurrencyMap,
} from "@/shared/api";
import { formatTomanAmount } from "@/shared/utils";

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
