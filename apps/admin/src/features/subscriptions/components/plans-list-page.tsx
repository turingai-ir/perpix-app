import { useCallback, useMemo, useState } from "react";
import {
  Package,
  PlusCircle,
  Edit,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Star,
  Check,
} from "lucide-react";
import { usePlansList, type PlansRowItem } from "../hooks/use-plans-list";
import { useSubscriptionActions } from "../hooks/use-subscription-actions";
import { PlanFormDialog } from "./plan-form-dialog";
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
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import type { AdminSort } from "../model/types";
import {
  hasStudioScopes,
  readCaptionPresetLimit,
} from "../model/plan-settings";

const faNumber = (val: number) => new Intl.NumberFormat("fa-IR").format(val);

export function PlansListPage() {
  const { t } = useAppTranslate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlansRowItem | null>(null);

  const {
    page,
    limit,
    offset,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery<{
    is_active?: boolean;
    is_default?: boolean;
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
      is_active: filters.is_active,
      is_default: filters.is_default,
    }),
    [offset, limit, sort, search, filters],
  );

  const { data, isPending, isError, error, refetch } =
    usePlansList(queryParams);
  const { updatePlan, isUpdatingPlan } = useSubscriptionActions();

  const hasActiveFilters = Boolean(
    search ||
    filters.is_active !== undefined ||
    filters.is_default !== undefined ||
    sort !== "-created_at",
  );

  const handleCreateClick = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (plan: PlansRowItem) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleToggleActive = useCallback(
    async (plan: PlansRowItem) => {
      try {
        await updatePlan({
          planUuid: plan.uuid,
          body: {
            is_active: !plan.is_active,
          },
        });
        void refetch();
      } catch {
        // toast handled in hook
      }
    },
    [updatePlan, refetch],
  );

  const columns: DataTableColumn<PlansRowItem>[] = useMemo(
    () => [
      {
        id: "name",
        header: t("features.subscriptions.plans.columns.name", {
          defaultValue: "نام و عنوان پلن",
        }),
        cell: (item) => (
          <div className="space-y-0.5">
            <span className="text-foreground block text-sm font-bold">
              {item.display_name || item.name}
            </span>
            <div className="flex items-center gap-2">
              <code className="text-muted-foreground font-mono text-xs">
                {item.name}
              </code>
              {item.is_recommended && (
                <Badge
                  variant="default"
                  className="gap-1 bg-amber-500 px-1.5 py-0 text-[10px] text-white"
                >
                  <Star className="size-2.5 fill-white" />
                  {t("features.subscriptions.plans.recommended", {
                    defaultValue: "پیشنهادی",
                  })}
                </Badge>
              )}
              {item.is_default && (
                <Badge
                  variant="outline"
                  className="text-primary border-primary/30 px-1.5 py-0 text-[10px]"
                >
                  {t("features.subscriptions.plans.default", {
                    defaultValue: "پیش‌فرض",
                  })}
                </Badge>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "duration_days",
        header: t("features.subscriptions.plans.columns.duration", {
          defaultValue: "مدت اعتبار",
        }),
        cell: (item) => (
          <span className="text-xs font-semibold">
            {faNumber(item.duration_days ?? 30)} روز
          </span>
        ),
      },
      {
        id: "prices",
        header: t("features.subscriptions.plans.columns.prices", {
          defaultValue: "قیمت ریالی",
        }),
        cell: (item) => (
          <div className="space-y-0.5 font-mono text-xs">
            {item.discounted_price_irr ? (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-600">
                  {faNumber(item.discounted_price_irr)} ریال
                </span>
                {item.base_price_irr &&
                  item.base_price_irr !== item.discounted_price_irr && (
                    <span className="text-muted-foreground text-[11px] line-through">
                      {faNumber(item.base_price_irr)}
                    </span>
                  )}
              </div>
            ) : item.base_price_irr ? (
              <span className="font-medium">
                {faNumber(item.base_price_irr)} ریال
              </span>
            ) : (
              <span className="text-muted-foreground">رایگان</span>
            )}
          </div>
        ),
      },
      {
        id: "gift",
        header: t("features.subscriptions.plans.columns.gift", {
          defaultValue: "اعتبار هدیه",
        }),
        cell: (item) =>
          item.balance_gift_amount_usdmicro ? (
            <UsdmicroAmount
              value={item.balance_gift_amount_usdmicro}
              className="text-xs"
            />
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          ),
      },
      {
        id: "studio",
        header: t("features.subscriptions.plans.columns.studio", {
          defaultValue: "استودیو",
        }),
        cell: (item) =>
          hasStudioScopes(Array.from(item.scopes)) ? (
            <span className="text-xs font-semibold">
              {faNumber(readCaptionPresetLimit(item.settings))}{" "}
              {t("features.subscriptions.plans.columns.studioPresets", {
                defaultValue: "قالب ذخیره‌شده",
              })}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          ),
      },
      {
        id: "status",
        header: t("features.subscriptions.plans.columns.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) =>
          item.is_active ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              {t("features.subscriptions.plans.active", {
                defaultValue: "فعال",
              })}
            </Badge>
          ) : (
            <Badge variant="muted" className="gap-1">
              <XCircle className="size-3" />
              {t("features.subscriptions.plans.inactive", {
                defaultValue: "غیرفعال",
              })}
            </Badge>
          ),
      },
      {
        id: "actions",
        header: t("common.actions", { defaultValue: "عملیات" }),
        className: "text-center",
        cell: (item) => (
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(item)}
              aria-label="ویرایش پلن"
              className="h-8 cursor-pointer gap-1.5 px-2.5 text-xs"
            >
              <Edit className="size-3.5" />
              {t("common.edit", { defaultValue: "ویرایش" })}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdatingPlan}
              onClick={() => handleToggleActive(item)}
              aria-label="تغییر وضعیت فعال‌بودن"
              className="text-muted-foreground hover:text-foreground h-8 cursor-pointer gap-1.5 px-2.5 text-xs"
            >
              {item.is_active ? (
                <>
                  <XCircle className="text-destructive size-3.5" />
                  غیرفعال‌سازی
                </>
              ) : (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  فعال‌سازی
                </>
              )}
            </Button>
          </div>
        ),
      },
    ],
    [handleToggleActive, isUpdatingPlan, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Package aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.subscriptions.menuTitle", {
              defaultValue: "اشتراک‌ها",
            })}
          </span>
          <span>/</span>
          <span>
            {t("features.subscriptions.plans.title", {
              defaultValue: "پلن‌ها",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("features.subscriptions.plans.title", {
                defaultValue: "مدیریت پلن‌های اشتراکی",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("features.subscriptions.plans.description", {
                defaultValue:
                  "تعریف و ویرایش پلن‌ها، قیمت‌گذاری، تعیین مدت اعتبار و سهمیه ابزارهای هوش مصنوعی",
              })}
            </p>
          </div>

          <Button
            onClick={handleCreateClick}
            className="cursor-pointer gap-2 shadow-xs"
          >
            <PlusCircle className="size-4" />
            {t("features.subscriptions.plans.createNew", {
              defaultValue: "افزودن پلن جدید",
            })}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Search */}
          <div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("features.subscriptions.plans.searchPlaceholder", {
                defaultValue: "جستجو در نام و توضیحات پلن...",
              })}
            />
          </div>

          {/* Active Filter */}
          <div>
            <Select
              value={
                filters.is_active === undefined
                  ? "all"
                  : filters.is_active
                    ? "true"
                    : "false"
              }
              onChange={(e) =>
                setFilter(
                  "is_active",
                  e.target.value === "all"
                    ? undefined
                    : e.target.value === "true",
                )
              }
              aria-label="فیلتر وضعیت پلن"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="true">فقط پلن‌های فعال</option>
              <option value="false">فقط پلن‌های غیرفعال</option>
            </Select>
          </div>

          {/* Default Filter */}
          <div>
            <Select
              value={
                filters.is_default === undefined
                  ? "all"
                  : filters.is_default
                    ? "true"
                    : "false"
              }
              onChange={(e) =>
                setFilter(
                  "is_default",
                  e.target.value === "all"
                    ? undefined
                    : e.target.value === "true",
                )
              }
              aria-label="فیلتر پلن پیش‌فرض"
            >
              <option value="all">همه پلن‌ها (عادی و پیش‌فرض)</option>
              <option value="true">فقط پلن پیش‌فرض</option>
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

      {/* Plans Table */}
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

      {/* Plan Form Modal (Create / Edit) */}
      <PlanFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialPlan={editingPlan}
        onSuccess={() => {
          void refetch();
        }}
      />
    </div>
  );
}
