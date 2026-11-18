import { useMemo, useState } from "react";
import { useReactQueryApi } from "@/hooks";

export function useOverview() {
  const api = useReactQueryApi();
  const [days, setDays] = useState(7);
  const range = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    return { created_from: start.toISOString(), created_to: end.toISOString() };
  }, [days]);
  const params = { params: { query: { ...range, limit: 1 } } };
  const options = { staleTime: 60_000, retry: false };
  const users = api.useQuery("get", "/api/admin/v1/users", params, options);
  const payments = api.useQuery(
    "get",
    "/api/admin/v1/payments",
    { params: { query: { ...range, limit: 5 } } },
    options,
  );
  const tasks = api.useQuery(
    "get",
    "/api/admin/v1/ai-task/tasks",
    params,
    options,
  );
  const subscriptions = api.useQuery(
    "get",
    "/api/admin/v1/subscriptions",
    params,
    options,
  );
  const files = api.useQuery(
    "get",
    "/api/admin/v1/file-manager/files",
    params,
    options,
  );
  const sessions = api.useQuery(
    "get",
    "/api/admin/v1/auth/sessions",
    params,
    options,
  );
  const daily = api.useQuery(
    "get",
    "/api/admin/v1/payment/reports/daily",
    { params: { query: { ...range, limit: 100 } } },
    options,
  );
  const statuses = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/reports/statuses",
    { params: { query: { ...range, limit: 100 } } },
    options,
  );
  const queries = [
    users,
    payments,
    tasks,
    subscriptions,
    files,
    sessions,
    daily,
    statuses,
  ];
  return {
    days,
    setDays,
    users,
    payments,
    tasks,
    subscriptions,
    files,
    sessions,
    daily,
    statuses,
    fetching: queries.some((query) => query.isFetching),
    refresh: () => {
      queries.forEach((query) => {
        void query.refetch();
      });
    },
  };
}
