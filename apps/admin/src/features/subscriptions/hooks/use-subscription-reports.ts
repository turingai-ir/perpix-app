import { useReactQueryApi } from "@/hooks";

export interface SubscriptionReportRangeParams {
  created_from?: string | null;
  created_to?: string | null;
  expires_from?: string | null;
  expires_to?: string | null;
  limit?: number;
}

export function useSubscriptionReports(
  range: SubscriptionReportRangeParams = {},
) {
  const api = useReactQueryApi();
  const options = { staleTime: 60_000 };

  const plansReport = api.useQuery(
    "get",
    "/api/admin/v1/subscription/reports/plans",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          expires_from: range.expires_from || undefined,
          expires_to: range.expires_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  const expirationsReport = api.useQuery(
    "get",
    "/api/admin/v1/subscription/reports/expirations",
    {
      params: {
        query: {
          created_from: range.created_from || undefined,
          created_to: range.created_to || undefined,
          expires_from: range.expires_from || undefined,
          expires_to: range.expires_to || undefined,
          limit: range.limit ?? 100,
        },
      },
    },
    options,
  );

  return {
    plansReport,
    expirationsReport,
  };
}
