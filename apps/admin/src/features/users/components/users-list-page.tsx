import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { useUsersList, type UsersRowItem } from "../hooks/use-users-list";
import { useUsersReports } from "../hooks/use-users-reports";
import { ReportBucketList } from "@/components/custom/report-bucket-list";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import type { UserRole, AdminSort } from "../model/types";

const formatDate = (isoString: string) => {
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

export function UsersListPage() {
  const { t } = useAppTranslate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const reports = useUsersReports();

  const {
    page,
    limit,
    offset,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery<{
    role?: UserRole;
    is_active?: boolean;
    is_verified?: boolean;
  }>({
    defaultLimit: 20,
    defaultSort: "-created_at",
  });

  const queryParams = useMemo(
    () => ({
      offset,
      limit,
      sort: sort as AdminSort,
      search: search || undefined,
      role: filters.role,
      is_active: filters.is_active,
      is_verified: filters.is_verified,
    }),
    [offset, limit, sort, search, filters],
  );

  const { data, isPending, isError, error, refetch } =
    useUsersList(queryParams);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasActiveFilters = Boolean(
    search ||
    filters.role ||
    filters.is_active !== undefined ||
    filters.is_verified !== undefined ||
    sort !== "-created_at",
  );

  const columns: DataTableColumn<UsersRowItem>[] = useMemo(
    () => [
      {
        id: "name_phone",
        header: t("features.users.columns.user", { defaultValue: "کاربر" }),
        cell: (user) => (
          <div className="flex min-w-[160px] flex-col gap-1">
            <span className="text-foreground font-semibold">
              {user.name ||
                t("common.emptyTitle", { defaultValue: "بدون نام" })}
            </span>
            <span
              dir="ltr"
              className="text-muted-foreground text-right font-mono text-xs"
            >
              {user.phone_number}
            </span>
            {user.email && (
              <span
                dir="ltr"
                className="text-muted-foreground/80 max-w-[200px] truncate text-right text-[11px]"
              >
                {user.email}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "user_uuid",
        header: t("features.users.columns.uuid", {
          defaultValue: "شناسه کاربری",
        }),
        cell: (user) => {
          const isCopied = copiedId === user.user_uuid;
          return (
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <span title={user.user_uuid}>
                {user.user_uuid.slice(0, 8)}…{user.user_uuid.slice(-4)}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(user.user_uuid)}
                aria-label="کپی شناسه"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        id: "role_scopes",
        header: t("features.users.columns.role", {
          defaultValue: "نقش / دسترسی‌ها",
        }),
        cell: (user) => {
          const scopes = user.scopes
            ? Array.from(user.scopes as unknown as ArrayLike<string>)
            : [];
          const isSuperadmin = scopes.includes("superadmin");
          const isAdmin = scopes.includes("admin") || isSuperadmin;

          return (
            <div className="flex flex-wrap items-center gap-1">
              {isSuperadmin ? (
                <Badge
                  variant="default"
                  className="gap-1 bg-amber-600 text-white hover:bg-amber-600"
                >
                  <ShieldAlert className="size-3" />
                  {t("features.users.roles.superadmin", {
                    defaultValue: "مدیر ارشد",
                  })}
                </Badge>
              ) : isAdmin ? (
                <Badge variant="default" className="gap-1">
                  <ShieldCheck className="size-3" />
                  {t("features.users.roles.admin", { defaultValue: "مدیر" })}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {t("features.users.roles.user", {
                    defaultValue: "کاربر عادی",
                  })}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "status",
        header: t("features.users.columns.status", {
          defaultValue: "وضعیت حساب",
        }),
        cell: (user) =>
          user.is_active ? (
            <Badge variant="success" className="gap-1">
              <UserCheck className="size-3" />
              {t("features.users.statuses.active", { defaultValue: "فعال" })}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <UserX className="size-3" />
              {t("features.users.statuses.banned", { defaultValue: "مسدود" })}
            </Badge>
          ),
      },
      {
        id: "verification",
        header: t("features.users.columns.verified", {
          defaultValue: "تأیید شماره",
        }),
        cell: (user) =>
          user.is_verified ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-600"
            >
              {t("features.users.verified.yes", { defaultValue: "تأیید شده" })}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground border-border"
            >
              {t("features.users.verified.no", { defaultValue: "تأیید نشده" })}
            </Badge>
          ),
      },
      {
        id: "created_at",
        header: t("features.users.columns.createdAt", {
          defaultValue: "تاریخ عضویت",
        }),
        cell: (user) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(user.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("features.users.columns.actions", { defaultValue: "عملیات" }),
        className: "text-left",
        headerClassName: "text-left",
        cell: (user) => (
          <Link
            to={`/users/${user.user_uuid}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs",
            )}
          >
            <Eye className="size-3.5" />
            {t("features.users.actions.viewDetail", { defaultValue: "جزئیات" })}
          </Link>
        ),
      },
    ],
    [copiedId, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
            <Users aria-hidden="true" className="size-4" />
            <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {t("features.users.title", { defaultValue: "کاربران" })}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("features.users.title", { defaultValue: "مدیریت کاربران" })}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("features.users.description", {
              defaultValue:
                "مشاهده، جست‌وجو و مدیریت حساب‌های کاربری و دسترسی‌ها",
            })}
          </p>
        </div>
        <Button
          variant={showStats ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          aria-expanded={showStats}
          onClick={() => setShowStats((v) => !v)}
        >
          <BarChart3 className="size-4" />
          {t("features.users.stats", { defaultValue: "آمار کاربران" })}
        </Button>
      </div>

      {showStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <ReportBucketList
            title="ثبت‌نام روزانه"
            buckets={reports.daily}
            isLoading={reports.isLoading}
            unit="کاربر"
            maxItems={14}
          />
          <ReportBucketList
            title="وضعیت حساب"
            buckets={reports.statuses}
            isLoading={reports.isLoading}
            labelFor={(key) =>
              key === "active" ? "فعال" : key === "banned" ? "مسدود" : key
            }
          />
          <ReportBucketList
            title="وضعیت تأیید"
            buckets={reports.verification}
            isLoading={reports.isLoading}
            labelFor={(key) =>
              key === "verified"
                ? "تأیید شده"
                : key === "unverified"
                  ? "تأیید نشده"
                  : key
            }
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("features.users.filters.searchPlaceholder", {
                defaultValue: "جستجو با نام، شماره همراه یا شناسه...",
              })}
            />
          </div>

          {/* Role Filter */}
          <div>
            <Select
              value={filters.role || "all"}
              onChange={(e) => setFilter("role", e.target.value)}
              aria-label="فیلتر نقش"
            >
              <option value="all">
                {t("features.users.filters.allRoles", {
                  defaultValue: "همه نقش‌ها",
                })}
              </option>
              <option value="user">
                {t("features.users.roles.user", { defaultValue: "کاربر عادی" })}
              </option>
              <option value="admin">
                {t("features.users.roles.admin", { defaultValue: "مدیر" })}
              </option>
              <option value="superadmin">
                {t("features.users.roles.superadmin", {
                  defaultValue: "مدیر ارشد",
                })}
              </option>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={
                filters.is_active === undefined
                  ? "all"
                  : String(filters.is_active)
              }
              onChange={(e) => setFilter("is_active", e.target.value)}
              aria-label="فیلتر وضعیت"
            >
              <option value="all">
                {t("features.users.filters.allStatuses", {
                  defaultValue: "همه وضعیت‌ها",
                })}
              </option>
              <option value="true">
                {t("features.users.statuses.active", { defaultValue: "فعال" })}
              </option>
              <option value="false">
                {t("features.users.statuses.banned", { defaultValue: "مسدود" })}
              </option>
            </Select>
          </div>

          {/* Sort Filter */}
          <div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              <option value="-created_at">
                {t("features.users.filters.sortNewest", {
                  defaultValue: "جدیدترین ابتدا",
                })}
              </option>
              <option value="created_at">
                {t("features.users.filters.sortOldest", {
                  defaultValue: "قدیمی‌ترین ابتدا",
                })}
              </option>
            </Select>
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {hasActiveFilters && (
          <div className="border-border/60 flex items-center justify-between border-t pt-2.5 text-xs">
            <span className="text-muted-foreground">
              {t("features.users.filters.activeFiltersApplied", {
                defaultValue: "فیلترها اعمال شده‌اند",
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
            >
              <RotateCcw className="size-3" />
              {t("features.users.filters.reset", {
                defaultValue: "پاک کردن همه فیلترها",
              })}
            </Button>
          </div>
        )}
      </div>

      {/* Users Data Table */}
      <DataTable
        columns={columns}
        data={data?.items ? Array.from(data.items) : undefined}
        isLoading={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
        keyExtractor={(user) => user.user_uuid}
        pagination={{
          page,
          limit,
          totalCount: data?.total_count ?? 0,
          hasNext: data?.has_next,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
