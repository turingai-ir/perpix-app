import { useReactQueryApi } from "@/hooks";
import type { PaymentsFilterParams } from "../model/types";

export function usePaymentsList(params: PaymentsFilterParams) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/payments",
    {
      params: {
        query: {
          offset: params.offset ?? 0,
          limit: params.limit ?? 20,
          sort: params.sort ?? "-created_at",
          created_from: params.created_from || undefined,
          created_to: params.created_to || undefined,
          amount_min_usdmicro: params.amount_min_usdmicro ?? undefined,
          amount_max_usdmicro: params.amount_max_usdmicro ?? undefined,
          resource_uuid: params.resource_uuid || undefined,
          user_uuid: params.user_uuid || undefined,
          search: params.search || undefined,
          financial_status: params.financial_status || undefined,
          fulfillment_status: params.fulfillment_status || undefined,
          target_type: params.target_type || undefined,
        },
      },
    },
    {
      placeholderData: (prev) => prev,
      staleTime: 30_000,
    },
  );

  return query;
}

export type PaymentsListResponse = NonNullable<
  ReturnType<typeof usePaymentsList>["data"]
>;
export type PaymentsRowItem = NonNullable<
  PaymentsListResponse["items"]
>[number];
