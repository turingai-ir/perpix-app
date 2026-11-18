import {
  Activity,
  ArrowUpLeft,
  CreditCard,
  Layers,
  LayoutDashboard,
  RefreshCw,
  Users,
  Files,
  Shield,
} from "lucide-react";
import { Link } from "react-router";
import { useOverview } from "../hooks/use-overview";
import { ReportPanel } from "./report-panel";
import { useAppTranslate } from "@/hooks";
import { Button } from "@/components/ui/button";

const number = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
const date = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
      }).format(parsed);
};

export function OverviewPage() {
  const { t } = useAppTranslate();
  const data = useOverview();
  const cards = [
    {
      key: "users",
      icon: Users,
      query: data.users,
      color: "text-blue-600 bg-blue-500/10",
      href: "/users",
    },
    {
      key: "payments",
      icon: CreditCard,
      query: data.payments,
      color: "text-emerald-600 bg-emerald-500/10",
      href: "/finance/payments",
    },
    {
      key: "tasks",
      icon: Activity,
      query: data.tasks,
      color: "text-violet-600 bg-violet-500/10",
      href: "/ai/tasks",
    },
    {
      key: "subscriptions",
      icon: Layers,
      query: data.subscriptions,
      color: "text-amber-600 bg-amber-500/10",
      href: "/subscriptions",
    },
    {
      key: "files",
      icon: Files,
      query: data.files,
      color: "text-cyan-600 bg-cyan-500/10",
      href: "/files",
    },
    {
      key: "sessions",
      icon: Shield,
      query: data.sessions,
      color: "text-rose-600 bg-rose-500/10",
      href: "/auth/sessions",
    },
  ] as const;
  const daily = Array.from(data.daily.data?.items ?? []).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  const maximum = Math.max(1, ...daily.map((item) => item.count));
  const statuses = Array.from(data.statuses.data?.items ?? []);
  const total = statuses.reduce((sum, item) => sum + item.count, 0);
  return (
    <div>
      <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 sm:py-10">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <LayoutDashboard aria-hidden="true" className="size-4" />
          {t("overview.admin")}
          <span>/</span>
          <span className="text-foreground">{t("overview.title")}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("overview.title")}
            </h1>
            <p className="text-muted-foreground mt-3 text-sm">
              {t("overview.description")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="period" className="sr-only">
              {t("overview.period")}
            </label>
            <select
              id="period"
              value={data.days}
              onChange={(event) => data.setDays(Number(event.target.value))}
              className="border-border bg-card h-10 rounded-lg border px-3 text-sm"
            >
              {[7, 30, 90].map((days) => (
                <option key={days} value={days}>
                  {t("overview.days", { count: days })}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              className="h-10"
              disabled={data.fetching}
              onClick={data.refresh}
            >
              <RefreshCw
                aria-hidden="true"
                className={data.fetching ? "animate-spin" : ""}
              />
              {t("overview.refresh")}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ key, icon: Icon, query, color, href }) => {
            const content = (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <ArrowUpLeft
                    aria-hidden="true"
                    className="text-muted-foreground size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t(`overview.${key}`)}
                </p>
                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {query.isPending
                    ? "…"
                    : query.isError
                      ? "—"
                      : number(query.data?.total_count ?? 0)}
                </p>
                <p className="text-muted-foreground mt-3 text-xs">
                  {t(query.isError ? "overview.error" : "overview.inPeriod")}
                </p>
              </>
            );

            if (href) {
              return (
                <Link
                  key={key}
                  to={href}
                  className="group border-border bg-card hover:border-primary/40 rounded-2xl border p-5 transition-all hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <section
                key={key}
                className="border-border bg-card rounded-2xl border p-5"
              >
                {content}
              </section>
            );
          })}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          <ReportPanel
            title={t("overview.daily")}
            pending={data.daily.isPending}
            error={data.daily.isError}
            empty={!daily.length}
            retry={() => {
              void data.daily.refetch();
            }}
          >
            <p className="text-muted-foreground mb-5 text-xs">
              {t("overview.dailyHint")}
            </p>
            <div
              className="flex h-52 items-end gap-2 overflow-x-auto border-b pb-2"
              dir="ltr"
            >
              {daily.map((item) => (
                <div
                  key={item.key}
                  className="flex h-full min-w-9 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-muted-foreground text-xs">
                    {number(item.count)}
                  </span>
                  <div
                    title={`${date(item.key)}: ${number(item.count)}`}
                    className="bg-primary/80 w-full max-w-12 rounded-t-md"
                    style={{
                      height: `${Math.max(2, (item.count / maximum) * 145)}px`,
                    }}
                  />
                  <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                    {date(item.key)}
                  </span>
                </div>
              ))}
            </div>
          </ReportPanel>
          <ReportPanel
            title={t("overview.statuses")}
            pending={data.statuses.isPending}
            error={data.statuses.isError}
            empty={!statuses.length}
            retry={() => {
              void data.statuses.refetch();
            }}
          >
            <div className="space-y-5">
              {statuses.map((item, index) => (
                <div key={item.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>
                      {t(`overview.statusLabels.${item.key}`, {
                        defaultValue: item.key,
                      })}
                    </span>
                    <span className="font-medium">{number(item.count)}</span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className={
                        [
                          "bg-primary",
                          "bg-emerald-500",
                          "bg-amber-500",
                          "bg-rose-500",
                        ][index % 4]
                      }
                      style={{
                        width: `${total ? (item.count / total) * 100 : 0}%`,
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ReportPanel>
        </div>
        <ReportPanel
          title={t("overview.recent")}
          pending={data.payments.isPending}
          error={data.payments.isError}
          empty={!data.payments.data?.items.length}
          retry={() => {
            void data.payments.refetch();
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-right text-sm">
              <thead className="text-muted-foreground border-b text-xs">
                <tr>
                  {(["id", "type", "amount", "status", "date"] as const).map(
                    (key) => (
                      <th key={key} className="px-3 pb-4 font-medium">
                        {t(`overview.${key}`)}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from(data.payments.data?.items ?? []).map((payment) => (
                  <tr
                    key={payment.uuid}
                    className="border-border border-b last:border-0"
                  >
                    <td
                      className="px-3 py-5 font-mono text-xs"
                      title={payment.uuid}
                    >
                      {payment.uuid.slice(0, 8)}
                    </td>
                    <td className="px-3 py-5">
                      {t(`overview.targetLabels.${payment.target_type}`, {
                        defaultValue: payment.target_type,
                      })}
                    </td>
                    <td className="px-3 py-5 tabular-nums">
                      {number(payment.total_irr)}{" "}
                      <span className="text-muted-foreground text-xs">
                        {t("overview.rial")}
                      </span>
                    </td>
                    <td className="px-3 py-5">
                      <span className="bg-muted inline-flex rounded-full px-3 py-1 text-xs">
                        {t(
                          `overview.statusLabels.${payment.financial_status}`,
                          { defaultValue: payment.financial_status },
                        )}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-3 py-5">
                      {date(payment.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportPanel>
        <p className="text-muted-foreground text-center text-xs">
          {t("overview.footer")}
        </p>
      </main>
    </div>
  );
}
