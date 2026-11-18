import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  History,
  Check,
  Copy,
  CheckCircle2,
  XCircle,
  Calendar,
  Layers,
  Loader2,
} from "lucide-react";
import {
  useSubscriptionOperations,
  type SubscriptionOperationRowItem,
} from "../hooks/use-subscription-operations";
import { useSubscriptionReports } from "../hooks/use-subscription-reports";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useAppTranslate } from "@/hooks";
import type { AdminReportBucket, AdminSort } from "../model/types";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";

const faNumber = (val: number) => new Intl.NumberFormat("fa-IR").format(val);

const formatDate = (isoString?: string | null) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export function SubscriptionOperationsPage() {
  const { t } = useAppTranslate();
  const [activeTab, setActiveTab] = useState<"logs" | "reports">("logs");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reports range
  const [daysRange, setDaysRange] = useState("30");

  const dateFilter = useMemo(() => {
    if (daysRange === "all") return {};
    const days = parseInt(daysRange, 10);
    const d = new Date();
    d.setDate(d.getDate() - days);
    return { created_from: d.toISOString() };
  }, [daysRange]);

  const { page, limit, offset, sort, filters, setPage, setLimit } =
    useTableQuery<{
      actor_uuid?: string;
      user_uuid?: string;
    }>({
      defaultLimit: 20,
      defaultSort: "-created_at",
    });

  const queryParams = useMemo(
    () => ({
      offset,
      limit,
      sort: sort as AdminSort,
      actor_uuid: filters.actor_uuid,
      user_uuid: filters.user_uuid,
    }),
    [offset, limit, sort, filters],
  );

  const {
    data: opsData,
    isPending,
    isError,
    error,
    refetch,
  } = useSubscriptionOperations(queryParams);
  const { plansReport, expirationsReport } = useSubscriptionReports(dateFilter);

  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: DataTableColumn<SubscriptionOperationRowItem>[] = useMemo(
    () => [
      {
        id: "operation",
        header: t("features.subscriptions.operations.columns.operation", {
          defaultValue: "نوع عملیات",
        }),
        cell: (item) => (
          <Badge variant="outline" className="font-mono text-xs">
            {item.operation}
          </Badge>
        ),
      },
      {
        id: "completed",
        header: t("features.subscriptions.operations.columns.status", {
          defaultValue: "نتیجه",
        }),
        cell: (item) =>
          item.completed ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              {t("features.subscriptions.operations.success", {
                defaultValue: "موفق",
              })}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="size-3" />
              {t("features.subscriptions.operations.failed", {
                defaultValue: "ناموفق",
              })}
            </Badge>
          ),
      },
      {
        id: "user",
        header: t("features.subscriptions.operations.columns.targetUser", {
          defaultValue: "کاربر هدف",
        }),
        cell: (item) => (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Link
              to={`/users/${item.user_uuid}`}
              className="text-primary hover:underline"
              title={item.user_uuid}
            >
              {item.user_uuid.slice(0, 8)}…{item.user_uuid.slice(-4)}
            </Link>
            <button
              type="button"
              onClick={() => handleCopy(item.user_uuid)}
              aria-label="کپی شناسه کاربر"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
            >
              {copiedId === item.user_uuid ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        ),
      },
      {
        id: "actor",
        header: t("features.subscriptions.operations.columns.actor", {
          defaultValue: "انجام‌دهنده (مدیر / سیستم)",
        }),
        cell: (item) => (
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <span title={item.actor_uuid}>
              {item.actor_uuid.slice(0, 8)}…{item.actor_uuid.slice(-4)}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(item.actor_uuid)}
              aria-label="کپی شناسه مدیر"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
            >
              {copiedId === item.actor_uuid ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        ),
      },
      {
        id: "created_at",
        header: t("features.subscriptions.operations.columns.date", {
          defaultValue: "زمان ثبت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(item.created_at)}
          </span>
        ),
      },
    ],
    [copiedId, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <History aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.subscriptions.menuTitle", {
              defaultValue: "اشتراک‌ها",
            })}
          </span>
          <span>/</span>
          <span>
            {t("features.subscriptions.operations.title", {
              defaultValue: "سوابق عملیات و گزارش‌ها",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("features.subscriptions.operations.title", {
                defaultValue: "سوابق عملیات و گزارش‌های اشتراک",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("features.subscriptions.operations.description", {
                defaultValue:
                  "رهگیری تغییرات وضعیت، فعال‌سازی‌های مدیر و گزارش‌های تجمیعی پلن‌ها",
              })}
            </p>
          </div>

          <div className="border-border bg-card flex items-center gap-2 rounded-xl border p-1">
            <Button
              variant={activeTab === "logs" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("logs")}
              className="cursor-pointer gap-2"
            >
              <History className="size-4" />
              {t("features.subscriptions.operations.tabs.logs", {
                defaultValue: "سوابق عملیات",
              })}
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("reports")}
              className="cursor-pointer gap-2"
            >
              <Layers className="size-4" />
              {t("features.subscriptions.operations.tabs.reports", {
                defaultValue: "گزارش‌های آماری",
              })}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab 1: Operations Log */}
      {activeTab === "logs" && (
        <DataTable
          columns={columns}
          data={opsData?.items ? Array.from(opsData.items) : undefined}
          isLoading={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          onRetry={() => {
            void refetch();
          }}
          keyExtractor={(item) => item.uuid}
          pagination={{
            page,
            limit,
            totalCount: opsData?.total_count ?? 0,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}

      {/* Tab 2: Statistical Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="border-border flex items-center justify-between border-b pb-4">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Layers className="text-primary size-4" />
              {t("features.subscriptions.operations.reportsTitle", {
                defaultValue: "گزارش‌های دوره‌ای اشتراک‌ها",
              })}
            </h2>

            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground size-4" />
              <Select
                value={daysRange}
                onChange={(e) => setDaysRange(e.target.value)}
                className="w-40 text-xs"
              >
                <option value="1">۲۴ ساعت اخیر</option>
                <option value="7">۷ روز گذشته</option>
                <option value="30">۳۰ روز گذشته</option>
                <option value="90">۹۰ روز گذشته</option>
                <option value="all">تمام سوابق</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Plans Distribution Report */}
            <SubscriptionBucketTable
              title={t("features.subscriptions.reports.plansTitle", {
                defaultValue: "توزیع اشتراک‌ها بر اساس پلن",
              })}
              keyHeader="پلن"
              buckets={plansReport.data?.items}
              isLoading={plansReport.isPending}
            />

            {/* Expirations Report */}
            <SubscriptionBucketTable
              title={t("features.subscriptions.reports.expirationsTitle", {
                defaultValue: "روند انقضای اشتراک‌ها",
              })}
              keyHeader="تاریخ انقضا"
              buckets={expirationsReport.data?.items}
              isLoading={expirationsReport.isPending}
              formatKeyAsDate
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionBucketTable({
  title,
  keyHeader,
  buckets,
  isLoading,
  formatKeyAsDate = false,
}: {
  title: string;
  keyHeader: string;
  buckets?: unknown;
  isLoading: boolean;
  formatKeyAsDate?: boolean;
}) {
  const items: AdminReportBucket[] = buckets
    ? Array.from(buckets as ArrayLike<AdminReportBucket>)
    : [];

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="border-border flex flex-row items-center justify-between border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <span className="text-muted-foreground font-mono text-xs">
          {items.length ? `${faNumber(items.length)} مورد` : ""}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 p-8 text-sm">
            <Loader2 className="text-primary size-4 animate-spin" />
            در حال دریافت گزارش...
          </div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground p-8 text-center text-xs">
            داده‌ای در این بازه زمانی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right text-xs">
                    {keyHeader}
                  </TableHead>
                  <TableHead className="text-center text-xs">
                    تعداد اشتراک
                  </TableHead>
                  <TableHead className="text-left font-mono text-xs">
                    مبلغ (میکرودلار)
                  </TableHead>
                  <TableHead className="text-left font-mono text-xs">
                    مبلغ معادل ریالی
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((b, idx) => {
                  const displayKey = formatKeyAsDate
                    ? formatDate(b.key)
                    : b.key;

                  return (
                    <TableRow key={`${b.key}-${idx}`}>
                      <TableCell className="text-xs font-medium">
                        {displayKey}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-semibold">
                        {faNumber(b.count)}
                      </TableCell>
                      <TableCell className="text-left text-xs">
                        <UsdmicroAmount
                          value={b.amount_usdmicro || 0}
                          amountClassName="text-primary font-semibold"
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-left font-mono text-xs">
                        {b.amount_irr ? `${faNumber(b.amount_irr)} ریال` : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
