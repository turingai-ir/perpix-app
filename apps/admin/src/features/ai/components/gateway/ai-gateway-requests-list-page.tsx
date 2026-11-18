import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Cpu,
  ExternalLink,
  RotateCcw,
  BarChart3,
  ListFilter,
} from "lucide-react";
import {
  useAiGatewayRequestsList,
  type AiGatewayRequestsRowItem,
} from "../../hooks/use-ai-gateway-requests-list";
import { useAiGatewayReports } from "../../hooks/use-ai-gateway-reports";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import { cn } from "@/lib/utils";
import type { AdminSort, GenerationStatusEnum } from "../../model/types";
import {
  GENERATION_STATUS_LABELS,
  GenerationStatusBadge,
} from "./generation-status-badge";

export function AiGatewayRequestsListPage() {
  const { t } = useAppTranslate();
  const [activeTab, setActiveTab] = useState<"list" | "reports">("list");

  const {
    page,
    limit,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery({
    defaultLimit: 10,
    defaultSort: "-created_at",
  });

  const { requests, totalCount, isLoading, error, refetch } =
    useAiGatewayRequestsList({
      page,
      limit,
      sort: (sort as AdminSort) || "-created_at",
      search,
      userUuid: (filters.user_uuid as string) || undefined,
      status: (filters.status as GenerationStatusEnum | "ALL") || "ALL",
      openOnly: filters.open_only === "true",
    });

  const {
    dailyReport,
    modelsReport,
    providersReport,
    statusesReport,
    isLoading: isReportsLoading,
  } = useAiGatewayReports({
    userUuid: (filters.user_uuid as string) || undefined,
  });

  const columns: DataTableColumn<AiGatewayRequestsRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.ai.gateway.columns.uuid", {
          defaultValue: "شناسه درخواست",
        }),
        cell: (item) => (
          <Link
            to={`/ai/gateway-requests/${item.uuid}`}
            className="text-primary font-mono text-xs font-semibold hover:underline"
          >
            {item.uuid.slice(0, 8)}...
          </Link>
        ),
      },
      {
        id: "status",
        header: t("features.ai.gateway.columns.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) => <GenerationStatusBadge status={item.status} />,
      },
      {
        id: "model_name",
        header: t("features.ai.gateway.columns.model", {
          defaultValue: "مدل",
        }),
        cell: (item) => (
          <span className="text-foreground text-xs font-medium">
            {item.model_name || item.model_uuid || "-"}
          </span>
        ),
      },
      {
        id: "provider_name",
        header: t("features.ai.gateway.columns.provider", {
          defaultValue: "ارائه‌دهنده",
        }),
        cell: (item) => (
          <span className="text-muted-foreground font-mono text-xs">
            {item.provider_name || item.provider_uuid || "-"}
          </span>
        ),
      },
      {
        id: "cost",
        header: t("features.ai.gateway.columns.cost", {
          defaultValue: "هزینه (میکرودلار)",
        }),
        cell: (item) => {
          const micro =
            item.actual_cost_usdmicro ?? item.estimated_cost_usdmicro;
          return (
            <UsdmicroAmount
              value={micro}
              className="text-xs"
              amountClassName="font-semibold"
            />
          );
        },
      },
      {
        id: "attempts",
        header: t("features.ai.gateway.columns.retries", {
          defaultValue: "تلاش‌ها",
        }),
        cell: (item) => (
          <span className="font-mono text-xs">
            {item.attempts > 1 ? (
              <Badge variant="outline" className="text-amber-600">
                {item.attempts}
              </Badge>
            ) : (
              "۰"
            )}
          </span>
        ),
      },
      {
        id: "created_at",
        header: t("features.ai.gateway.columns.createdAt", {
          defaultValue: "زمان ثبت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex justify-end">
            <Link
              to={`/ai/gateway-requests/${item.uuid}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 gap-1 text-xs",
              )}
            >
              <ExternalLink className="size-3.5" />
              {t("common.details", { defaultValue: "جزئیات" })}
            </Link>
          </div>
        ),
      },
    ],
    [t],
  );

  const hasActiveFilters = Boolean(
    search ||
    filters.user_uuid ||
    (filters.status && filters.status !== "ALL") ||
    filters.open_only === "true" ||
    sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Cpu aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.ai.gateway.menuTitle", {
              defaultValue: "درخواست‌های Gateway",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.ai.gateway.pageTitle", {
                defaultValue: "درخواست‌های AI Gateway",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.ai.gateway.pageDesc", {
                defaultValue:
                  "مدیریت و نظارت بر کلیه فراخوانی‌های Gateway به ارائه‌دهندگان هوش مصنوعی",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border bg-card flex w-fit items-center gap-2 rounded-xl border p-1">
        <Button
          variant={activeTab === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("list")}
          className="cursor-pointer gap-2"
        >
          <ListFilter className="size-4" />
          {t("features.ai.gateway.tabs.list", {
            defaultValue: "لیست درخواست‌ها",
          })}
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
          className="cursor-pointer gap-2"
        >
          <BarChart3 className="size-4" />
          {t("features.ai.gateway.tabs.reports", {
            defaultValue: "گزارش‌های Gateway",
          })}
        </Button>
      </div>

      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <SearchInput
                value={search || ""}
                onChange={setSearch}
                placeholder={t("features.ai.gateway.searchPlaceholder", {
                  defaultValue: "جستجو در درخواست‌ها...",
                })}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={(filters.status as string) || "ALL"}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                <option value="ALL">
                  {t("features.ai.gateway.statuses.all", {
                    defaultValue: "همه وضعیت‌ها",
                  })}
                </option>
                {Object.entries(GENERATION_STATUS_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </Select>
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={(filters.open_only as string) || "false"}
                onChange={(e) => setFilter("open_only", e.target.value)}
              >
                <option value="false">همه درخواست‌ها</option>
                <option value="true">فقط باز (در جریان)</option>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={sort || "-created_at"}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-created_at">
                  {t("common.sortNewest", { defaultValue: "جدیدترین" })}
                </option>
                <option value="created_at">
                  {t("common.sortOldest", { defaultValue: "قدیمی‌ترین" })}
                </option>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="size-3.5" />
                {t("common.resetFilters", { defaultValue: "حذف فیلترها" })}
              </Button>
            )}
          </div>

          {/* Table */}
          <DataTable<AiGatewayRequestsRowItem>
            keyExtractor={(item) => item.uuid}
            data={requests ? Array.from(requests) : []}
            columns={columns}
            isLoading={isLoading}
            isError={Boolean(error)}
            errorMessage={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
            pagination={{
              page,
              limit,
              totalCount,
              onPageChange: setPage,
              onLimitChange: setLimit,
            }}
            emptyMessage={t("features.ai.gateway.empty", {
              defaultValue: "درخواستی یافت نشد.",
            })}
          />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Statuses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">
                  {t("features.ai.gateway.reports.statuses", {
                    defaultValue: "بر اساس وضعیت",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال بارگذاری...
                  </p>
                ) : (
                  statusesReport.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>
                        {b.key && b.key in GENERATION_STATUS_LABELS ? (
                          <GenerationStatusBadge
                            status={b.key as GenerationStatusEnum}
                          />
                        ) : (
                          b.key || "-"
                        )}
                      </span>
                      <span className="font-mono font-bold">
                        {b.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Models */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">
                  {t("features.ai.gateway.reports.models", {
                    defaultValue: "بر اساس مدل",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال بارگذاری...
                  </p>
                ) : (
                  modelsReport.slice(0, 5).map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate font-mono">{b.key || "-"}</span>
                      <span className="font-mono font-bold">
                        {b.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Providers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">
                  {t("features.ai.gateway.reports.providers", {
                    defaultValue: "بر اساس ارائه‌دهنده",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال بارگذاری...
                  </p>
                ) : (
                  providersReport.slice(0, 5).map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate font-mono">{b.key || "-"}</span>
                      <span className="font-mono font-bold">
                        {b.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Daily */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">
                  {t("features.ai.gateway.reports.daily", {
                    defaultValue: "روند روزانه",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال بارگذاری...
                  </p>
                ) : (
                  dailyReport.slice(0, 5).map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span
                        className="text-muted-foreground font-mono"
                        dir="ltr"
                      >
                        {b.key}
                      </span>
                      <span className="font-mono font-bold">
                        {b.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
