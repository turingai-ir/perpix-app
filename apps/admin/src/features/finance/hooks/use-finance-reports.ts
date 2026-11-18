import { useReactQueryApi } from "@/hooks";

export interface ReportRangeParams {
  created_from?: string | null;
  created_to?: string | null;
  limit?: number;
}

export function useFinanceReports(range: ReportRangeParams = {}) {
  const api = useReactQueryApi();
  const options = { staleTime: 60_000 };

  const paymentDaily = api.useQuery(
    "get",
    "/api/admin/v1/payment/reports/daily",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const paymentStatuses = api.useQuery(
    "get",
    "/api/admin/v1/payment/reports/statuses",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const walletDaily = api.useQuery(
    "get",
    "/api/admin/v1/wallet/reports/daily",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const walletSources = api.useQuery(
    "get",
    "/api/admin/v1/wallet/reports/sources",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const walletDirections = api.useQuery(
    "get",
    "/api/admin/v1/wallet/reports/directions",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const walletBalances = api.useQuery(
    "get",
    "/api/admin/v1/wallet/reports/balances",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  return {
    paymentDaily,
    paymentStatuses,
    walletDaily,
    walletSources,
    walletDirections,
    walletBalances,
  };
}
