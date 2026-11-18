import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Bot,
  ExternalLink,
  RotateCcw,
  BarChart3,
  ListFilter,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
} from "lucide-react";
import {
  useAiTasksList,
  type AiTasksRowItem,
} from "../../hooks/use-ai-tasks-list";
import { useAiTaskReports } from "../../hooks/use-ai-task-reports";
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
import { cn } from "@/lib/utils";
import type { AdminSort, AiTaskTypeEnum } from "../../model/types";

export function AiTasksListPage() {
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

  const { tasks, totalCount, isLoading, error, refetch } = useAiTasksList({
    page,
    limit,
    sort: (sort as AdminSort) || "-created_at",
    search,
    userUuid: (filters.user_uuid as string) || undefined,
    taskType: (filters.task_type as AiTaskTypeEnum | "ALL") || "ALL",
  });

  const {
    dailyReport,
    typesReport,
    isLoading: isReportsLoading,
  } = useAiTaskReports({
    userUuid: (filters.user_uuid as string) || undefined,
  });

  const renderTaskTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "TEXT":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <FileText className="size-3" />
            متن (Text)
          </Badge>
        );
      case "IMAGE":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
          >
            <ImageIcon className="size-3" />
            تصویر (Image)
          </Badge>
        );
      case "AUDIO":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Music className="size-3" />
            صدا (Audio)
          </Badge>
        );
      case "VIDEO":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          >
            <Video className="size-3" />
            ویدیو (Video)
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type || "سایر"}</Badge>;
    }
  };

  const columns: DataTableColumn<AiTasksRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.ai.tasks.columns.uuid", {
          defaultValue: "شناسه وظیفه",
        }),
        cell: (item) => (
          <div className="space-y-0.5">
            <Link
              to={`/ai/tasks/${item.uuid}`}
              className="text-primary font-mono text-xs font-semibold hover:underline"
            >
              {item.uuid}
            </Link>
          </div>
        ),
      },
      {
        id: "task_type",
        header: t("features.ai.tasks.columns.type", {
          defaultValue: "نوع وظیفه",
        }),
        cell: (item) => renderTaskTypeBadge(item.task_type),
      },
      {
        id: "user_uuid",
        header: t("features.ai.tasks.columns.user", {
          defaultValue: "کاربر",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.user_uuid}`}
            className="text-muted-foreground hover:text-foreground font-mono text-xs"
          >
            {item.user_uuid.slice(0, 8)}...
          </Link>
        ),
      },
      {
        id: "created_at",
        header: t("features.ai.tasks.columns.createdAt", {
          defaultValue: "تاریخ ثبت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "updated_at",
        header: t("features.ai.tasks.columns.updatedAt", {
          defaultValue: "آخرین بروزرسانی",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.updated_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex justify-end">
            <Link
              to={`/ai/tasks/${item.uuid}`}
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
    (filters.task_type && filters.task_type !== "ALL") ||
    sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Bot aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.ai.tasks.menuTitle", {
              defaultValue: "وظایف هوش مصنوعی",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.ai.tasks.pageTitle", {
                defaultValue: "مدیریت وظایف هوش مصنوعی",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.ai.tasks.pageDesc", {
                defaultValue:
                  "مشاهده و بررسی صف وظایف پردازشی کاربران، پیام‌ها و گزارش‌های روزانه",
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
          {t("features.ai.tasks.tabs.list", { defaultValue: "لیست وظایف" })}
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
          className="cursor-pointer gap-2"
        >
          <BarChart3 className="size-4" />
          {t("features.ai.tasks.tabs.reports", {
            defaultValue: "گزارش‌های آماری",
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
                placeholder={t("features.ai.tasks.searchPlaceholder", {
                  defaultValue: "جستجو در وظایف...",
                })}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={(filters.task_type as string) || "ALL"}
                onChange={(e) => setFilter("task_type", e.target.value)}
              >
                <option value="ALL">
                  {t("features.ai.tasks.types.all", {
                    defaultValue: "همه انواع وظایف",
                  })}
                </option>
                <option value="TEXT">متن (TEXT)</option>
                <option value="IMAGE">تصویر (IMAGE)</option>
                <option value="AUDIO">صدا (AUDIO)</option>
                <option value="VIDEO">ویدیو (VIDEO)</option>
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

          {/* Tasks Table */}
          <DataTable<AiTasksRowItem>
            keyExtractor={(item) => item.uuid}
            data={tasks ? Array.from(tasks) : []}
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
            emptyMessage={t("features.ai.tasks.empty", {
              defaultValue: "وظیفه‌ای مطابق با این فیلترها یافت نشد.",
            })}
          />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Types Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  {t("features.ai.tasks.reports.typesTitle", {
                    defaultValue: "توزیع وظایف بر اساس نوع محتوا",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isReportsLoading ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    در حال دریافت آمار...
                  </div>
                ) : typesReport.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    داده‌ای برای نمایش موجود نیست.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {typesReport.map(
                      (b: { key?: string; count: number }, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            {renderTaskTypeBadge(b.key || "")}
                          </div>
                          <span className="font-mono text-sm font-bold">
                            {b.count.toLocaleString("fa-IR")} مورد
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  {t("features.ai.tasks.reports.dailyTitle", {
                    defaultValue: "روند روزانه ثبت وظایف",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isReportsLoading ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    در حال دریافت آمار...
                  </div>
                ) : dailyReport.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    داده‌ای برای نمایش موجود نیست.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dailyReport
                      .slice(0, 10)
                      .map(
                        (b: { key?: string; count: number }, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border p-2.5 text-xs"
                          >
                            <span
                              className="text-muted-foreground font-mono"
                              dir="ltr"
                            >
                              {b.key}
                            </span>
                            <span className="font-bold">
                              {b.count.toLocaleString("fa-IR")} وظیفه
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
