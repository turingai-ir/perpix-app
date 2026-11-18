import type { components } from "@/services/api/api";

export type PaymentsRow = components["schemas"]["PaymentsRow"];
export type AdminPagePaymentsRow =
  components["schemas"]["AdminPage_PaymentsRow_"];
export type WalletsRow = components["schemas"]["WalletsRow"];
export type AdminPageWalletsRow =
  components["schemas"]["AdminPage_WalletsRow_"];
export type TransactionsRow = components["schemas"]["TransactionsRow"];
export type AdminPageTransactionsRow =
  components["schemas"]["AdminPage_TransactionsRow_"];
export type ChargeWalletRequest = components["schemas"]["ChargeWalletRequest"];
export type CreateWalletTransactionResponse =
  components["schemas"]["CreateWalletTransactionResponse"];
export type CurrencyExchangeRateRefreshResponse =
  components["schemas"]["CurrencyExchangeRateRefreshResponse"];
export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
export type AdminSort = components["schemas"]["AdminSort"];
export type WalletTransactionTypeEnum =
  components["schemas"]["WalletTransactionTypeEnum"];
export type WalletOperationSourceEnum =
  components["schemas"]["WalletOperationSourceEnum"];
export type PaymentFinancialStatus =
  components["schemas"]["PaymentFinancialStatus"];
export type PaymentFulfillmentStatus =
  components["schemas"]["PaymentFulfillmentStatus"];

export type FinancialStatusEnum = PaymentFinancialStatus;
export type FulfillmentStatusEnum = PaymentFulfillmentStatus;

export type PaymentTargetTypeEnum = "subscription" | "wallet_topup";

export interface PaymentsFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  amount_min_usdmicro?: number | null;
  amount_max_usdmicro?: number | null;
  resource_uuid?: string | null;
  user_uuid?: string | null;
  search?: string | null;
  financial_status?: FinancialStatusEnum | null;
  fulfillment_status?: FulfillmentStatusEnum | null;
  target_type?: string | null;
}

export interface WalletsFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  resource_uuid?: string | null;
  user_uuid?: string | null;
}

export interface TransactionsFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  amount_min_usdmicro?: number | null;
  amount_max_usdmicro?: number | null;
  resource_uuid?: string | null;
  user_uuid?: string | null;
  wallet_uuid?: string | null;
  search?: string | null;
  type?: WalletTransactionTypeEnum | null;
  source?: WalletOperationSourceEnum | null;
  direction?: "credit" | "debit" | null;
}
