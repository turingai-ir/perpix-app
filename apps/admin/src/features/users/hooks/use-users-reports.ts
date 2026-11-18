import { useReactQueryApi } from "@/hooks";

export interface UsersReportBucket {
  readonly key: string;
  readonly count: number;
}

/** Daily sign-ups plus status and verification breakdowns. */
export function useUsersReports({ days = 14 }: { days?: number } = {}) {
  const api = useReactQueryApi();
  const options = { staleTime: 60_000 };

  const daily = api.useQuery(
    "get",
    "/api/admin/v1/users/reports/daily",
    { params: { query: { limit: days, sort: "-created_at" } } },
    options,
  );
  const statuses = api.useQuery(
    "get",
    "/api/admin/v1/users/reports/statuses",
    { params: { query: {} } },
    options,
  );
  const verification = api.useQuery(
    "get",
    "/api/admin/v1/users/reports/verification",
    { params: { query: {} } },
    options,
  );

  const items = (data?: { items?: unknown }) =>
    Array.from((data?.items ?? []) as UsersReportBucket[]);

  return {
    daily: items(daily.data),
    statuses: items(statuses.data),
    verification: items(verification.data),
    isLoading: daily.isLoading || statuses.isLoading || verification.isLoading,
  };
}
