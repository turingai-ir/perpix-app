import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  PlusCircle,
  Ban,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  useSubscriptionsList,
  type SubscriptionsRowItem,
} from "../hooks/use-subscriptions-list";
import { usePlansList } from "../hooks/use-plans-list";
import { useSubscriptionActions } from "../hooks/use-subscription-actions";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import type { AdminSort, SubscriptionStatus } from "../model/types";

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

export function SubscriptionsListPage() {
  const { t } = useAppTranslate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual activate subscription modal state
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [activateUserUuid, setActivateUserUuid] = useState("");
  const [activatePlanUuid, setActivatePlanUuid] = useState("");

  // Deactivate confirm state
  const [deactivatingSub, setDeactivatingSub] =
    useState<SubscriptionsRowItem | null>(null);

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
    status?: SubscriptionStatus;
    plan_uuid?: string;
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
      search: search || undefined,
      status: filters.status,
      plan_uuid: filters.plan_uuid,
      user_uuid: filters.user_uuid,
    }),
    [offset, limit, sort, search, filters],
  );

  const { data, isPending, isError, error, refetch } =
    useSubscriptionsList(queryParams);
  const { data: plansData } = usePlansList({ limit: 100, is_active: true });

  const {
    activateSubscription,
    deactivateSubscription,
    isActivating,
    isDeactivating,
  } = useSubscriptionActions();

  const handleCopy = (id: string) => {
    void navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasActiveFilters = Boolean(
    search ||
    filters.status ||
    filters.plan_uuid ||
    filters.user_uuid ||
    sort !== "-created_at",
  );

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activateUserUuid.trim() || !activatePlanUuid.trim()) return;

    try {
      await activateSubscription({
        user_uuid: activateUserUuid.trim(),
        plan_uuid: activatePlanUuid.trim(),
      });
      setIsActivateOpen(false);
      setActivateUserUuid("");
      setActivatePlanUuid("");
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivatingSub) return;
    try {
      await deactivateSubscription({
        user_uuid: deactivatingSub.user_uuid,
      });
      setDeactivatingSub(null);
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const renderStatusBadge = useCallback(
    (status: string) => {
      switch (status) {
        case "active":
          return (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              {t("features.subscriptions.statusLabels.active", {
                defaultValue: "فعال",
              })}
            </Badge>
          );
        case "expired":
          return (
            <Badge variant="muted" className="gap-1">
              <Clock className="size-3" />
              {t("features.subscriptions.statusLabels.expired", {
                defaultValue: "منقضی شده",
              })}
            </Badge>
          );
        case "scheduled":
          return (
            <Badge variant="warning" className="gap-1">
              <Calendar className="size-3" />
              {t("features.subscriptions.statusLabels.scheduled", {
                defaultValue: "زمان‌بندی‌شده",
              })}
            </Badge>
          );
        case "replaced":
          return (
            <Badge variant="outline" className="gap-1">
              <RotateCcw className="size-3" />
              {t("features.subscriptions.statusLabels.replaced", {
                defaultValue: "جایگزین‌شده",
              })}
            </Badge>
          );
        default:
          return (
            <Badge variant="outline">
              {t(`features.subscriptions.statusLabels.${status}`, {
                defaultValue: status,
              })}
            </Badge>
          );
      }
    },
    [t],
  );

  const columns: DataTableColumn<SubscriptionsRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.subscriptions.columns.id", {
          defaultValue: "شناسه اشتراک",
        }),
        cell: (item) => {
          const isCopied = copiedId === item.uuid;
          return (
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <span title={item.uuid}>
                {item.uuid.slice(0, 8)}…{item.uuid.slice(-4)}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(item.uuid)}
                aria-label="کپی شناسه"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
              >
                {isCopied ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        id: "user",
        header: t("features.subscriptions.columns.user", {
          defaultValue: "کاربر",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.user_uuid}`}
            className="text-primary font-mono text-xs hover:underline"
            title={item.user_uuid}
          >
            {item.user_uuid.slice(0, 8)}…{item.user_uuid.slice(-4)}
          </Link>
        ),
      },
      {
        id: "plan",
        header: t("features.subscriptions.columns.plan", {
          defaultValue: "پلن اشتراکی",
        }),
        cell: (item) => (
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-semibold">
              {item.plan_name || "بدون نام"}
            </span>
            <span className="text-muted-foreground font-mono text-[10px]">
              {item.plan_uuid.slice(0, 8)}…
            </span>
          </div>
        ),
      },
      {
        id: "status",
        header: t("features.subscriptions.columns.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) => renderStatusBadge(item.status),
      },
      {
        id: "started_at",
        header: t("features.subscriptions.columns.startedAt", {
          defaultValue: "تاریخ شروع",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(item.started_at)}
          </span>
        ),
      },
      {
        id: "expires_at",
        header: t("features.subscriptions.columns.expiresAt", {
          defaultValue: "تاریخ انقضا",
        }),
        cell: (item) => {
          const isExpired = item.expires_at
            ? new Date(item.expires_at).getTime() < Date.now()
            : false;
          return (
            <span
              className={cn(
                "text-xs whitespace-nowrap",
                isExpired
                  ? "text-destructive font-medium"
                  : "text-muted-foreground",
              )}
            >
              {formatDate(item.expires_at)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: t("common.actions", { defaultValue: "عملیات" }),
        className: "text-center",
        cell: (item) => (
          <div className="flex items-center justify-center gap-1.5">
            <Link
              to={`/subscriptions/${item.uuid}`}
              aria-label="مشاهده جزئیات"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 gap-1.5 px-2.5 text-xs",
              )}
            >
              <Eye className="size-3.5" />
              {t("common.details", { defaultValue: "جزئیات" })}
            </Link>

            {item.status === "active" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeactivatingSub(item)}
                aria-label="غیرفعال‌سازی اشتراک"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 cursor-pointer gap-1.5 px-2.5 text-xs"
              >
                <Ban className="size-3.5" />
                {t("features.subscriptions.actions.deactivate", {
                  defaultValue: "غیرفعال‌سازی",
                })}
              </Button>
            )}
          </div>
        ),
      },
    ],
    [copiedId, renderStatusBadge, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Sparkles aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.subscriptions.menuTitle", {
              defaultValue: "اشتراک‌ها",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("features.subscriptions.title", {
                defaultValue: "مدیریت اشتراک کاربران",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("features.subscriptions.description", {
                defaultValue:
                  "مشاهده، فعال‌سازی، بررسی وضعیت و تاریخ انقضای اشتراک‌های کاربران",
              })}
            </p>
          </div>

          <Button
            onClick={() => setIsActivateOpen(true)}
            className="cursor-pointer gap-2 shadow-xs"
          >
            <PlusCircle className="size-4" />
            {t("features.subscriptions.actions.activateNew", {
              defaultValue: "فعال‌سازی اشتراک کاربر",
            })}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t(
                "features.subscriptions.filters.searchPlaceholder",
                {
                  defaultValue: "جستجو با شناسه اشتراک یا کاربر...",
                },
              )}
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={filters.status || "all"}
              onChange={(e) =>
                setFilter(
                  "status",
                  e.target.value === "all" ? undefined : e.target.value,
                )
              }
              aria-label="فیلتر وضعیت اشتراک"
            >
              <option value="all">
                {t("features.subscriptions.filters.allStatuses", {
                  defaultValue: "همه وضعیت‌ها",
                })}
              </option>
              <option value="active">
                {t("features.subscriptions.statusLabels.active", {
                  defaultValue: "فعال",
                })}
              </option>
              <option value="expired">
                {t("features.subscriptions.statusLabels.expired", {
                  defaultValue: "منقضی شده",
                })}
              </option>
              <option value="scheduled">
                {t("features.subscriptions.statusLabels.scheduled", {
                  defaultValue: "زمان‌بندی‌شده",
                })}
              </option>
              <option value="replaced">
                {t("features.subscriptions.statusLabels.replaced", {
                  defaultValue: "جایگزین‌شده",
                })}
              </option>
            </Select>
          </div>

          {/* Plan Filter */}
          <div>
            <Select
              value={filters.plan_uuid || "all"}
              onChange={(e) =>
                setFilter(
                  "plan_uuid",
                  e.target.value === "all" ? undefined : e.target.value,
                )
              }
              aria-label="فیلتر پلن"
            >
              <option value="all">
                {t("features.subscriptions.filters.allPlans", {
                  defaultValue: "همه پلن‌ها",
                })}
              </option>
              {plansData?.items &&
                Array.from(plansData.items).map((plan) => (
                  <option key={plan.uuid} value={plan.uuid}>
                    {plan.display_name || plan.name}
                  </option>
                ))}
            </Select>
          </div>

          {/* Sort Filter */}
          <div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              <option value="-created_at">جدیدترین ابتدا</option>
              <option value="created_at">قدیمی‌ترین ابتدا</option>
            </Select>
          </div>
        </div>

        {/* Active Filters and Reset */}
        {hasActiveFilters && (
          <div className="border-border flex items-center justify-between border-t pt-3">
            <span className="text-muted-foreground text-xs">
              {t("features.subscriptions.filters.activeFiltersApplied", {
                defaultValue: "فیلترها اعمال شده‌اند",
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground h-8 cursor-pointer gap-1.5 text-xs"
            >
              <RotateCcw className="size-3.5" />
              {t("features.subscriptions.filters.reset", {
                defaultValue: "پاک کردن همه فیلترها",
              })}
            </Button>
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      <DataTable
        columns={columns}
        data={data?.items ? Array.from(data.items) : undefined}
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
          totalCount: data?.total_count ?? 0,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />

      {/* Manual Activate Subscription Modal */}
      <Dialog open={isActivateOpen} onOpenChange={setIsActivateOpen}>
        <DialogPopup>
          <form onSubmit={handleActivateSubmit}>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary size-5" />
                <DialogTitle>
                  {t("features.subscriptions.activateModal.title", {
                    defaultValue: "فعال‌سازی دستی اشتراک",
                  })}
                </DialogTitle>
              </div>
              <DialogDescription>
                {t("features.subscriptions.activateModal.description", {
                  defaultValue:
                    "شناسه کاربر و پلن اشتراکی مورد نظر را جهت فعال‌سازی فوری وارد کنید.",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="activate-user-uuid"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.activateModal.userUuidLabel", {
                    defaultValue: "شناسه کاربری (User UUID):",
                  })}
                </label>
                <Input
                  id="activate-user-uuid"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={activateUserUuid}
                  onChange={(e) => setActivateUserUuid(e.target.value)}
                  dir="ltr"
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="activate-plan-uuid"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.activateModal.planLabel", {
                    defaultValue: "انتخاب پلن اشتراکی:",
                  })}
                </label>
                <Select
                  id="activate-plan-uuid"
                  value={activatePlanUuid}
                  onChange={(e) => setActivatePlanUuid(e.target.value)}
                  required
                >
                  <option value="">
                    {t("features.subscriptions.activateModal.selectPlan", {
                      defaultValue: "یک پلن را انتخاب کنید...",
                    })}
                  </option>
                  {plansData?.items &&
                    Array.from(plansData.items).map((plan) => (
                      <option key={plan.uuid} value={plan.uuid}>
                        {plan.display_name || plan.name} ({plan.duration_days}{" "}
                        روز)
                      </option>
                    ))}
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsActivateOpen(false)}
                disabled={isActivating}
                className="cursor-pointer"
              >
                {t("common.cancel", { defaultValue: "انصراف" })}
              </Button>
              <Button
                type="submit"
                disabled={
                  isActivating ||
                  !activateUserUuid.trim() ||
                  !activatePlanUuid.trim()
                }
                className="cursor-pointer gap-2"
              >
                {isActivating && <Loader2 className="size-4 animate-spin" />}
                {t("features.subscriptions.activateModal.submit", {
                  defaultValue: "فعال‌سازی اشتراک",
                })}
              </Button>
            </DialogFooter>
          </form>
        </DialogPopup>
      </Dialog>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(deactivatingSub)}
        onOpenChange={(isOpen) => !isOpen && setDeactivatingSub(null)}
        title={t("features.subscriptions.dialogs.deactivateTitle", {
          defaultValue: "غیرفعال‌سازی اشتراک کاربر",
        })}
        description={t("features.subscriptions.dialogs.deactivateDescription", {
          defaultValue:
            "با غیرفعال‌سازی، دسترسی کاربر به امکانات و مدل‌های این پلن قطع خواهد شد. آیا از این عملیات اطمینان دارید؟",
        })}
        confirmText={t("features.subscriptions.dialogs.deactivateConfirm", {
          defaultValue: "غیرفعال‌سازی اشتراک",
        })}
        variant="destructive"
        isLoading={isDeactivating}
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  );
}
