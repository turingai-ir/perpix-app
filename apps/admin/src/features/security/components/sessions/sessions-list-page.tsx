import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Shield,
  LogOut,
  RotateCcw,
  BarChart3,
  ListFilter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react";
import {
  useSessionsList,
  type SessionsRowItem,
} from "../../hooks/use-sessions-list";
import { useSessionsReports } from "../../hooks/use-sessions-reports";
import { useSecurityActions } from "../../hooks/use-security-actions";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import type { AdminSort, SecurityStatusEnum } from "../../model/types";

export function SessionsListPage() {
  const { t } = useAppTranslate();
  const [activeTab, setActiveTab] = useState<"list" | "reports">("list");

  // Revoke dialog state
  const [sessionToRevoke, setSessionToRevoke] =
    useState<SessionsRowItem | null>(null);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

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

  const { sessions, totalCount, isLoading, error, refetch } = useSessionsList({
    page,
    limit,
    sort: (sort as AdminSort) || "-created_at",
    userUuid: search || (filters.user_uuid as string) || undefined,
    status: (filters.status as SecurityStatusEnum | "all") || "all",
  });

  const { reports, isLoading: isReportsLoading } = useSessionsReports({
    userUuid: (filters.user_uuid as string) || undefined,
    status: (filters.status as SecurityStatusEnum | "all") || "all",
  });

  const { revokeSession, isRevokingSession } = useSecurityActions();

  const handleRevokeClick = useCallback((session: SessionsRowItem) => {
    setSessionToRevoke(session);
    setIsRevokeOpen(true);
  }, []);

  const handleConfirmRevoke = async () => {
    if (!sessionToRevoke) return;
    try {
      await revokeSession(sessionToRevoke.user_uuid, sessionToRevoke.uuid);
      setIsRevokeOpen(false);
      setSessionToRevoke(null);
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="gap-1 bg-emerald-600 text-white">
            <CheckCircle2 className="size-3" />
            فعال
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="size-3" />
            لغو شده
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" />
            منقضی شده
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: DataTableColumn<SessionsRowItem>[] = useMemo(
    () => [
      {
        id: "user_uuid",
        header: t("features.security.sessions.user", { defaultValue: "کاربر" }),
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
        id: "uuid",
        header: t("features.security.sessions.uuid", {
          defaultValue: "شناسه نشست",
        }),
        cell: (item) => (
          <span className="text-muted-foreground font-mono text-xs">
            {item.uuid.slice(0, 12)}...
          </span>
        ),
      },
      {
        id: "status",
        header: t("features.security.sessions.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) => renderStatusBadge(item.status),
      },
      {
        id: "created_at",
        header: t("features.security.sessions.createdAt", {
          defaultValue: "تاریخ شروع",
        }),
        cell: (item) => (
          <span className="text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "expires_at",
        header: t("features.security.sessions.expiresAt", {
          defaultValue: "زمان انقضا",
        }),
        cell: (item) => (
          <span className="text-xs" dir="ltr">
            {new Date(item.expires_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "revoked_at",
        header: t("features.security.sessions.revokedAt", {
          defaultValue: "زمان لغو",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {item.revoked_at
              ? new Date(item.revoked_at).toLocaleString("fa-IR")
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              disabled={item.status.toLowerCase() !== "active"}
              onClick={() => handleRevokeClick(item)}
              className="h-7 gap-1 text-xs"
            >
              <LogOut className="size-3" />
              {t("features.security.sessions.revoke", {
                defaultValue: "لغو نشست",
              })}
            </Button>
          </div>
        ),
      },
    ],
    [handleRevokeClick, t],
  );

  const hasActiveFilters = Boolean(
    search ||
    filters.user_uuid ||
    (filters.status && filters.status !== "all") ||
    sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Shield aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.security.menuTitle", { defaultValue: "امنیت" })}
          </span>
          <span>/</span>
          <span>
            {t("features.security.sessions.menuTitle", {
              defaultValue: "نشست‌ها",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.security.sessions.pageTitle", {
                defaultValue: "مدیریت نشست‌های کاربران",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.security.sessions.pageDesc", {
                defaultValue:
                  "مشاهده کلیه نشست‌های فعال، منقضی یا لغو شده و قابلیت پایان دادن اجباری به نشست",
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
          {t("features.security.sessions.tabs.list", {
            defaultValue: "لیست نشست‌ها",
          })}
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
          className="cursor-pointer gap-2"
        >
          <BarChart3 className="size-4" />
          {t("features.security.sessions.tabs.reports", {
            defaultValue: "گزارش نشست‌ها",
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
                placeholder={t("features.security.sessions.searchPlaceholder", {
                  defaultValue: "شناسه کاربر (User UUID)...",
                })}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={(filters.status as string) || "all"}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                <option value="all">
                  {t("features.security.status.all", {
                    defaultValue: "همه وضعیت‌ها",
                  })}
                </option>
                <option value="active">فعال (Active)</option>
                <option value="revoked">لغو شده (Revoked)</option>
                <option value="expired">منقضی شده (Expired)</option>
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

          {/* Sessions Table */}
          <DataTable<SessionsRowItem>
            keyExtractor={(item) => item.uuid}
            data={sessions ? Array.from(sessions) : []}
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
            emptyMessage={t("features.security.sessions.empty", {
              defaultValue: "نشستی یافت نشد.",
            })}
          />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">
                {t("features.security.sessions.reports.dailyTitle", {
                  defaultValue: "آمار و روند ثبت نشست‌ها",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isReportsLoading ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  در حال دریافت گزارش...
                </div>
              ) : reports.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  داده‌ای برای نمایش موجود نیست.
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.slice(0, 15).map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border p-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground size-4" />
                        <span className="font-mono" dir="ltr">
                          {b.key}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold">
                        {b.count.toLocaleString("fa-IR")} نشست
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revoke Session Dialog */}
      <ConfirmDialog
        open={isRevokeOpen}
        onOpenChange={setIsRevokeOpen}
        title={t("features.security.sessions.revokeConfirmTitle", {
          defaultValue: "تأیید لغو نشست کاربر",
        })}
        description={
          sessionToRevoke
            ? `آیا از ابطال و لغو این نشست برای کاربر "${sessionToRevoke.user_uuid.slice(0, 8)}..." اطمینان دارید؟ کاربر بلافاصله از سیستم خارج خواهد شد.`
            : ""
        }
        confirmText={t("features.security.sessions.revoke", {
          defaultValue: "لغو نشست",
        })}
        cancelText={t("common.cancel", { defaultValue: "انصراف" })}
        variant="destructive"
        isLoading={isRevokingSession}
        onConfirm={() => void handleConfirmRevoke()}
      />
    </div>
  );
}
