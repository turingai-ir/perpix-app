import { useMemo } from "react";
import { Link } from "react-router";
import { ShieldAlert, RotateCcw, User, Activity } from "lucide-react";
import {
  useAuditEventsList,
  type AuditRowItem,
} from "../../hooks/use-audit-events-list";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import type { AdminSort } from "../../model/types";

export function AuditEventsListPage() {
  const { t } = useAppTranslate();

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
    resetFilters,
  } = useTableQuery({
    defaultLimit: 10,
    defaultSort: "-created_at",
  });

  const { events, totalCount, isLoading, error, refetch } = useAuditEventsList({
    page,
    limit,
    sort: (sort as AdminSort) || "-created_at",
    action: search || (filters.action as string) || undefined,
    userUuid: (filters.user_uuid as string) || undefined,
    actorUuid: (filters.actor_uuid as string) || undefined,
  });

  const renderActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (
      act.includes("BAN") ||
      act.includes("DELETE") ||
      act.includes("REVOKE")
    ) {
      return (
        <Badge variant="destructive" className="font-mono text-xs">
          {action}
        </Badge>
      );
    }
    if (act.includes("CREATE") || act.includes("ADD")) {
      return (
        <Badge
          variant="default"
          className="bg-emerald-600 font-mono text-xs text-white"
        >
          {action}
        </Badge>
      );
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500 font-mono text-xs text-white"
        >
          {action}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-mono text-xs">
        {action}
      </Badge>
    );
  };

  const columns: DataTableColumn<AuditRowItem>[] = useMemo(
    () => [
      {
        id: "action",
        header: t("features.security.audit.action", {
          defaultValue: "نوع عملیات",
        }),
        cell: (item) => (
          <div className="flex items-center gap-2">
            <Activity className="text-primary size-4" />
            {renderActionBadge(item.action)}
          </div>
        ),
      },
      {
        id: "actor_uuid",
        header: t("features.security.audit.actor", {
          defaultValue: "مجری عملیات (Actor)",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.actor_uuid}`}
            className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-mono text-xs font-semibold hover:underline"
          >
            <User className="text-muted-foreground size-3.5" />
            {item.actor_uuid.slice(0, 8)}...
          </Link>
        ),
      },
      {
        id: "user_uuid",
        header: t("features.security.audit.targetUser", {
          defaultValue: "کاربر هدف",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.user_uuid}`}
            className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-mono text-xs font-semibold hover:underline"
          >
            <User className="text-muted-foreground size-3.5" />
            {item.user_uuid.slice(0, 8)}...
          </Link>
        ),
      },
      {
        id: "resource_uuid",
        header: t("features.security.audit.resourceUuid", {
          defaultValue: "شناسه منبع",
        }),
        cell: (item) => (
          <span className="text-muted-foreground font-mono text-xs">
            {item.resource_uuid ? `${item.resource_uuid.slice(0, 8)}...` : "—"}
          </span>
        ),
      },
      {
        id: "reason",
        header: t("features.security.audit.reason", {
          defaultValue: "توضیحات / دلیل",
        }),
        cell: (item) => (
          <span
            className="text-foreground block max-w-sm truncate text-xs"
            title={item.reason || ""}
          >
            {item.reason || "—"}
          </span>
        ),
      },
      {
        id: "created_at",
        header: t("features.security.audit.createdAt", {
          defaultValue: "تاریخ و زمان",
        }),
        cell: (item) => (
          <span className="text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
    ],
    [t],
  );

  const hasActiveFilters = Boolean(
    search ||
    filters.action ||
    filters.user_uuid ||
    filters.actor_uuid ||
    sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <ShieldAlert aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.security.menuTitle", { defaultValue: "امنیت" })}
          </span>
          <span>/</span>
          <span>
            {t("features.security.audit.menuTitle", {
              defaultValue: "رویدادهای امنیتی",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.security.audit.pageTitle", {
                defaultValue: "رویدادهای امنیتی و ممیزی (Audit Log)",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.security.audit.pageDesc", {
                defaultValue:
                  "ثبت دقیق کلیه اقدامات حساس، تغییرات وضعیت کاربران و نشست‌ها برای پیگیری‌های نظارتی",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search || ""}
            onChange={setSearch}
            placeholder={t("features.security.audit.searchPlaceholder", {
              defaultValue: "جستجو در نوع عملیات...",
            })}
          />
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

      {/* Events Table */}
      <DataTable<AuditRowItem>
        keyExtractor={(item) => item.uuid}
        data={events ? Array.from(events) : []}
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
        emptyMessage={t("features.security.audit.empty", {
          defaultValue: "رویدادی یافت نشد.",
        })}
      />
    </div>
  );
}
